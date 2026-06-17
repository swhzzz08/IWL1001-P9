import { TrendingUp, TrendingDown } from 'lucide-react'
import type { MarketIndex } from '@/types/stock'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

export function MarketIndexCard({ index }: { index: MarketIndex }) {
  const up = index.change >= 0
  const sign = up ? '+' : ''
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
      borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
    }}>
      <div style={{ height: 3, position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '16px 16px 0 0', background: up ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f87171,#dc2626)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>{index.name}</p>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: up ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {up ? <TrendingUp size={14} color="#16a34a" /> : <TrendingDown size={14} color="#dc2626" />}
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--color-text)', margin: '12px 0 10px' }}>
        {fmt(index.value)}
      </p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: up ? '#f0fdf4' : '#fef2f2', color: up ? '#15803d' : '#b91c1c', borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700 }}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {sign}{index.change.toFixed(2)} ({sign}{index.changePercent.toFixed(2)}%)
      </div>
    </div>
  )
}