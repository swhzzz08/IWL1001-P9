"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError("Invalid email or password.")
    } else {
      window.location.href = "/"
    }
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
          Welcome back
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: 0 }}>
          Sign in to your MarketWise account
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
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: 6,
                }}>
                  Email
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

              <div style={{ marginBottom: 8 }}>
                <label style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: 6,
                }}>
                  Password
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

              <div style={{ textAlign: "right", marginBottom: 24 }}>
                <a
                  href="/auth/forgot-password"
                  style={{ fontSize: 13, color: "#0f766e", textDecoration: "none" }}
                >
                  Forgot password?
                </a>
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
                  marginBottom: 24,
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              <span style={{ fontSize: 13, color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                style={{
                  height: 44,
                  border: "1.5px solid var(--color-border)",
                  borderRadius: 10,
                  background: "var(--color-surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-text)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Google
              </button>

              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                style={{
                  height: 44,
                  border: "1.5px solid var(--color-border)",
                  borderRadius: 10,
                  background: "var(--color-surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-text)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
              Don't have an account?{" "}
              <a href="/auth/register" style={{ color: "#0f766e", fontWeight: 600, textDecoration: "none" }}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
