"use client"

import {
  Building2,
  CreditCard,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

type MethodType = "BANK" | "CARD"

type PaymentMethod = {
  id: number
  methodType: MethodType
  accountHolder: string
  providerName: string
  lastFour: string
  expiryMonth: number | null
  expiryYear: number | null
}

export default function ProfilePage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [methodType, setMethodType] = useState<MethodType>("BANK")
  const [accountHolder, setAccountHolder] = useState("")
  const [providerName, setProviderName] = useState("")
  const [lastFour, setLastFour] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [unauthorized, setUnauthorized] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadMethods = useCallback(async () => {
    try {
      const response = await fetch("/api/payment-methods", { cache: "no-store" })
      if (response.status === 401) {
        setUnauthorized(true)
        return
      }
      const data = await response.json() as {
        paymentMethods?: PaymentMethod[]
        error?: string
      }
      if (!response.ok) throw new Error(data.error || "Could not load payment methods")
      setUnauthorized(false)
      setMethods(data.paymentMethods || [])
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load payment methods"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMethods()
  }, [loadMethods])

  async function addMethod(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodType,
          accountHolder,
          providerName,
          lastFour,
          expiryMonth: methodType === "CARD" ? Number(expiryMonth) : undefined,
          expiryYear: methodType === "CARD" ? Number(expiryYear) : undefined,
        }),
      })
      const data = await response.json() as { error?: string; message?: string }
      if (!response.ok) throw new Error(data.error || "Could not add payment method")

      setMessage(data.message || "Payment method added")
      setAccountHolder("")
      setProviderName("")
      setLastFour("")
      setExpiryMonth("")
      setExpiryYear("")
      await loadMethods()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not add payment method"
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function removeMethod(id: number) {
    setError("")
    setMessage("")
    try {
      const response = await fetch("/api/payment-methods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json() as { error?: string; message?: string }
      if (!response.ok) throw new Error(data.error || "Could not remove method")
      setMessage(data.message || "Payment method removed")
      await loadMethods()
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Could not remove method"
      )
    }
  }

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
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <LoaderCircle size={19} style={{ animation: "spin 1s linear infinite" }} />
          Loading profile…
        </span>
      </main>
    )
  }

  if (unauthorized) {
    return (
      <main style={{ maxWidth: 540, margin: "72px auto", padding: "0 24px" }}>
        <section
          style={{
            padding: 32,
            textAlign: "center",
            borderRadius: 18,
            border: "1.5px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <UserRound size={32} color="#0f766e" />
          <h1 style={{ margin: "12px 0 8px" }}>Sign in to your profile</h1>
          <Link href="/auth/login" style={{ color: "#0f766e", fontWeight: 800 }}>
            Go to sign in
          </Link>
        </section>
      </main>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 42,
    borderRadius: 10,
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface-2)",
    color: "var(--color-text)",
    padding: "0 12px",
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 72px" }}>
      <header style={{ marginBottom: 24 }}>
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
          Profile
        </p>
        <h1 style={{ margin: 0, fontSize: 32 }}>Payment setup</h1>
        <p style={{ margin: "7px 0 0", color: "var(--color-text-muted)" }}>
          Add a bank account or card before making deposits or withdrawals.
        </p>
      </header>

      <section
        style={{
          display: "flex",
          gap: 11,
          padding: 15,
          borderRadius: 13,
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          marginBottom: 20,
        }}
      >
        <ShieldCheck size={20} color="#2563eb" style={{ flexShrink: 0 }} />
        <p style={{ margin: 0, color: "#1e40af", fontSize: 13, lineHeight: 1.6 }}>
          This simulated app stores only the last four digits for display. Never
          enter a full card number, CVV, PIN, or complete bank account number.
        </p>
      </section>

      <section
        style={{
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: "0 0 15px", fontSize: 18 }}>Saved methods</h2>
        {methods.length === 0 ? (
          <p
            style={{
              margin: 0,
              padding: 18,
              borderRadius: 11,
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            No payment method configured yet.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 9 }}>
            {methods.map((method) => {
              const Icon = method.methodType === "BANK" ? Building2 : CreditCard
              return (
                <article
                  key={method.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "13px 15px",
                    borderRadius: 12,
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 9,
                        background: method.methodType === "BANK" ? "#ecfeff" : "#eff6ff",
                        color: method.methodType === "BANK" ? "#0f766e" : "#2563eb",
                      }}
                    >
                      <Icon size={17} />
                    </div>
                    <div>
                      <strong style={{ fontSize: 13 }}>
                        {method.providerName} •••• {method.lastFour}
                      </strong>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--color-text-muted)",
                          fontSize: 11,
                        }}
                      >
                        {method.accountHolder}
                        {method.methodType === "CARD" && method.expiryMonth
                          ? ` · Expires ${String(method.expiryMonth).padStart(2, "0")}/${method.expiryYear}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeMethod(method.id)}
                    aria-label={`Remove ${method.providerName} ending ${method.lastFour}`}
                    style={{
                      width: 34,
                      height: 34,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 9,
                      border: "1px solid #fecaca",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section
        style={{
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h2 style={{ margin: "0 0 15px", fontSize: 18 }}>Add a payment method</h2>
        <form onSubmit={addMethod}>
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: 4,
              borderRadius: 11,
              background: "var(--color-surface-2)",
              marginBottom: 16,
            }}
          >
            {(["BANK", "CARD"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMethodType(type)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: 10,
                  border: "none",
                  borderRadius: 9,
                  cursor: "pointer",
                  background:
                    methodType === type ? "var(--color-surface)" : "transparent",
                  color:
                    methodType === type ? "#0f766e" : "var(--color-text-muted)",
                  fontWeight: 800,
                }}
              >
                {type === "BANK" ? <Building2 size={15} /> : <CreditCard size={15} />}
                {type === "BANK" ? "Bank account" : "Card"}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 13,
            }}
          >
            <Field label="Account holder">
              <input
                value={accountHolder}
                onChange={(event) => setAccountHolder(event.target.value)}
                required
                maxLength={100}
                style={inputStyle}
              />
            </Field>
            <Field label={methodType === "BANK" ? "Bank name" : "Card provider"}>
              <input
                value={providerName}
                onChange={(event) => setProviderName(event.target.value)}
                placeholder={methodType === "BANK" ? "e.g. DBS" : "e.g. Visa"}
                required
                maxLength={100}
                style={inputStyle}
              />
            </Field>
            <Field
              label={
                methodType === "BANK"
                  ? "Last 4 digits of account"
                  : "Last 4 digits of card"
              }
            >
              <input
                value={lastFour}
                onChange={(event) =>
                  setLastFour(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                inputMode="numeric"
                pattern="\d{4}"
                placeholder="1234"
                required
                style={inputStyle}
              />
            </Field>
            {methodType === "CARD" && (
              <>
                <Field label="Expiry month">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={expiryMonth}
                    onChange={(event) => setExpiryMonth(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </Field>
                <Field label="Expiry year">
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 25}
                    value={expiryYear}
                    onChange={(event) => setExpiryYear(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </Field>
              </>
            )}
          </div>

          {error && (
            <p
              role="alert"
              style={{
                margin: "13px 0 0",
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
                margin: "13px 0 0",
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

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "11px 16px",
              border: "none",
              borderRadius: 10,
              background: "#0f766e",
              color: "white",
              fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.65 : 1,
            }}
          >
            <Plus size={16} />
            {submitting ? "Saving…" : "Add payment method"}
          </button>
        </form>
      </section>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  )
}
