'use client'

import { PriceChange } from '@/components/ui/PriceChange'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatCurrency } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

interface Props {
    quote: StockQuote | null
    isLoading: boolean
}

export function StockHeader({ quote, isLoading }: Props) {
    if (isLoading || !quote) {
        return (
            <div className="flex h-16 items-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-heading text-3xl font-bold">{quote.symbol}</h1>
            <span className="text-muted-foreground">{quote.name}</span>
            <span className="font-heading text-3xl font-bold tabular-nums">
        {formatCurrency(quote.price)}
      </span>
            <PriceChange change={quote.change} changePercent={quote.changePercent} />
        </div>
    )
}