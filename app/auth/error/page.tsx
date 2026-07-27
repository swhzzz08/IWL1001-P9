"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "An account already exists with this email. Sign in with the method you used originally.",
  OAuthCallbackError:
    "There was a problem with the sign-in provider. Please try again.",
  CredentialsSignin:
    "Invalid email or password.",
  SessionRequired:
    "You need to be signed in to access that page.",
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") ?? ""
  const message = ERROR_MESSAGES[error] ?? "An unexpected error occurred. Please try again."

  return (
    <div style={{
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: 10,
      padding: "16px 20px",
      marginBottom: 24,
      color: "#dc2626",
      fontSize: 15,
      lineHeight: 1.6,
    }}>
      {message}
    </div>
  )
}

export default function AuthErrorPage() {
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
          Something went wrong
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: 0 }}>
          There was a problem signing you in
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
              <ErrorContent />
            </Suspense>

            <a
              href="/auth/login"
              style={{
                display: "block",
                height: 44,
                lineHeight: "44px",
                background: "linear-gradient(135deg, #0f766e, #0d9488)",
                color: "white",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Back to login
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
