"use client"

import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, #0f766e, #0d9488)",
        padding: "56px 24px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "Outfit, system-ui, sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: "white",
          margin: "0 0 8px",
        }}>
          Reset your password
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: 0 }}>
          We'll send you a link to reset it
        </p>
      </div>

      <section style={{
        background: "var(--color-background)",
        padding: "48px 24px 72px",
        minHeight: "calc(100vh - 400px)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: 16,
            padding: "36px 32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
          }}>
            {submitted ? (
              <>
                <div style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 24,
                  color: "#16a34a",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}>
                  Check your inbox — if an account exists for that email, a reset link is on its way.
                </div>
                <a
                  href="/auth/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 14,
                    color: "#0f766e",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  ← Back to login
                </a>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text)",
                    marginBottom: 6,
                  }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 12px",
                      borderRadius: 10,
                      border: "1.5px solid var(--color-border)",
                      background: "var(--color-surface)",
                      fontSize: 15,
                      color: "var(--color-text)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 44,
                    background: "linear-gradient(135deg, #0f766e, #0d9488)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    marginBottom: 20,
                  }}
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>

                <a
                  href="/auth/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 14,
                    color: "#0f766e",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  ← Back to login
                </a>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
