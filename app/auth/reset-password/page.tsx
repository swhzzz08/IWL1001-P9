"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 10,
        padding: "16px 20px",
        color: "#dc2626",
        fontSize: 15,
        lineHeight: 1.6,
      }}>
        No reset token found. Please{" "}
        <a href="/auth/forgot-password" style={{ color: "#dc2626", fontWeight: 600 }}>
          request a new reset link
        </a>
        .
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please request a new reset link.")
      return
    }
    router.push("/auth/login")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-text)",
          marginBottom: 6,
        }}>
          New password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
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

      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-text)",
          marginBottom: 6,
        }}>
          Confirm password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
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

      {error && (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 16,
          color: "#dc2626",
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

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
        }}
      >
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
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
          Set a new password
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: 0 }}>
          Choose a strong password for your account
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
            <Suspense fallback={<div style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
