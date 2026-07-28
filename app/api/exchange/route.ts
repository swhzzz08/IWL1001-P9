import { NextRequest, NextResponse } from 'next/server'
import { fetchExchangeRate, isSupportedCurrency } from '@/lib/fx'

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