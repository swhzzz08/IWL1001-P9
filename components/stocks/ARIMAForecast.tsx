'use client'

import { useMemo } from 'react'
import type { TimeSeriesPoint } from '@/types/stock'
import { calculateARIMA } from '@/lib/indicators'
import { TrendingUp, TrendingDown, Minus, BookOpen, AlertTriangle } from 'lucide-react'

interface Props { series: TimeSeriesPoint[] }

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function MiniChart({ result }: { result: NonNullable<ReturnType<typeof calculateARIMA>> }) {
  const allValues = [
    ...result.predictions.map(p => p.value),
    ...result.upperBand.map(p => p.value),
    ...result.lowerBand.map(p => p.value),
  ]
  const minV = Math.min(...allValues)
  const maxV = Math.max(...allValues)
  const range = maxV - minV || 1
  const W = 300, H = 80

  function toX(i: number, total: number) { return (i / (total - 1)) * W }
  function toY(v: number) { return H - ((v - minV) / range) * H }

  const predPath = result.predictions.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(i, result.predictions.length)} ${toY(p.value)}`
  ).join(' ')

  const upperPath = result.upperBand.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(i, result.upperBand.length)} ${toY(p.value)}`
  ).join(' ')

  const lowerPath = result.lowerBand.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(i, result.lowerBand.length)} ${toY(p.value)}`
  ).join(' ')

  // Filled confidence band
  const bandPath = [
    ...result.upperBand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i, result.upperBand.length)} ${toY(p.value)}`),
    ...result.lowerBand.slice().reverse().map((p, i, arr) => `L ${toX(arr.length - 1 - i, arr.length)} ${toY(p.value)}`),
    'Z'
  ].join(' ')

  const up = result.targetPrice >= result.lastActualPrice
  const lineColor = up ? '#16a34a' : '#dc2626'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 80, overflow: 'visible' }}>
      {/* Confidence band */}
      <path d={bandPath} fill={up ? '#16a34a' : '#dc2626'} fillOpacity={0.08} />
      {/* Upper/lower band lines */}
      <path d={upperPath} fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="4,3" strokeOpacity={0.4} />
      <path d={lowerPath} fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="4,3" strokeOpacity={0.4} />
      {/* Prediction line */}
      <path d={predPath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Start dot */}
      <circle cx={toX(0, result.predictions.length)} cy={toY(result.predictions[0].value)} r="4" fill={lineColor} />
      {/* End dot */}
      <circle cx={toX(result.predictions.length - 1, result.predictions.length)} cy={toY(result.targetPrice)} r="5" fill={lineColor} stroke="white" strokeWidth="2" />
    </svg>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 70 ? '#16a34a' : value >= 50 ? '#d97706' : '#dc2626'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confidence</span>
        <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-heading)' }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: 'var(--color-surface-2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--color-text-subtle)' }}>
        <span>Low</span><span>Medium</span><span>High</span>
      </div>
    </div>
  )
}

