# Auth Pages Design

**Date:** 2026-07-27  
**Branch:** account-creation  
**Scope:** Step 9 of auth-implementation-guide.md — four pages under `app/auth/`

---

## Pages to Build

| Route | File | Purpose |
|-------|------|---------|
| `/auth/login` | `app/auth/login/page.tsx` | Email/password + OAuth sign-in |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Request password reset email |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Set new password via token |
| `/auth/error` | `app/auth/error/page.tsx` | Display Auth.js error codes |

---

## Layout Structure

All pages use the global Navbar and Footer (provided automatically by `app/layout.tsx`). Each page body follows:

```
<hero>           teal gradient banner ~180px tall, page title + subtitle
<section>        off-white background (--color-background)
  <card>         white card, max-width 480px, centered, 1.5px border
    {content}
```

---

## Shared Style Rules

Matching the project's existing inline-style pattern:

- **Hero:** `linear-gradient(135deg, #0f766e, #0d9488)`, white text, Outfit font heading
- **Card:** `background: var(--color-surface)`, `border: 1.5px solid var(--color-border)`, `borderRadius: 16`, `boxShadow: 0 2px 12px rgba(0,0,0,0.03)`
- **Inputs:** `height: 44px`, `borderRadius: 10`, `border: 1.5px solid var(--color-border)`, teal border on focus (`#0f766e`)
- **Primary button:** `background: linear-gradient(135deg, #0f766e, #0d9488)`, full width, white text, `borderRadius: 10`
- **OAuth buttons:** bordered (`1.5px solid var(--color-border)`), side by side, inline SVG icons (Google, GitHub)
- **Error text:** `color: #dc2626`, `background: #fef2f2`, small red card
- **Success text:** `color: #16a34a`, `background: #f0fdf4`
- **Fonts:** Plus Jakarta Sans (body), Outfit (headings)

---

## Page Designs

### `/auth/login` — "Welcome back"

**Hero:** Title "Welcome back", subtitle "Sign in to your MarketWise account"

**Card content:**
1. Email input (type email, label "Email")
2. Password input (type password, label "Password")
3. "Forgot password?" link — right-aligned, below password field, links to `/auth/forgot-password`
4. "Sign in" primary button (full width) — calls `signIn("credentials", { email, password, redirectTo: "/" })`
5. Divider: `── or continue with ──`
6. Google button + GitHub button side by side — call `signIn("google")` / `signIn("github")`
7. Footer link: "Don't have an account? **Sign up**" → `/auth/register` (placeholder route)

**Error handling:** If `signIn` returns an error, show inline red error below the form ("Invalid email or password").

---

### `/auth/forgot-password` — "Reset your password"

**Hero:** Title "Reset your password", subtitle "We'll send you a link to reset it"

**Card content (default state):**
1. Email input (type email, label "Email address")
2. "Send reset link" primary button — POSTs to `/api/auth/forgot-password`
3. "Back to login" link → `/auth/login`

**Card content (success state):** Replaces the form entirely.
- Green success box: "Check your inbox — if an account exists for that email, a reset link is on its way."
- "Back to login" link

No error state exposed to user (API always returns ok to avoid email enumeration).

---

### `/auth/reset-password` — "Set a new password"

**Hero:** Title "Set a new password", subtitle "Choose a strong password for your account"

**Card content:**
1. Reads `?token=` from URL via `useSearchParams` — if missing, shows error immediately
2. New password input (type password, label "New password")
3. Confirm password input (type password, label "Confirm password")
4. "Reset password" primary button — POSTs to `/api/auth/reset-password` with `{ token, password }`

**Error handling:**
- Client-side: passwords don't match → inline red error, no network call
- Server-side: token invalid/expired → red error box ("This reset link is invalid or has expired. Request a new one.")
- On success: `router.push("/auth/login")`

---

### `/auth/error` — "Something went wrong"

**Hero:** Title "Something went wrong", subtitle "There was a problem signing you in"

**Card content:**
- Reads `?error=` from URL via `useSearchParams`
- Maps Auth.js error codes to human-readable messages:

| Code | Message |
|------|---------|
| `OAuthAccountNotLinked` | An account already exists with this email. Sign in with the method you used originally. |
| `OAuthCallbackError` | There was a problem with the sign-in provider. Please try again. |
| `CredentialsSignin` | Invalid email or password. |
| `SessionRequired` | You need to be signed in to access that page. |
| *(any other)* | An unexpected error occurred. Please try again. |

- "Back to login" button → `/auth/login`

---

## Data Flow

```
login page
  ├── signIn("credentials") → Auth.js → /api/auth/[...nextauth] → redirect
  ├── signIn("google")      → OAuth flow → callback → redirect
  └── signIn("github")      → OAuth flow → callback → redirect

forgot-password page
  └── POST /api/auth/forgot-password → Resend email → success state

reset-password page
  └── POST /api/auth/reset-password → update passwordHash → redirect /auth/login

error page
  └── reads ?error= query param → static message map → display
```

---

## Implementation Notes

- All pages are `"use client"` (they use `useState`, `useSearchParams`, or `signIn`)
- `signIn` is imported from `next-auth/react` (client-side)
- `useRouter` from `next/navigation` for redirect after reset
- No new shared components needed — inline styles throughout, matching project convention
- OAuth SVG icons inlined directly (no icon library dependency)
