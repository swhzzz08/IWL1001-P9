import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
  })
}
