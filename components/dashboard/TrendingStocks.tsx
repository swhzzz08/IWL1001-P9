import { TrendingStockRow } from './TrendingStockRow'
import { fetchQuote } from '@/lib/stockApi'
import type { StockQuote } from '@/types/stock.ts'

const TRENDING_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B']

// function to fetch the latest stock price and change for a list of trending stocks and display them in a card format.
export async function TrendingStocks() {
    const results = await Promise.allSettled(
        TRENDING_SYMBOLS.map((s) => fetchQuote(s))
    )

    const quotes: StockQuote[] = results
        .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === 'fulfilled')
        .map((r) => r.value)

    if (quotes.length === 0) { // if not able to load any stock data, show an error message
        return (
            <section aria-label="Trending Stocks">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Trending Stocks
                </h2>
                <p className="text-sm text-muted-foreground">
                    Unable to load trending stocks. Check your API key.
                </p>
            </section>
        )
    }

    return (
        <section aria-label="Trending Stocks">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Trending Stocks
            </h2>
            <div className="rounded-lg border border-border bg-card">
                {quotes.map((quote) => (
                    <TrendingStockRow key={quote.symbol} quote={quote} />
                ))}
            </div>
        </section>
    )
}