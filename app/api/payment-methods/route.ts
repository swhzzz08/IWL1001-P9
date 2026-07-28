import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type MethodType = "BANK" | "CARD"

async function getUserId() {
  const session = await auth()
  const userId = Number(session?.user?.id)
  return Number.isInteger(userId) && userId > 0 ? userId : null
}

function toSafePaymentMethod(method: {
  id: number
  methodType: string
  accountHolder: string
  providerName: string
  lastFour: string
  expiryMonth: number | null
  expiryYear: number | null
  isActive: boolean
  createdAt: Date
}) {
  return {
    id: method.id,
    methodType: method.methodType,
    accountHolder: method.accountHolder,
    providerName: method.providerName,
    lastFour: method.lastFour,
    expiryMonth: method.expiryMonth,
    expiryYear: method.expiryYear,
    isActive: method.isActive,
    createdAt: method.createdAt,
  }
}

export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const methods = await prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({
      paymentMethods: methods.map(toSafePaymentMethod),
    })
  } catch (error) {
    console.error("Payment methods GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json() as Record<string, unknown>
    const methodType =
      typeof body.methodType === "string"
        ? body.methodType.toUpperCase()
        : ""
    const accountHolder =
      typeof body.accountHolder === "string" ? body.accountHolder.trim() : ""
    const providerName =
      typeof body.providerName === "string" ? body.providerName.trim() : ""
    const lastFour =
      typeof body.lastFour === "string"
        ? body.lastFour.replace(/\D/g, "")
        : ""
    const expiryMonth = Number(body.expiryMonth)
    const expiryYear = Number(body.expiryYear)

    if (methodType !== "BANK" && methodType !== "CARD") {
      return NextResponse.json(
        { error: "Payment method must be BANK or CARD" },
        { status: 400 }
      )
    }
    if (accountHolder.length < 2 || accountHolder.length > 100) {
      return NextResponse.json(
        { error: "Enter a valid account holder name" },
        { status: 400 }
      )
    }
    if (providerName.length < 2 || providerName.length > 100) {
      return NextResponse.json(
        {
          error:
            methodType === "BANK"
              ? "Enter a valid bank name"
              : "Enter a valid card provider",
        },
        { status: 400 }
      )
    }
    if (!/^\d{4}$/.test(lastFour)) {
      return NextResponse.json(
        { error: "Enter exactly the last four digits" },
        { status: 400 }
      )
    }

    let safeExpiryMonth: number | null = null
    let safeExpiryYear: number | null = null
    if (methodType === "CARD") {
      const currentYear = new Date().getFullYear()
      if (
        !Number.isInteger(expiryMonth) ||
        expiryMonth < 1 ||
        expiryMonth > 12 ||
        !Number.isInteger(expiryYear) ||
        expiryYear < currentYear ||
        expiryYear > currentYear + 25
      ) {
        return NextResponse.json(
          { error: "Enter a valid card expiry date" },
          { status: 400 }
        )
      }
      safeExpiryMonth = expiryMonth
      safeExpiryYear = expiryYear
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId,
        methodType: methodType as MethodType,
        accountHolder,
        providerName,
        lastFour,
        expiryMonth: safeExpiryMonth,
        expiryYear: safeExpiryYear,
      },
    })

    return NextResponse.json(
      {
        message: `${methodType === "BANK" ? "Bank account" : "Card"} added`,
        paymentMethod: toSafePaymentMethod(method),
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error("Payment methods POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json() as { id?: unknown }
    const id = Number(body.id)
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    const method = await prisma.paymentMethod.findFirst({
      where: { id, userId, isActive: true },
    })
    if (!method) {
      return NextResponse.json({ error: "Payment method not found" }, { status: 404 })
    }

    await prisma.paymentMethod.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json({ message: "Payment method removed" })
  } catch (error) {
    console.error("Payment methods DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
