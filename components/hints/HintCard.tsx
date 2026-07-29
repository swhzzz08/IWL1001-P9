'use client'
import type { Hint } from '@/data/hints'

const CATEGORY_COLORS: Record<Hint['category'], { bg: string; color: string }> = {
  'Reading Charts':  { bg: '#eff6ff', color: '#2563eb' },
  'Risk Management': { bg: '#fef2f2', color: '#dc2626' },
  'Entry & Exit':    { bg: '#f0fdf4', color: '#16a34a' },
  'Psychology':      { bg: '#fdf4ff', color: '#9333ea' },
  'Indicators':      { bg: '#fffbeb', color: '#d97706' },
}

export function HintCard({ hint }: { hint: Hint }) {
  const c = CATEGORY_COLORS[hint.category] ?? { bg: '#f0fdfa', color: '#0f766e' }
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 14, padding: '16px',
      borderLeft: `3px solid ${c.color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.4 }}>
          {hint.title}
        </h3>
        <span style={{
          background: c.bg, color: c.color,
          borderRadius: 999, padding: '3px 8px',
          fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {hint.category}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.7 }}>
        {hint.body}
      </p>
    </div>
  )
}