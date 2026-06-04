import { TrendingStockRow } from './TrendingStockRow'
import { fetchQuote } from '@/lib/stockApi'
import type { StockQuote } from '@/types/stock'
import { TrendingUp } from 'lucide-react'

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA']

export async function TrendingStocks() {
  const results = await Promise.allSettled(SYMBOLS.map(s => fetchQuote(s)))
  const quotes: StockQuote[] = results
    .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === 'fulfilled')
    .map(r => r.value)

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
            Trending Stocks
          </h2>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{quotes.length} symbols</span>
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 20px', background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ paddingLeft: 72, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>Symbol</span>
          <div style={{ display: 'flex', gap: 36, paddingRight: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>Price</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>Change</span>
          </div>
        </div>
        {quotes.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>Unable to load stocks.</div>
        ) : (
          quotes.map((q, i) => <TrendingStockRow key={q.symbol} quote={q} rank={i + 1} />)
        )}
      </div>
    </section>
  )
}