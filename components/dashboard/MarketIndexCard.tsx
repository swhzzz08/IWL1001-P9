import { PriceChange } from "@/components/ui/PriceChange"
import { formatCurrency } from "@/lib/formatters"
import type { MarketIndex } from "@/types/stock"

// Function to display a market index card with its current price and percentage change
export function MarketIndexCard({ index }: { index: MarketIndex }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{index.name}</p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums">
                {formatCurrency(index.value)}
            </p>
            <PriceChange
                change={index.change}
                changePercent={index.changePercent}
                className="mt-1"
            />
        </div>
    )
}