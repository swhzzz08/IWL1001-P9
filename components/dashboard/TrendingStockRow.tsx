import Link from 'next/link'
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import type { StockQuote } from '@/types/stock'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

export function TrendingStockRow({ quote, rank }: { quote: StockQuote; rank?: number }) {
  const up = quote.change >= 0
  const sign = up ? '+' : ''

  return (
    <Link href={`/stocks/${quote.symbol}`} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', textDecoration: 'none',
      borderBottom: '1px solid var(--color-border)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {rank !== undefined && (
          <span style={{ width: 20, fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)', fontFamily: 'monospace', textAlign: 'center' }}>
            {rank}
          </span>
        )}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: up ? '#f0fdf4' : '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800,
          color: up ? '#15803d' : '#b91c1c',
        }}>
          {quote.symbol.slice(0, 2)}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-heading)' }}>{quote.symbol}</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '2px 0 0', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{quote.name}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
          {fmt(quote.price)}
        </span>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: up ? '#f0fdf4' : '#fef2f2',
          color: up ? '#15803d' : '#b91c1c',
          borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700,
        }}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {sign}{quote.changePercent.toFixed(2)}%
        </div>
        <ChevronRight size={15} color="var(--color-text-subtle)" />
      </div>
    </Link>
  )
}