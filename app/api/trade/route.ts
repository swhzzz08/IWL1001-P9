import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production"

function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symbol, quantity, price, type } = await req.json()

    if (!symbol || !quantity || !price || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["BUY", "SELL"].includes(type.toUpperCase())) {
      return NextResponse.json({ error: "Transaction type must be BUY or SELL" }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.userId },
      include: { holdings: true },
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    const totalCost = quantity * price

    if (type.toUpperCase() === "BUY") {
      if (portfolio.cashBalance < totalCost) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
      }

      const existingHolding = portfolio.holdings.find(
        (h) => h.tickerSymbol === symbol.toUpperCase()
      )

      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            portfolioId: portfolio.id,
            tickerSymbol: symbol.toUpperCase(),
            transactionType: "BUY",
            quantity,
            price,
          },
        }),
        existingHolding
          ? prisma.holding.update({
              where: { id: existingHolding.id },
              data: {
                quantity: existingHolding.quantity + quantity,
                averageCost:
                  (existingHolding.averageCost * existingHolding.quantity + totalCost) /
                  (existingHolding.quantity + quantity),
              },
            })
          : prisma.holding.create({
              data: {
                portfolioId: portfolio.id,
                tickerSymbol: symbol.toUpperCase(),
                quantity,
                averageCost: price,
              },
            }),
        prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { cashBalance: portfolio.cashBalance - totalCost },
        }),
      ])

      return NextResponse.json({
        message: `Successfully bought ${quantity} shares of ${symbol.toUpperCase()}`,
        cashBalance: portfolio.cashBalance - totalCost,
      })
    }

    if (type.toUpperCase() === "SELL") {
      const holding = portfolio.holdings.find(
        (h) => h.tickerSymbol === symbol.toUpperCase()
      )

      if (!holding || holding.quantity < quantity) {
        return NextResponse.json(
          { error: "Insufficient shares to sell" },
          { status: 400 }
        )
      }

      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            portfolioId: portfolio.id,
            tickerSymbol: symbol.toUpperCase(),
            transactionType: "SELL",
            quantity,
            price,
          },
        }),
        holding.quantity === quantity
          ? prisma.holding.delete({ where: { id: holding.id } })
          : prisma.holding.update({
              where: { id: holding.id },
              data: { quantity: holding.quantity - quantity },
            }),
        prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { cashBalance: portfolio.cashBalance + totalCost },
        }),
      ])

      return NextResponse.json({
        message: `Successfully sold ${quantity} shares of ${symbol.toUpperCase()}`,
        cashBalance: portfolio.cashBalance + totalCost,
      })
    }
  } catch (error) {
    console.error("Trade error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}