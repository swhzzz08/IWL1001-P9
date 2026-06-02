import { NextRequest, NextResponse } from 'next/server'
import { fetchTimeSeries } from '@/lib/stockApi'
import type { Timeframe } from '@/types/stock.ts'

const VALID_TIMEFRAMES: Timeframe[] = ['1W', '1M', '3M', '1Y', 'ALL']

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get('symbol')
    const timeframe = request.nextUrl.searchParams.get('timeframe') as Timeframe | null

    if (!symbol) return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
    if (!timeframe || !VALID_TIMEFRAMES.includes(timeframe)) {
        return NextResponse.json({ error: 'valid timeframe is required' }, { status: 400 })
    }

    try {
        const data = await fetchTimeSeries(symbol.toUpperCase(), timeframe)
        return NextResponse.json(data)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}