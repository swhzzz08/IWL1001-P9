import { MarketIndexCard } from './MarketIndexCard'
import { fetchQuote } from '@/lib/stockApi'
import type { MarketIndex } from '@/types/stock'
import { Activity } from 'lucide-react'

const INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'DOW JONES' },
]

export async function MarketOverview() {
  const results = await Promise.allSettled(INDICES.map(i => fetchQuote(i.symbol)))
  const indices: MarketIndex[] = results
    .map((r, i) => {
      if (r.status !== 'fulfilled') return null
      const q = r.value
      return { name: INDICES[i].name, value: q.price, change: q.change, changePercent: q.changePercent }
    })
    .filter(Boolean) as MarketIndex[]

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={14} color="#2563eb" />
        </div>
        <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
          Market Overview
        </h2>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-subtle)' }}>
          <div className="pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
          Live data
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        {indices.map(index => <MarketIndexCard key={index.name} index={index} />)}
      </div>
    </section>
  )
}