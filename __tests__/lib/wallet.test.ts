import { BALANCE_FIELD, getBalance, parsePositiveAmount } from "@/lib/wallet"

describe("wallet helpers", () => {
  const portfolio = {
    cashBalance: 120,
    sgdBalance: 80,
    eurBalance: 40,
  }

  it("maps supported currencies to their stored balances", () => {
    expect(getBalance(portfolio, "USD")).toBe(120)
    expect(getBalance(portfolio, "SGD")).toBe(80)
    expect(getBalance(portfolio, "EUR")).toBe(40)
    expect(BALANCE_FIELD.USD).toBe("cashBalance")
  })

  it("accepts positive amounts and rounds them to cents", () => {
    expect(parsePositiveAmount("25.555")).toBe(25.56)
    expect(parsePositiveAmount(0.01)).toBe(0.01)
  })

  it("rejects zero, negative, non-numeric, and excessive amounts", () => {
    expect(parsePositiveAmount(0)).toBeNull()
    expect(parsePositiveAmount(-1)).toBeNull()
    expect(parsePositiveAmount("not-a-number")).toBeNull()
    expect(parsePositiveAmount(10_000_000.01)).toBeNull()
  })
})
