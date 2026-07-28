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
        transactions: {
          orderBy: { transactionDate: "desc" },
          take: 10,
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
      recentTransactions: portfolio.transactions,
      recentCashActivities: portfolio.cashActivities,
    })
  } catch (error) {
    console.error("Portfolio GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
