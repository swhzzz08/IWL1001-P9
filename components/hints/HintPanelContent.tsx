'use client'

import { useState } from 'react'
import { ChevronRight, BookOpen } from 'lucide-react'
import { useHints } from '@/hooks/useHints'
import type { Hint } from '@/data/hints'

const CATEGORIES: Array<Hint['category'] | null> = [
  null,
  'Reading Charts',
  'Indicators',
  'Entry & Exit',
  'Risk Management',
  'Psychology',
]

const CATEGORY_LABELS: Record<string, string> = {
  'null': 'All',
  'Reading Charts': 'Charts',
  'Indicators': 'Indicators',
  'Entry & Exit': 'Entry/Exit',
  'Risk Management': 'Risk',
  'Psychology': 'Psychology',
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Reading Charts': { bg: '#eff6ff', color: '#2563eb' },
  'Risk Management': { bg: '#fef2f2', color: '#dc2626' },
  'Entry & Exit': { bg: '#f0fdf4', color: '#16a34a' },
  'Psychology': { bg: '#fdf4ff', color: '#9333ea' },
  'Indicators': { bg: '#fffbeb', color: '#d97706' },
}

export function HintPanelContent() {
  const { category, setCategory, activeHints } = useHints()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <>
      {/* Category filter */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        padding: '10px 12px', borderBottom: '1px solid var(--color-border)',
        scrollbarWidth: 'none',
      }}>
        {CATEGORIES.map(cat => {
          const label = CATEGORY_LABELS[String(cat)]
          const active = category === cat
          return (
            <button key={String(cat)} onClick={() => { setCategory(cat); setExpandedId(null) }} style={{
              flexShrink: 0, padding: '4px 12px', borderRadius: 999,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              border: `1.5px solid ${active ? '#0f766e' : 'var(--color-border)'}`,
              background: active ? '#0f766e' : 'var(--color-surface-2)',
              color: active ? 'white' : 'var(--color-text-muted)',
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Hint rows */}
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {activeHints.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>No hints in this category.</p>
          </div>
        ) : (
          activeHints.map((hint, i) => {
            const catColor = CATEGORY_COLORS[hint.category] ?? { bg: '#f0fdfa', color: '#0f766e' }
            const expanded = expandedId === hint.id
            return (
              <div key={hint.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => setExpandedId(expanded ? null : hint.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                >
                  {/* Number badge */}
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: catColor.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: catColor.color,
                  }}>
                    {i + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.4 }}>
                      {hint.title}
                    </p>
                    <span style={{
                      display: 'inline-block', marginTop: 3,
                      background: catColor.bg, color: catColor.color,
                      borderRadius: 999, padding: '1px 7px',
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {hint.category}
                    </span>
                  </div>

                  <ChevronRight size={13} color="var(--color-text-subtle)" style={{ flexShrink: 0, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {/* Expanded content */}
                {expanded && (
                  <div style={{
                    padding: '0 14px 14px 50px',
                    background: catColor.bg,
                    borderTop: `1px solid ${catColor.color}20`,
                  }}>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.7 }}>
                      {hint.body}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      <BookOpen size={10} color={catColor.color} />
                      <span style={{ fontSize: 10, color: catColor.color, fontWeight: 600 }}>Educational tip</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 14px', borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)', textAlign: 'center',
      }}>
        <p style={{ fontSize: 10, color: 'var(--color-text-subtle)', margin: 0 }}>
          Tips are for educational purposes only · Not financial advice
        </p>
      </div>
    </>
  )
}