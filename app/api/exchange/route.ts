import { NextRequest, NextResponse } from 'next/server'
import { fetchExchangeRate, isSupportedCurrency } from '@/lib/fx'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BALANCE_FIELD, getBalance, parsePositiveAmount } from '@/lib/wallet'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const from = (request.nextUrl.searchParams.get('from') ?? 'USD').toUpperCase()
  const to = (request.nextUrl.searchParams.get('to') ?? 'SGD').toUpperCase()

  if (!isSupportedCurrency(from) || !isSupportedCurrency(to)) {
    return NextResponse.json({ error: 'Supported currencies are USD, SGD, and EUR' }, { status: 400 })
  }

  try {
    const exchange = await fetchExchangeRate(from, to)
    return NextResponse.json({ from, to, ...exchange })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = Number(session?.user?.id)
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as Record<string, unknown>
    const from = typeof body.from === 'string' ? body.from.toUpperCase() : ''
    const to = typeof body.to === 'string' ? body.to.toUpperCase() : ''
    const amount = parsePositiveAmount(body.amount)

    if (!isSupportedCurrency(from) || !isSupportedCurrency(to)) {
      return NextResponse.json(
        { error: 'Supported currencies are USD, SGD, and EUR' },
        { status: 400 }
      )
    }
    if (from === to) {
      return NextResponse.json(
        { error: 'Choose two different currencies' },
        { status: 400 }
      )
    }
    if (amount === null) {
      return NextResponse.json(
        { error: 'Enter a valid amount between 0.01 and 10,000,000' },
        { status: 400 }
      )
    }

    const exchange = await fetchExchangeRate(from, to)
    const convertedAmount = Math.round(amount * exchange.rate * 100) / 100

    const balances = await prisma.$transaction(
      async (tx) => {
        const portfolio = await tx.portfolio.findFirst({
          where: { userId },
          orderBy: { id: 'asc' },
        })
        if (!portfolio) throw new ExchangeError('Portfolio not found', 404)

        const fromBalance = getBalance(portfolio, from)
        if (fromBalance + Number.EPSILON < amount) {
          throw new ExchangeError(`Insufficient ${from} balance`, 400)
        }
        const toBalance = getBalance(portfolio, to)
        const nextFromBalance = fromBalance - amount
        const nextToBalance = toBalance + convertedAmount

        await tx.portfolio.update({
          where: { id: portfolio.id },
          data: {
            [BALANCE_FIELD[from]]: nextFromBalance,
            [BALANCE_FIELD[to]]: nextToBalance,
          },
        })
        await tx.cashActivity.create({
          data: {
            portfolioId: portfolio.id,
            activityType: 'EXCHANGE',
            amount,
            fromCurrency: from,
            toCurrency: to,
            convertedAmount,
            exchangeRate: exchange.rate,
          },
        })

        return {
          from: nextFromBalance,
          to: nextToBalance,
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    )

    return NextResponse.json({
      message: `Exchanged ${amount.toFixed(2)} ${from} to ${convertedAmount.toFixed(2)} ${to}`,
      from,
      to,
      amount,
      convertedAmount,
      ...exchange,
      balances,
    })
  } catch (error) {
    if (error instanceof ExchangeError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    console.error('Currency exchange error:', error)
    return NextResponse.json({ error: 'Unable to exchange currency' }, { status: 500 })
  }
}

class ExchangeError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
