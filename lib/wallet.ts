import type { Portfolio } from "@prisma/client"
import type { SupportedCurrency } from "@/lib/fx"

export const MAX_CASH_AMOUNT = 10_000_000

export type BalanceField = "cashBalance" | "sgdBalance" | "eurBalance"

export const BALANCE_FIELD: Record<SupportedCurrency, BalanceField> = {
  USD: "cashBalance",
  SGD: "sgdBalance",
  EUR: "eurBalance",
}

export function getBalance(
  portfolio: Pick<Portfolio, BalanceField>,
  currency: SupportedCurrency
) {
  return portfolio[BALANCE_FIELD[currency]]
}

export function parsePositiveAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_CASH_AMOUNT) {
    return null
  }
  return Math.round(amount * 100) / 100
}
