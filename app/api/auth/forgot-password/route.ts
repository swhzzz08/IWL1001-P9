import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    const { email } = await req.json()

    // Always return ok — never reveal whether an email exists
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: true })

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordResetToken.upsert({
        where: { email },
        update: { token, expires },
        create: { email, token, expires },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`

    await resend.emails.send({
        from: "noreply@yourdomain.com",  // replace with your verified Resend domain
        to: email,
        subject: "Reset your password",
        html: `
      <p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
    `,
    })

    return NextResponse.json({ ok: true })
}