import { MarketIndexCard } from './MarketIndexCard'
import { fetchMarketIndices } from '@/lib/stockApi'

// function to fetch market statistics like S&P 500, NASDAQ, Dow Jones, etc. and display them in a card format
export async function MarketOverview() {
    let indices = await fetchMarketIndices().catch(() => [])

    // Fallback data when API key is missing or rate-limited
    if (indices.length === 0) {
        indices = [
            { symbol: '^GSPC', name: 'S&P 500', value: 5308.13, change: 12.45, changePercent: 0.23 },
            { symbol: '^IXIC', name: 'NASDAQ', value: 16785.22, change: -45.30, changePercent: -0.27 },
            { symbol: '^DJI', name: 'Dow Jones', value: 39127.80, change: 88.10, changePercent: 0.23 },
        ]
    }

    return (
        <section aria-label="Market Overview">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Market Overview
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {indices.map((idx) => (
                    <MarketIndexCard key={idx.symbol} index={idx} />
                ))}
            </div>
        </section>
    )
}