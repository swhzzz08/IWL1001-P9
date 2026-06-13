'use client'

import { useMemo } from 'react'
import type { TimeSeriesPoint } from '@/types/stock'
import { calculateRSI, interpretRSI } from '@/lib/indicators'
import { BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  series: TimeSeriesPoint[]
}

export function RSIPanel({ series }: Props) {
  const rsiPoints = useMemo(() => calculateRSI(series, 14), [series])
  const latest = rsiPoints[rsiPoints.length - 1]

  if (!latest || series.length < 15) {
    return (
      <div style={{
        background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
        borderRadius: 16, padding: '20px',
      }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', margin: 0, textAlign: 'center' }}>
          Not enough data to calculate RSI (need at least 15 data points)
        </p>
      </div>
    )
  }

  const { label, color, bg, desc } = interpretRSI(latest.value)
  const pct = latest.value // RSI is already 0-100

  // Mini sparkline of last 20 RSI values
  const recent = rsiPoints.slice(-20)
  const minV = Math.min(...recent.map(p => p.value))
  const maxV = Math.max(...recent.map(p => p.value))
  const range = maxV - minV || 1

  const sparkPath = recent.map((p, i) => {
    const x = (i / (recent.length - 1)) * 200
    const y = 40 - ((p.value - minV) / range) * 40
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
      borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={14} color="#2563eb" />
          </div>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
              RSI (14)
            </h3>
            <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: 0 }}>Relative Strength Index</p>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color, borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 800 }}>
          {label === 'Overbought' ? <TrendingUp size={12} /> : label === 'Oversold' ? <TrendingDown size={12} /> : <Minus size={12} />}
          {label}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
          {/* Left: gauge */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 800, color, lineHeight: 1 }}>
                {latest.value.toFixed(1)}
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-text-subtle)', fontWeight: 600 }}>/100</span>
            </div>

            {/* RSI bar */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              {/* Background zones */}
              <div style={{ height: 12, borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
                <div style={{ flex: 30, background: '#fee2e2' }} /> {/* 0-30 oversold */}
                <div style={{ flex: 40, background: '#fef9c3' }} /> {/* 30-70 neutral */}
                <div style={{ flex: 30, background: '#dcfce7' }} /> {/* 70-100 overbought */}
              </div>
              {/* Value needle */}
              <div style={{
                position: 'absolute', top: -3,
                left: `calc(${pct}% - 9px)`,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', border: `3px solid ${color}`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                transition: 'left 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </div>

            {/* Zone labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-subtle)', fontWeight: 600 }}>
              <span style={{ color: '#dc2626' }}>0 Oversold</span>
              <span>30 — 70</span>
              <span style={{ color: '#16a34a' }}>Overbought 100</span>
            </div>

            {/* Zone markers */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {[
                { range: '0–30', label: 'Oversold', color: '#dc2626', bg: '#fef2f2' },
                { range: '30–70', label: 'Neutral', color: '#d97706', bg: '#fffbeb' },
                { range: '70–100', label: 'Overbought', color: '#16a34a', bg: '#f0fdf4' },
              ].map(z => (
                <div key={z.label} style={{
                  background: z.bg, borderRadius: 6, padding: '4px 8px',
                  fontSize: 10, fontWeight: 700, color: z.color,
                }}>
                  {z.range} · {z.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: sparkline */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              Last 20 periods
            </p>
            <div style={{ position: 'relative', height: 60 }}>
              <svg viewBox="0 0 200 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {/* Overbought/oversold zones */}
                <line x1="0" y1={40 - ((70 - minV) / range) * 40} x2="200" y2={40 - ((70 - minV) / range) * 40}
                  stroke="#dc262640" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1={40 - ((30 - minV) / range) * 40} x2="200" y2={40 - ((30 - minV) / range) * 40}
                  stroke="#16a34a40" strokeWidth="1" strokeDasharray="3,3" />
                {/* RSI line */}
                <path d={sparkPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Last point dot */}
                <circle
                  cx={(recent.length - 1) / (recent.length - 1) * 200}
                  cy={40 - ((latest.value - minV) / range) * 40}
                  r="3" fill={color}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Educational box */}
        <div style={{
          marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start',
          background: bg, border: `1px solid ${color}30`,
          borderRadius: 10, padding: '12px 14px',
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={12} color={color} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color, margin: '0 0 3px' }}>
              What does RSI {latest.value.toFixed(0)} mean?
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65 }}>
              {desc}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: '10px 0 0', lineHeight: 1.6 }}>
          ⚠️ RSI is a momentum indicator, not a guarantee of future price movement. Always combine with other analysis before making investment decisions.
        </p>
      </div>
    </div>
  )
}