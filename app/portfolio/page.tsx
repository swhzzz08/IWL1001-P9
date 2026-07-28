"use client"

import { formatCurrency } from "@/lib/formatters"
import { WalletPanel } from "@/components/portfolio/WalletPanel"
import type { StockQuote } from "@/types/stock"
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  LoaderCircle,
  PieChart,
  RefreshCw,
  WalletCards,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

type Holding = {
  id: number
  tickerSymbol: string
  quantity: number
  averageCost: number
}

type Transaction = {
  id: number
  tickerSymbol: string
  transactionType: string
  quantity: number
  price: number
  transactionDate: string
}

type Portfolio = {
  portfolioName: string
  cashBalance: number
  baseCurrency: string
  balances: {
    USD: number
    SGD: number
    EUR: number
  }
  holdings: Holding[]
  recentTransactions: Transaction[]
  error?: string
}

type QuoteMap = Record<string, StockQuote | undefined>

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [quotes, setQuotes] = useState<QuoteMap>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [error, setError] = useState("")

  const loadPortfolio = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/portfolio", { cache: "no-store" })
      if (response.status === 401) {
        setUnauthorized(true)
        setPortfolio(null)
        return
      }

      const data = (await response.json()) as Portfolio
      if (!response.ok) throw new Error(data.error || "Could not load portfolio")

      setUnauthorized(false)
      setPortfolio(data)

      const quoteEntries = await Promise.all(
        data.holdings.map(async (holding) => {
          try {
            const quoteResponse = await fetch(
              `/api/stocks/quote?symbol=${encodeURIComponent(holding.tickerSymbol)}`
            )
            if (!quoteResponse.ok) return [holding.tickerSymbol, undefined] as const
            return [
              holding.tickerSymbol,
              (await quoteResponse.json()) as StockQuote,
            ] as const
          } catch {
            return [holding.tickerSymbol, undefined] as const
          }
        })
      )
      setQuotes(Object.fromEntries(quoteEntries))
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load portfolio"
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadPortfolio()
  }, [loadPortfolio])

  const totals = useMemo(() => {
    if (!portfolio) return { holdingsValue: 0, costBasis: 0, totalValue: 0 }

    const holdingsValue = portfolio.holdings.reduce((sum, holding) => {
      const marketPrice = quotes[holding.tickerSymbol]?.price ?? holding.averageCost
      return sum + marketPrice * holding.quantity
    }, 0)
    const costBasis = portfolio.holdings.reduce(
      (sum, holding) => sum + holding.averageCost * holding.quantity,
      0
    )

    return {
      holdingsValue,
      costBasis,
      totalValue: holdingsValue + portfolio.cashBalance,
    }
  }, [portfolio, quotes])

  if (loading) {
    return (
      <main
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          color: "var(--color-text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LoaderCircle size={20} style={{ animation: "spin 1s linear infinite" }} />
          Loading your portfolio…
        </div>
      </main>
    )
  }

  if (unauthorized) {
    return (
      <main style={{ maxWidth: 560, margin: "72px auto", padding: "0 24px" }}>
        <div
          style={{
            padding: 32,
            textAlign: "center",
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: 18,
          }}
        >
          <WalletCards size={34} color="#0f766e" />
          <h1 style={{ margin: "14px 0 8px", fontSize: 24 }}>Your portfolio awaits</h1>
          <p style={{ color: "var(--color-text-muted)", margin: "0 0 20px" }}>
            Sign in to view your cash, holdings, and recent trades.
          </p>
          <Link
            href="/auth/login"
            style={{
              display: "inline-block",
              padding: "10px 18px",
              borderRadius: 10,
              background: "#0f766e",
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  if (!portfolio || error) {
    return (
      <main style={{ maxWidth: 560, margin: "72px auto", padding: "0 24px" }}>
        <div
          role="alert"
          style={{
            padding: 24,
            borderRadius: 14,
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {error || "Portfolio could not be loaded."}
        </div>
      </main>
    )
  }

  const currency = portfolio.baseCurrency || "USD"
  const unrealizedGain = totals.holdingsValue - totals.costBasis

  const summaryCards = [
    {
      label: "USD portfolio total",
      value: formatCurrency(totals.totalValue, currency),
      icon: BriefcaseBusiness,
      color: "#0f766e",
      background: "#f0fdfa",
    },
    {
      label: "USD available",
      value: formatCurrency(portfolio.cashBalance, currency),
      icon: Banknote,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      label: "Stocks value",
      value: formatCurrency(totals.holdingsValue, currency),
      icon: PieChart,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      label: "Unrealized gain/loss",
      value: formatCurrency(unrealizedGain, currency),
      icon: unrealizedGain >= 0 ? ArrowUpRight : ArrowDownRight,
      color: unrealizedGain >= 0 ? "#15803d" : "#b91c1c",
      background: unrealizedGain >= 0 ? "#f0fdf4" : "#fef2f2",
    },
  ]

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "40px 24px 72px",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 5px",
              color: "#0f766e",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </p>
          <h1 style={{ margin: 0, fontSize: 32 }}>{portfolio.portfolioName}</h1>
          <p style={{ margin: "7px 0 0", color: "var(--color-text-muted)" }}>
            Your cash, positions, and recent trading activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadPortfolio(true)}
          disabled={refreshing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 13px",
            borderRadius: 10,
            border: "1.5px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
            cursor: refreshing ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          <RefreshCw
            size={14}
            style={refreshing ? { animation: "spin 1s linear infinite" } : undefined}
          />
          Refresh
        </button>
      </header>

      <section
        aria-label="Portfolio summary"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {summaryCards.map(({ label, value, icon: Icon, color, background }) => (
          <article
            key={label}
            style={{
              padding: 18,
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              borderRadius: 15,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: 9,
                background,
                color,
                marginBottom: 14,
              }}
            >
              <Icon size={17} />
            </div>
            <p
              style={{
                margin: "0 0 4px",
                color: "var(--color-text-muted)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {label}
            </p>
            <strong style={{ fontSize: 20, color }}>{value}</strong>
          </article>
        ))}
      </section>

      <WalletPanel
        balances={portfolio.balances}
        onChanged={() => loadPortfolio(true)}
      />

      <section
        style={{
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "17px 20px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17 }}>Your stocks</h2>
          <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
            {portfolio.holdings.length} position
            {portfolio.holdings.length === 1 ? "" : "s"}
          </span>
        </div>

        {portfolio.holdings.length === 0 ? (
          <div style={{ padding: "46px 24px", textAlign: "center" }}>
            <PieChart size={30} color="#a8a29e" />
            <h3 style={{ margin: "12px 0 5px", fontSize: 17 }}>No stocks yet</h3>
            <p
              style={{
                margin: "0 0 18px",
                color: "var(--color-text-muted)",
                fontSize: 13,
              }}
            >
              Browse the market and make your first simulated investment.
            </p>
            <Link
              href="/stocks"
              style={{ color: "#0f766e", fontWeight: 800, textDecoration: "none" }}
            >
              Browse stocks →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "var(--color-surface-2)" }}>
                  {[
                    "Stock",
                    "Shares",
                    "Average cost",
                    "Current price",
                    "Market value",
                    "Gain/loss",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "11px 16px",
                        textAlign: heading === "Stock" ? "left" : "right",
                        color: "var(--color-text-muted)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((holding) => {
                  const quote = quotes[holding.tickerSymbol]
                  const marketPrice = quote?.price ?? holding.averageCost
                  const marketValue = marketPrice * holding.quantity
                  const gain =
                    (marketPrice - holding.averageCost) * holding.quantity

                  return (
                    <tr
                      key={holding.id}
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <td style={{ padding: "15px 16px" }}>
                        <Link
                          href={`/stocks/${holding.tickerSymbol}`}
                          style={{
                            color: "var(--color-text)",
                            fontWeight: 800,
                            textDecoration: "none",
                          }}
                        >
                          {holding.tickerSymbol}
                        </Link>
                        {quote?.name && (
                          <div
                            style={{
                              color: "var(--color-text-muted)",
                              fontSize: 11,
                              marginTop: 2,
                            }}
                          >
                            {quote.name}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "15px 16px", textAlign: "right" }}>
                        {holding.quantity.toLocaleString()}
                      </td>
                      <td style={{ padding: "15px 16px", textAlign: "right" }}>
                        {formatCurrency(holding.averageCost, currency)}
                      </td>
                      <td style={{ padding: "15px 16px", textAlign: "right" }}>
                        {formatCurrency(marketPrice, currency)}
                      </td>
                      <td
                        style={{
                          padding: "15px 16px",
                          textAlign: "right",
                          fontWeight: 800,
                        }}
                      >
                        {formatCurrency(marketValue, currency)}
                      </td>
                      <td
                        style={{
                          padding: "15px 16px",
                          textAlign: "right",
                          color: gain >= 0 ? "#15803d" : "#b91c1c",
                          fontWeight: 800,
                        }}
                      >
                        {gain >= 0 ? "+" : ""}
                        {formatCurrency(gain, currency)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section
        style={{
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "17px 20px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17 }}>Recent trades</h2>
        </div>
        {portfolio.recentTransactions.length === 0 ? (
          <p
            style={{
              padding: 24,
              margin: 0,
              color: "var(--color-text-muted)",
              textAlign: "center",
              fontSize: 13,
            }}
          >
            No trades recorded yet.
          </p>
        ) : (
          portfolio.recentTransactions.map((transaction) => {
            const isBuy = transaction.transactionType === "BUY"
            return (
              <div
                key={transaction.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "14px 20px",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 9,
                      background: isBuy ? "#f0fdf4" : "#fef2f2",
                      color: isBuy ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {isBuy ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: 13 }}>
                      {transaction.transactionType} {transaction.tickerSymbol}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--color-text-muted)",
                        fontSize: 11,
                      }}
                    >
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12 }}>
                  <strong>
                    {transaction.quantity.toLocaleString()} share
                    {transaction.quantity === 1 ? "" : "s"}
                  </strong>
                  <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
                    @ {formatCurrency(transaction.price, currency)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </section>
    </main>
  )
}
