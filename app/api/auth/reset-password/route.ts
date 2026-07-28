import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    const { token, password } = await req.json()

    const record = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.expires < new Date()) {
        return NextResponse.json({ error: "Token is invalid or expired" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { email: record.email },
        data: { passwordHash },
    })

    await prisma.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ ok: true })
}