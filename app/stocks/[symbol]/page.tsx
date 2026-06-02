'use client'

import { useState } from 'react'
import { StockHeader } from '@/components/stocks/StockHeader'
import { StockChart } from '@/components/stocks/StockChart'
import { TimeframePicker } from '@/components/stocks/TimeframePicker'
import { StockStats } from '@/components/stocks/StockStats'
import { HintPanel } from '@/components/hints/HintPanel'
import { useStockQuote, useTimeSeries } from '@/hooks/useStockData'
import type { Timeframe } from '@/types/stock.ts'
import { use } from 'react'

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params)
    const [timeframe, setTimeframe] = useState<Timeframe>('1M')
    const { quote, isLoading: quoteLoading } = useStockQuote(symbol.toUpperCase())
    const { series, isLoading: seriesLoading } = useTimeSeries(symbol.toUpperCase(), timeframe)

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <StockHeader quote={quote ?? null} isLoading={quoteLoading} />

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Price Chart
                    </h2>
                    <TimeframePicker selected={timeframe} onChange={setTimeframe} />
                </div>

                <StockChart series={series} isLoading={seriesLoading} />

                {quote && <StockStats quote={quote} />}
            </div>

            {/* Hint panel floats over the page */}
            <HintPanel />
        </div>
    )
}