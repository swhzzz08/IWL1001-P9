'use client'

import { useState, use } from 'react'
import { StockHeader } from '@/components/stocks/StockHeader'
import { StockChart } from '@/components/stocks/StockChart'
import { TimeframePicker } from '@/components/stocks/TimeframePicker'
import { StockStats } from '@/components/stocks/StockStats'
import { HintPanel } from '@/components/hints/HintPanel'
import { useStockQuote, useTimeSeries } from '@/hooks/useStockData'
import type { Timeframe } from '@/types/stock'
import Link from 'next/link'
import { ChevronLeft, Lightbulb } from 'lucide-react'

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const upper = symbol.toUpperCase()
  const [timeframe, setTimeframe] = useState<Timeframe>('1M')
  const { quote, isLoading: quoteLoading } = useStockQuote(upper)
  const { series, isLoading: seriesLoading } = useTimeSeries(upper, timeframe)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <ChevronLeft size={14} /> Markets
        </Link>
        <span style={{ color: 'var(--color-text-subtle)' }}>/</span>
        <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{upper}</span>
      </nav>

      {/* Header */}
      <StockHeader quote={quote ?? null} isLoading={quoteLoading} />

      {/* Chart */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
            Price Chart
          </h2>
          <TimeframePicker selected={timeframe} onChange={setTimeframe} />
        </div>
        <div style={{ padding: 16 }}>
          <StockChart series={series} isLoading={seriesLoading} />
        </div>
        <div style={{
          display: 'flex', gap: 20, padding: '10px 20px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)', fontSize: 11, color: 'var(--color-text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e' }} />
            Bullish (close &gt; open)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }} />
            Bearish (close &lt; open)
          </div>
        </div>
      </div>

      {/* Stats */}
      {quote && <StockStats quote={quote} />}

      {/* Educational tip */}
      <div style={{
        display: 'flex', gap: 14, alignItems: 'flex-start',
        background: '#eff6ff', border: '1.5px solid #bfdbfe',
        borderRadius: 14, padding: '16px 20px',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lightbulb size={15} color="#2563eb" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>How to read this chart</p>
          <p style={{ fontSize: 12, color: '#3b82f6', margin: 0, lineHeight: 1.7 }}>
            Each candle represents one trading day. The body shows the open and close price. The wicks show the high and low.
            <strong> Green = price went up. Red = price went down.</strong> Hover any candle to see exact values.
          </p>
        </div>
      </div>

      <HintPanel />
    </div>
  )
}