import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.userId },
      include: {
        holdings: true,
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 10,
        },
      },
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    return NextResponse.json({
      portfolioId: portfolio.id,
      portfolioName: portfolio.portfolioName,
      cashBalance: portfolio.cashBalance,
      baseCurrency: portfolio.baseCurrency,
      holdings: portfolio.holdings,
      recentTransactions: portfolio.transactions,
    })
  } catch (error) {
    console.error('Portfolio GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
