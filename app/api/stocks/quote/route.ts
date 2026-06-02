import { NextRequest, NextResponse } from 'next/server'
import { fetchQuote } from '@/lib/stockApi'

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get('symbol')
    if (!symbol) {
        return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
    }
    try {
        const quote = await fetchQuote(symbol.toUpperCase())
        return NextResponse.json(quote)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}