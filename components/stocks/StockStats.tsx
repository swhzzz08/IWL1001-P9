import { formatCurrency, formatVolume, formatMarketCap, formatPercent } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

export function StockStats({ quote }: { quote: StockQuote }) {
    const stats = [
        { label: 'Open', value: formatCurrency(quote.open) },
        { label: 'Prev Close', value: formatCurrency(quote.previousClose) },
        { label: 'Volume', value: formatVolume(quote.volume) },
        { label: 'Market Cap', value: formatMarketCap(quote.marketCap) },
        { label: 'P/E Ratio', value: quote.peRatio?.toFixed(2) ?? 'N/A' },
        { label: '52W High', value: formatCurrency(quote.weekHigh52) },
        { label: '52W Low', value: formatCurrency(quote.weekLow52) },
    ]

    return (
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-4">
            {stats.map(({ label, value }) => (
                <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-heading text-sm font-semibold tabular-nums">{value}</p>
                </div>
            ))}
        </div>
    )
}