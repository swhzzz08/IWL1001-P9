'use client'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import type { StockQuote } from '@/types/stock'
import { WatchlistButton } from './WatchlistButton'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

export function StockHeader({ quote, isLoading }: { quote: StockQuote | null; isLoading: boolean }) {
  if (isLoading || !quote) {
    return (
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 14 }} />
            <div>
              <div className="skeleton" style={{ height: 18, width: 80, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 13, width: 140 }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="skeleton" style={{ height: 36, width: 120, marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 28, width: 100, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    )
  }

  const up = quote.change >= 0
  const sign = up ? '+' : ''

  return (
    <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ height: 4, background: up ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f87171,#dc2626)' }} />
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#0f766e' }}>
            {quote.symbol.slice(0, 2)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 26, margin: 0, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
                {quote.symbol}
              </h1>
              <a href={`https://finance.yahoo.com/quote/${quote.symbol}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-subtle)', display: 'flex' }}>
                <ExternalLink size={14} />
              </a>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 10px' }}>{quote.name}</p>
            <WatchlistButton symbol={quote.symbol} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 36, margin: 0, letterSpacing: '-0.03em', color: 'var(--color-text)' }}>
            {fmt(quote.price)}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: up ? '#f0fdf4' : '#fef2f2', color: up ? '#15803d' : '#b91c1c', borderRadius: 999, padding: '6px 14px', marginTop: 8, fontSize: 13, fontWeight: 700 }}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {sign}{quote.change.toFixed(2)} ({sign}{quote.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  )
}