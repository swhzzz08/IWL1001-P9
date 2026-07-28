"use client"

import { formatCurrency } from "@/lib/formatters"
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from "@/lib/fx"
import { ArrowDownToLine, ArrowUpFromLine, Landmark } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type WalletAction = "DEPOSIT" | "WITHDRAW"

export function WalletPanel({
  balances,
  onChanged,
}: {
  balances: Record<SupportedCurrency, number>
  onChanged: () => Promise<void>
}) {
  const [action, setAction] = useState<WalletAction>("DEPOSIT")
  const [currency, setCurrency] = useState<SupportedCurrency>("USD")
  const [amount, setAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setMessage("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, currency, amount: Number(amount) }),
      })
      const data = await response.json() as { error?: string; message?: string }
      if (!response.ok) throw new Error(data.error || "Transaction failed")

      setMessage(data.message || "Wallet updated")
      setAmount("")
      await onChanged()
    } catch (walletError) {
      setError(
        walletError instanceof Error ? walletError.message : "Transaction failed"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      style={{
        background: "var(--color-surface)",
        border: "1.5px solid var(--color-border)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 38,
              height: 38,
              display: "grid",
              placeItems: "center",
              borderRadius: 10,
              background: "#ecfeff",
              color: "#0f766e",
            }}
          >
            <Landmark size={19} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Cash wallet</h2>
            <p
              style={{
                margin: "3px 0 0",
                color: "var(--color-text-muted)",
                fontSize: 12,
              }}
            >
              Simulated deposits and withdrawals in USD, SGD, and EUR.
            </p>
          </div>
        </div>
        <Link
          href="/exchange"
          style={{
            padding: "8px 12px",
            borderRadius: 9,
            background: "#0f766e",
            color: "white",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          Exchange currency
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 9,
          marginBottom: 18,
        }}
      >
        {SUPPORTED_CURRENCIES.map((code) => (
          <div
            key={code}
            style={{
              padding: "12px 14px",
              borderRadius: 11,
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: 11,
                fontWeight: 800,
                marginBottom: 3,
              }}
            >
              {code} BALANCE
            </div>
            <strong style={{ fontSize: 16 }}>
              {formatCurrency(balances[code], code)}
            </strong>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
          alignItems: "end",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 4,
            borderRadius: 10,
            background: "var(--color-surface-2)",
          }}
        >
          {(["DEPOSIT", "WITHDRAW"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAction(item)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 8,
                padding: "9px 8px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 800,
                background: action === item ? "var(--color-surface)" : "transparent",
                color: action === item ? "#0f766e" : "var(--color-text-muted)",
              }}
            >
              {item === "DEPOSIT" ? "Deposit" : "Withdraw"}
            </button>
          ))}
        </div>
        <label style={{ display: "grid", gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>Currency</span>
          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as SupportedCurrency)
            }
            style={{
              height: 40,
              borderRadius: 9,
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text)",
              padding: "0 10px",
            }}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
        </label>
        <label style={{ display: "grid", gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>Amount</span>
          <input
            type="number"
            min="0.01"
            max="10000000"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
            style={{
              height: 40,
              borderRadius: 9,
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text)",
              padding: "0 10px",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            border: "none",
            borderRadius: 9,
            background: action === "DEPOSIT" ? "#16a34a" : "#dc2626",
            color: "white",
            fontWeight: 800,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.65 : 1,
          }}
        >
          {action === "DEPOSIT" ? (
            <ArrowDownToLine size={15} />
          ) : (
            <ArrowUpFromLine size={15} />
          )}
          {submitting
            ? "Processing…"
            : action === "DEPOSIT"
              ? "Deposit"
              : "Withdraw"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          style={{
            margin: "12px 0 0",
            padding: "9px 11px",
            borderRadius: 8,
            background: "#fef2f2",
            color: "#b91c1c",
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
            margin: "12px 0 0",
            padding: "9px 11px",
            borderRadius: 8,
            background: "#f0fdf4",
            color: "#15803d",
            fontSize: 12,
          }}
        >
          {message}
        </p>
      )}
    </section>
  )
}
