import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { fetchQuote } from "@/lib/stockApi"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

type TradeType = "BUY" | "SELL"

const MAX_QUANTITY = 1_000_000
const SERIALIZABLE_RETRIES = 3

function parseTrade(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body" } as const
  }

  const input = body as Record<string, unknown>
  const symbol =
    typeof input.symbol === "string" ? input.symbol.trim().toUpperCase() : ""
  const type =
    typeof input.type === "string" ? input.type.toUpperCase() : ""
  const quantity =
    typeof input.quantity === "number"
      ? input.quantity
      : Number(input.quantity)

  if (!/^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol)) {
    return { error: "Enter a valid stock symbol" } as const
  }
  if (type !== "BUY" && type !== "SELL") {
    return { error: "Transaction type must be BUY or SELL" } as const
  }
  if (
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    quantity > MAX_QUANTITY
  ) {
    return {
      error: `Quantity must be greater than 0 and no more than ${MAX_QUANTITY.toLocaleString()}`,
    } as const
  }

  return { symbol, type: type as TradeType, quantity } as const
}

async function executeTrade(
  userId: number,
  symbol: string,
  type: TradeType,
  quantity: number,
  price: number
) {
  return prisma.$transaction(
    async (tx) => {
      const portfolio = await tx.portfolio.findFirst({
        where: { userId },
        orderBy: { id: "asc" },
        include: {
          holdings: {
            where: { tickerSymbol: symbol },
          },
        },
      })

      if (!portfolio) {
        throw new TradeError("Portfolio not found", 404)
      }

      const holding = portfolio.holdings[0]
      const total = price * quantity

      if (type === "BUY" && portfolio.cashBalance + Number.EPSILON < total) {
        throw new TradeError(
          "Insufficient USD balance. Exchange SGD or EUR to USD first.",
          400
        )
      }
      if (
        type === "SELL" &&
        (!holding || holding.quantity + Number.EPSILON < quantity)
      ) {
        throw new TradeError("Insufficient shares to sell", 400)
      }

      if (type === "BUY") {
        if (holding) {
          const newQuantity = holding.quantity + quantity
          await tx.holding.update({
            where: { id: holding.id },
            data: {
              quantity: newQuantity,
              averageCost:
                (holding.averageCost * holding.quantity + total) / newQuantity,
            },
          })
        } else {
          await tx.holding.create({
            data: {
              portfolioId: portfolio.id,
              tickerSymbol: symbol,
              quantity,
              averageCost: price,
            },
          })
        }
      } else if (holding) {
        const remaining = holding.quantity - quantity
        if (remaining <= Number.EPSILON) {
          await tx.holding.delete({ where: { id: holding.id } })
        } else {
          await tx.holding.update({
            where: { id: holding.id },
            data: { quantity: remaining },
          })
        }
      }

      const cashBalance =
        type === "BUY"
          ? portfolio.cashBalance - total
          : portfolio.cashBalance + total

      await tx.portfolio.update({
        where: { id: portfolio.id },
        data: { cashBalance },
      })
      await tx.transaction.create({
        data: {
          portfolioId: portfolio.id,
          tickerSymbol: symbol,
          transactionType: type,
          quantity,
          price,
        },
      })

      const updatedHolding = await tx.holding.findFirst({
        where: { portfolioId: portfolio.id, tickerSymbol: symbol },
      })

      return {
        cashBalance,
        holdingQuantity: updatedHolding?.quantity ?? 0,
        total,
      }
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  )
}

class TradeError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = Number(session?.user?.id)
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = parseTrade(await req.json())
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const quote = await fetchQuote(parsed.symbol)
    if (!Number.isFinite(quote.price) || quote.price <= 0) {
      return NextResponse.json(
        { error: "A valid market price is not currently available" },
        { status: 503 }
      )
    }

    let result: Awaited<ReturnType<typeof executeTrade>> | undefined
    for (let attempt = 0; attempt < SERIALIZABLE_RETRIES; attempt += 1) {
      try {
        result = await executeTrade(
          userId,
          parsed.symbol,
          parsed.type,
          parsed.quantity,
          quote.price
        )
        break
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034"
        if (!retryable || attempt === SERIALIZABLE_RETRIES - 1) throw error
      }
    }

    if (!result) {
      throw new Error("Trade could not be completed")
    }

    return NextResponse.json({
      message: `${parsed.type === "BUY" ? "Bought" : "Sold"} ${parsed.quantity} share${parsed.quantity === 1 ? "" : "s"} of ${parsed.symbol}`,
      settlementCurrency: "USD",
      symbol: parsed.symbol,
      type: parsed.type,
      quantity: parsed.quantity,
      executionPrice: quote.price,
      ...result,
    })
  } catch (error) {
    if (error instanceof TradeError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error("Trade error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
