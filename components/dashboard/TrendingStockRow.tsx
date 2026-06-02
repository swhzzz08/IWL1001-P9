import Link from 'next/link'
import { PriceChange } from '@/components/ui/PriceChange'
import { formatCurrency } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

// function to show every statistic for the trending stock in a row
export function TrendingStockRow({ quote }: { quote: StockQuote }) {
    return (
        <Link
            href={`/stocks/${quote.symbol}`}
            className="flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-muted/60"
        >
            <div>
                <span className="font-heading text-sm font-bold">{quote.symbol}</span>
                <span className="ml-2 text-xs text-muted-foreground">{quote.name}</span>
            </div>
            <div className="flex items-center gap-3">
        <span className="font-heading text-sm font-semibold tabular-nums">
          {formatCurrency(quote.price)}
        </span>
                <PriceChange change={quote.change} changePercent={quote.changePercent} />
            </div>
        </Link>
    )
}