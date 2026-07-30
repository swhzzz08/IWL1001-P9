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

    const include = {
      holdings: { orderBy: { tickerSymbol: "asc" } },
      // Full transaction history — required for correct FIFO/LIFO/Average Cost calculations.
      // (Capping with `take` would silently drop older lots and produce wrong results.)
      transactions: { orderBy: { transactionDate: "desc" } },
      cashActivities: { orderBy: { createdAt: "desc" }, take: 10 },
    } as const

    let portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      orderBy: { id: "asc" },
      include,
    })

    // Auto-create a portfolio for OAuth sign-ups (Google/GitHub) which bypass /api/auth/register
    if (!portfolio) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, username: true } })
      portfolio = await prisma.portfolio.create({
        data: {
          userId,
          portfolioName: `${user?.name ?? user?.username ?? "My"} Portfolio`,
          baseCurrency: "USD",
          cashBalance: 100000,
        },
        include,
      })
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
      // Full history — required for FIFO/LIFO/Average Cost calculations.
      // (Capping with `take` would silently drop older lots and produce wrong results.)
      transactions: portfolio.transactions,
      recentCashActivities: portfolio.cashActivities,
    })
  } catch (error) {
    console.error("Portfolio GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}