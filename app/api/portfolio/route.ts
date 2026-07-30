import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    const userId = Number(session?.user?.id)
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      orderBy: { id: "asc" },
      include: {
        holdings: {
          orderBy: { tickerSymbol: "asc" },
        },
        // Full transaction history — required for correct FIFO/LIFO/Average Cost calculations.
        // (Capping this with `take` would silently drop older lots and produce wrong results
        // for any account with more than a handful of trades.)
        transactions: {
          orderBy: { transactionDate: "desc" },
        },
        cashActivities: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json({
      portfolioId: portfolio.id,
      portfolioName: portfolio.portfolioName,
      cashBalance: portfolio.cashBalance,
      baseCurrency: portfolio.baseCurrency,
      balances: {
        USD: portfolio.cashBalance,
        SGD: portfolio.sgdBalance,
        EUR: portfolio.eurBalance,
      },
      holdings: portfolio.holdings,
      // Full history — powers the Accounting Method Explorer / Scenario Explorer.
      transactions: portfolio.transactions,
      // Capped slice — just for the "Recent trades" list in the UI.
      recentTransactions: portfolio.transactions.slice(0, 10),
      recentCashActivities: portfolio.cashActivities,
    })
  } catch (error) {
    console.error("Portfolio GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}