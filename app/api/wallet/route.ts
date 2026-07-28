import { auth } from "@/lib/auth"
import { isSupportedCurrency } from "@/lib/fx"
import { prisma } from "@/lib/prisma"
import { BALANCE_FIELD, getBalance, parsePositiveAmount } from "@/lib/wallet"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

type WalletAction = "DEPOSIT" | "WITHDRAW"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = Number(session?.user?.id)
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json()) as Record<string, unknown>
    const action =
      typeof body.action === "string" ? body.action.toUpperCase() : ""
    const currency =
      typeof body.currency === "string" ? body.currency.toUpperCase() : ""
    const amount = parsePositiveAmount(body.amount)

    if (action !== "DEPOSIT" && action !== "WITHDRAW") {
      return NextResponse.json(
        { error: "Action must be DEPOSIT or WITHDRAW" },
        { status: 400 }
      )
    }
    if (!isSupportedCurrency(currency)) {
      return NextResponse.json(
        { error: "Currency must be USD, SGD, or EUR" },
        { status: 400 }
      )
    }
    if (amount === null) {
      return NextResponse.json(
        { error: "Enter a valid amount between 0.01 and 10,000,000" },
        { status: 400 }
      )
    }

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { userId, isActive: true },
      select: { id: true },
    })
    if (!paymentMethod) {
      return NextResponse.json(
        {
          error:
            "Add a bank account or card in your profile before depositing or withdrawing",
          code: "PAYMENT_METHOD_REQUIRED",
        },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const portfolio = await tx.portfolio.findFirst({
          where: { userId },
          orderBy: { id: "asc" },
        })
        if (!portfolio) throw new WalletError("Portfolio not found", 404)

        const currentBalance = getBalance(portfolio, currency)
        if (
          action === "WITHDRAW" &&
          currentBalance + Number.EPSILON < amount
        ) {
          throw new WalletError(`Insufficient ${currency} balance`, 400)
        }

        const balance = action === "DEPOSIT"
          ? currentBalance + amount
          : currentBalance - amount

        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: { [BALANCE_FIELD[currency]]: balance },
        })
        await tx.cashActivity.create({
          data: {
            portfolioId: portfolio.id,
            activityType: action,
            currency,
            amount,
          },
        })

        return { balance }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )

    return NextResponse.json({
      message: `${action === "DEPOSIT" ? "Deposited" : "Withdrew"} ${amount.toFixed(2)} ${currency}`,
      action: action as WalletAction,
      currency,
      amount,
      balance: result.balance,
    })
  } catch (error) {
    if (error instanceof WalletError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error("Wallet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

class WalletError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}
