"use client"

import type { StockQuote } from "@/types/stock"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

type Side = "BUY" | "SELL"

type PortfolioResponse = {
  cashBalance: number
  baseCurrency: string
  holdings: Array<{
    tickerSymbol: string
    quantity: number
    averageCost: number
  }>
  error?: string
}

type TradeResponse = {
  message?: string
  error?: string
  executionPrice?: number
  cashBalance?: number
  holdingQuantity?: number
}

export function TradeTicket({
  symbol,
  quote,
}: {
  symbol: string
  quote: StockQuote | null
}) {
  const [side, setSide] = useState<Side>("BUY")
  const [quantity, setQuantity] = useState("1")
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const loadPortfolio = useCallback(async () => {
    setLoadingPortfolio(true)
    try {
      const response = await fetch("/api/portfolio", { cache: "no-store" })
      if (response.status === 401) {
        setUnauthorized(true)
        setPortfolio(null)
        return
      }
      const data = (await response.json()) as PortfolioResponse
      if (!response.ok) throw new Error(data.error || "Could not load portfolio")
      setUnauthorized(false)
      setPortfolio(data)
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load portfolio"
      )
    } finally {
      setLoadingPortfolio(false)
    }
  }, [])

  useEffect(() => {
    void loadPortfolio()
  }, [loadPortfolio])

  const numericQuantity = Number(quantity)
  const estimatedTotal =
    quote && Number.isFinite(numericQuantity) && numericQuantity > 0
      ? quote.price * numericQuantity
      : 0
  const holding = portfolio?.holdings.find(
    (item) => item.tickerSymbol === symbol
  )
  const ownedQuantity = holding?.quantity ?? 0

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: portfolio?.baseCurrency || "USD",
        maximumFractionDigits: 2,
      }),
    [portfolio?.baseCurrency]
  )

  async function submitTrade(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setMessage("")

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      setError("Enter a quantity greater than 0")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, quantity: numericQuantity, type: side }),
      })
      const data = (await response.json()) as TradeResponse
      if (!response.ok) throw new Error(data.error || "Trade could not be completed")

      setMessage(
        `${data.message} at ${formatter.format(data.executionPrice ?? 0)}.`
      )
      setQuantity("1")
      await loadPortfolio()
    } catch (tradeError) {
      setError(
        tradeError instanceof Error
          ? tradeError.message
          : "Trade could not be completed"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const tabStyle = (tab: Side): React.CSSProperties => ({
    flex: 1,
    border: "none",
    borderRadius: 9,
    padding: "9px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
    background:
      side === tab ? (tab === "BUY" ? "#dcfce7" : "#fee2e2") : "transparent",
    color:
      side === tab
        ? tab === "BUY"
          ? "#15803d"
          : "#b91c1c"
        : "var(--color-text-muted)",
  })

  return (
    <section
      style={{
        background: "var(--color-surface)",
        border: "1.5px solid var(--color-border)",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, margin: 0, color: "var(--color-text)" }}>
            Trade {symbol}
          </h2>
          <p
            style={{
              fontSize: 12,
              margin: "4px 0 0",
              color: "var(--color-text-muted)",
            }}
          >
            Orders execute at the latest available market price and settle in USD.
          </p>
        </div>
        {quote && (
          <strong style={{ color: "var(--color-text)", fontSize: 18 }}>
            {formatter.format(quote.price)}
          </strong>
        )}
      </div>

      {unauthorized ? (
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: "var(--color-surface-2)",
            fontSize: 13,
            color: "var(--color-text-muted)",
          }}
        >
          <Link href="/auth/login" style={{ color: "#0f766e", fontWeight: 800 }}>
            Sign in
          </Link>{" "}
          to buy or sell stocks.
        </div>
      ) : (
        <form onSubmit={submitTrade}>
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              borderRadius: 12,
              background: "var(--color-surface-2)",
              marginBottom: 16,
            }}
          >
            <button type="button" onClick={() => setSide("BUY")} style={tabStyle("BUY")}>
              Buy
            </button>
            <button type="button" onClick={() => setSide("SELL")} style={tabStyle("SELL")}>
              Sell
            </button>
          </div>

          <label
            htmlFor="trade-quantity"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 6,
              color: "var(--color-text-muted)",
            }}
          >
            Quantity
          </label>
          <input
            id="trade-quantity"
            type="number"
            min="0.000001"
            max="1000000"
            step="any"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            disabled={submitting}
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 12px",
              border: "1.5px solid var(--color-border)",
              borderRadius: 10,
              background: "var(--color-background)",
              color: "var(--color-text)",
              fontSize: 14,
              marginBottom: 14,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 8,
              padding: 12,
              borderRadius: 10,
              background: "var(--color-surface-2)",
              fontSize: 12,
              color: "var(--color-text-muted)",
              marginBottom: 14,
            }}
          >
            <span>
              USD cash:{" "}
              <strong style={{ color: "var(--color-text)" }}>
                {loadingPortfolio
                  ? "Loading…"
                  : formatter.format(portfolio?.cashBalance ?? 0)}
              </strong>
            </span>
            <span>
              Owned:{" "}
              <strong style={{ color: "var(--color-text)" }}>
                {loadingPortfolio ? "Loading…" : ownedQuantity}
              </strong>
            </span>
            <span>
              Estimated {side === "BUY" ? "cost" : "proceeds"}:{" "}
              <strong style={{ color: "var(--color-text)" }}>
                {formatter.format(estimatedTotal)}
              </strong>
            </span>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                borderRadius: 9,
                padding: "9px 11px",
                fontSize: 12,
              }}
            >
              {error}
            </p>
          )}
          {message && (
            <p
              role="status"
              style={{
                background: "#f0fdf4",
                color: "#15803d",
                borderRadius: 9,
                padding: "9px 11px",
                fontSize: 12,
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || loadingPortfolio || !quote}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 10,
              padding: "12px 16px",
              cursor:
                submitting || loadingPortfolio || !quote
                  ? "not-allowed"
                  : "pointer",
              fontSize: 14,
              fontWeight: 800,
              background: side === "BUY" ? "#16a34a" : "#dc2626",
              color: "white",
              opacity: submitting || loadingPortfolio || !quote ? 0.6 : 1,
            }}
          >
            {submitting ? "Submitting…" : `${side === "BUY" ? "Buy" : "Sell"} ${symbol}`}
          </button>
        </form>
      )}
    </section>
  )
}
