'use client'

import { useState, use } from 'react'
import { StockHeader } from '@/components/stocks/StockHeader'
import { StockChart } from '@/components/stocks/StockChart'
import { TimeframePicker } from '@/components/stocks/TimeframePicker'
import { StockStats } from '@/components/stocks/StockStats'
import { RSIPanel } from '@/components/stocks/RSIPanel'
import { ARIMAForecast } from '@/components/stocks/ARIMAForecast'
import { NewsSentiment } from '@/components/stocks/NewsSentiment'
import { HintPanel } from '@/components/hints/HintPanel'
import { useStockQuote, useTimeSeries } from '@/hooks/useStockData'
import type { Timeframe } from '@/types/stock'
import Link from 'next/link'
import { ChevronLeft, Lightbulb, BarChart2, Newspaper, TrendingUp } from 'lucide-react'

type Tab = 'chart' | 'technicals' | 'news'

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const upper = symbol.toUpperCase()
  const [timeframe, setTimeframe] = useState<Timeframe>('3M')
  const [tab, setTab] = useState<Tab>('chart')
  const { quote, isLoading: quoteLoading } = useStockQuote(upper)
  const { series, isLoading: seriesLoading } = useTimeSeries(upper, timeframe)

  const tabs: { id: Tab; label: string; icon: typeof BarChart2 }[] = [
    { id: 'chart', label: 'Chart & Stats', icon: BarChart2 },
    { id: 'technicals', label: 'Technical Analysis', icon: TrendingUp },
    { id: 'news', label: 'News & Sentiment', icon: Newspaper },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <ChevronLeft size={14} /> Markets
        </Link>
        <span>/</span>
        <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{upper}</span>
      </nav>

      {/* Header */}
      <StockHeader quote={quote ?? null} isLoading={quoteLoading} />

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, padding: 4, background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border)', borderRadius: 12, width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: tab === id ? 'var(--color-surface)' : 'transparent',
            color: tab === id ? '#2563eb' : 'var(--color-text-muted)',
            boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Chart & Stats tab ── */}
      {tab === 'chart' && (
        <>
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>Price Chart</h2>
              <TimeframePicker selected={timeframe} onChange={setTimeframe} />
            </div>
            <div style={{ padding: 16 }}>
              <StockChart series={series} isLoading={seriesLoading} />
            </div>
            <div style={{ display: 'flex', gap: 20, padding: '10px 20px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-2)', fontSize: 11, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e' }} /> Bullish (close &gt; open)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }} /> Bearish (close &lt; open)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 2, borderRadius: 1, background: '#f59e0b' }} /> SMA 20
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 2, borderRadius: 1, background: '#8b5cf6' }} /> SMA 50
              </div>
            </div>
          </div>

          {quote && <StockStats quote={quote} />}

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lightbulb size={15} color="#2563eb" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>How to read this chart</p>
              <p style={{ fontSize: 12, color: '#3b82f6', margin: 0, lineHeight: 1.7 }}>
                Each candle represents one trading day. The body shows the open and close price. The wicks show the high and low.
                <strong> Green = price went up. Red = price went down.</strong> Toggle SMA lines above the chart. Click the Technical Analysis tab for RSI and ARIMA forecast.
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── Technical Analysis tab ── */}
      {tab === 'technicals' && (
        <>
          {/* Chart */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>Price + Moving Averages</h2>
              <TimeframePicker selected={timeframe} onChange={setTimeframe} />
            </div>
            <div style={{ padding: 16 }}>
              <StockChart series={series} isLoading={seriesLoading} />
            </div>
          </div>

          {/* SMA explanation */}
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: '0 0 16px' }}>
              Moving Averages Explained
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 12 }}>
              {[
                { color: '#f59e0b', label: 'SMA 20 — Short-term', desc: 'Average closing price over 20 days. Reacts quickly to price changes. A "golden cross" (SMA 20 crossing above SMA 50) is often seen as a bullish signal.' },
                { color: '#8b5cf6', label: 'SMA 50 — Medium-term', desc: 'Average closing price over 50 days. Slower moving, filters out noise. When price is above SMA 50, it generally indicates an uptrend.' },
              ].map(({ color, label, desc }) => (
                <div key={label} style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: '14px 16px', borderLeft: `3px solid ${color}` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 6px' }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RSI Panel */}
          <RSIPanel series={series} />

          {/* ARIMA Forecast */}
          <ARIMAForecast series={series} />
        </>
      )}

      {/* ── News & Sentiment tab ── */}
      {tab === 'news' && <NewsSentiment symbol={upper} />}

      <HintPanel />
    </div>
  )
}