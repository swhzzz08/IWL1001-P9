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

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const watchlists = await prisma.watchlist.findMany({
      where: { userId: user.userId },
      include: { stocks: true },
    })

    if (watchlists.length === 0) {
      const defaultWatchlist = await prisma.watchlist.create({
        data: {
          userId: user.userId,
          watchlistName: "My Watchlist",
          stocks: {},
        },
        include: { stocks: true },
      })
      return NextResponse.json([defaultWatchlist])
    }

    return NextResponse.json(watchlists)
  } catch (error) {
    console.error("Watchlist GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symbol, watchlistId } = await req.json()

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    let targetWatchlistId = watchlistId

    if (!targetWatchlistId) {
      const defaultWatchlist = await prisma.watchlist.findFirst({
        where: { userId: user.userId },
      })
      if (!defaultWatchlist) {
        return NextResponse.json({ error: "No watchlist found" }, { status: 404 })
      }
      targetWatchlistId = defaultWatchlist.id
    }

    const existing = await prisma.watchlistStock.findFirst({
      where: {
        watchlistId: targetWatchlistId,
        tickerSymbol: symbol.toUpperCase(),
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Stock already in watchlist" }, { status: 409 })
    }

    const stock = await prisma.watchlistStock.create({
      data: {
        watchlistId: targetWatchlistId,
        tickerSymbol: symbol.toUpperCase(),
      },
    })

    return NextResponse.json({
      message: `${symbol.toUpperCase()} added to watchlist`,
      stock,
    })
  } catch (error) {
    console.error("Watchlist POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symbol, watchlistId } = await req.json()

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    const watchlist = await prisma.watchlist.findFirst({
      where: {
        id: watchlistId,
        userId: user.userId,
      },
    })

    if (!watchlist) {
      return NextResponse.json({ error: "Watchlist not found" }, { status: 404 })
    }

    await prisma.watchlistStock.deleteMany({
      where: {
        watchlistId: watchlist.id,
        tickerSymbol: symbol.toUpperCase(),
      },
    })

    return NextResponse.json({
      message: `${symbol.toUpperCase()} removed from watchlist`,
    })
  } catch (error) {
    console.error("Watchlist DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}