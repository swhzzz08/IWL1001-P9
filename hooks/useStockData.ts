'use client'

import useSWR from 'swr'
import type { StockQuote, TimeSeriesPoint, Timeframe } from '@/types/stock.ts'

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        return res.json()
    })

export function useStockQuote(symbol: string) {
    const { data, error, isLoading } = useSWR<StockQuote>(
        symbol ? `/api/stocks/quote?symbol=${symbol}` : null,
        fetcher,
        { refreshInterval: 60_000 }
    )
    return { quote: data, error, isLoading }
}

export function useTimeSeries(symbol: string, timeframe: Timeframe) {
    const { data, error, isLoading } = useSWR<TimeSeriesPoint[]>(
        symbol ? `/api/stocks/timeseries?symbol=${symbol}&timeframe=${timeframe}` : null,
        fetcher
    )
    return { series: data ?? [], error, isLoading }
}