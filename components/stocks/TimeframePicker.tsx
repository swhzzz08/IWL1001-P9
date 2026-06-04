'use client'
import type { Timeframe } from '@/types/stock'

const TFS: { value: Timeframe; label: string }[] = [
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'All' },
]

export function TimeframePicker({ selected, onChange }: { selected: Timeframe; onChange: (tf: Timeframe) => void }) {
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 4,
      background: 'var(--color-surface-2)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 12,
    }}>
      {TFS.map(({ value, label }) => (
        <button key={value} onClick={() => onChange(value)} style={{
          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
          cursor: 'pointer', border: 'none', transition: 'all 0.15s',
          background: selected === value ? 'var(--color-surface)' : 'transparent',
          color: selected === value ? '#2563eb' : 'var(--color-text-subtle)',
          boxShadow: selected === value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}