export function ARIMAForecast({ series }: Props) {
  const result = useMemo(() => calculateARIMA(series, 30), [series])

  if (series.length < 30) {
    return (
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '32px', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <AlertTriangle size={22} color="#d97706" />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>Not enough data</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
          ARIMA needs at least 30 data points. Switch to the 3M or 1Y timeframe.
        </p>
      </div>
    )
  }

  if (!result) return null

  const up = result.targetPrice >= result.lastActualPrice
  const pctChange = ((result.targetPrice - result.lastActualPrice) / result.lastActualPrice) * 100
  const sign = pctChange >= 0 ? '+' : ''

  const REC_STYLE = {
    Buy:  { bg: '#f0fdf4', color: '#15803d', border: '#86efac', icon: TrendingUp },
    Hold: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: Minus },
    Sell: { bg: '#fef2f2', color: '#b91c1c', border: '#fca5a5', icon: TrendingDown },
  }
  const rec = REC_STYLE[result.recommendation]
  const RecIcon = rec.icon

  return (
    <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} color="#2563eb" />
          </div>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
              ARIMA Forecast
            </h3>
            <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: 0 }}>30-day price prediction</p>
          </div>
        </div>
        {/* Recommendation badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: rec.bg, color: rec.color, border: `1.5px solid ${rec.border}`, borderRadius: 999, padding: '6px 16px', fontSize: 14, fontWeight: 800 }}>
          <RecIcon size={14} />
          {result.recommendation}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Main numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)', margin: '0 0 6px' }}>Current</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{fmt(result.lastActualPrice)}</p>
          </div>
          <div style={{ background: up ? '#f0fdf4' : '#fef2f2', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: up ? '#15803d' : '#b91c1c', margin: '0 0 6px' }}>Target (30d)</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: up ? '#15803d' : '#b91c1c', margin: 0 }}>{fmt(result.targetPrice)}</p>
          </div>
          <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-subtle)', margin: '0 0 6px' }}>Expected</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: up ? '#15803d' : '#b91c1c', margin: 0 }}>{sign}{pctChange.toFixed(1)}%</p>
          </div>
        </div>

        {/* Price bands */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#15803d' }}>High estimate</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#15803d', fontFamily: 'var(--font-heading)' }}>{fmt(result.upperBand[result.upperBand.length - 1].value)}</span>
          </div>
          <div style={{ background: '#fef2f2', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c' }}>Low estimate</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#b91c1c', fontFamily: 'var(--font-heading)' }}>{fmt(result.lowerBand[result.lowerBand.length - 1].value)}</span>
          </div>
        </div>

        {/* Mini chart */}
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: '14px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            30-day forecast path
          </p>
          <MiniChart result={result} />
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--color-text-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 16, height: 2, background: up ? '#16a34a' : '#dc2626', borderRadius: 1 }} />
              Forecast
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 16, height: 2, background: up ? '#16a34a40' : '#dc262640', borderRadius: 1, borderTop: `1px dashed ${up ? '#16a34a' : '#dc2626'}` }} />
              95% confidence band
            </div>
          </div>
        </div>

        {/* Confidence meter */}
        <div style={{ background: 'var(--color-surface-2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <ConfidenceMeter value={result.confidence} />
        </div>

        {/* Educational section */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={13} color="#2563eb" />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>What is ARIMA?</p>
            <p style={{ fontSize: 12, color: '#3b82f6', margin: 0, lineHeight: 1.7 }}>
              ARIMA stands for <strong>AutoRegressive Integrated Moving Average</strong>. It's a statistical model that uses a stock's own past price patterns to forecast future prices.
              It works by finding the trend direction (AR), removing it to make the data stable (I) and smoothing out noise (MA).
              The <strong>confidence band</strong> shows the range of likely outcomes — wider bands mean more uncertainty.
            </p>
          </div>
        </div>

        {/* How to interpret recommendation */}
        <div style={{ background: rec.bg, border: `1.5px solid ${rec.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: rec.color, margin: '0 0 4px' }}>
            Why {result.recommendation}?
          </p>
          <p style={{ fontSize: 12, color: rec.color, margin: 0, lineHeight: 1.7, opacity: 0.85 }}>
            {result.recommendation === 'Buy' &&
              `The model predicts a ${sign}${pctChange.toFixed(1)}% price increase over the next 30 days. When the forecast suggests a rise of more than 3%, the model recommends buying but remember to always do your own research first.`}
            {result.recommendation === 'Sell' &&
              `The model predicts a ${pctChange.toFixed(1)}% price decrease over the next 30 days. When the forecast suggests a fall of more than 3%, the model recommends selling but remember to always do your own research first.`}
            {result.recommendation === 'Hold' &&
              `The model predicts only a ${sign}${pctChange.toFixed(1)}% price change within the ±3% neutral zone. This suggests the stock may trade sideways, so holding may be the most appropriate position.`}
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 12px' }}>
          <AlertTriangle size={13} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: '#92400e', margin: 0, lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> This forecast is generated by a statistical algorithm and is for <strong>educational purposes only</strong>. It does not constitute financial advice. Past price patterns do not guarantee future results. Always consult a qualified financial advisor before investing.
          </p>
        </div>
      </div>
    </div>
  )
}