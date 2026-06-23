import { Search } from 'lucide-react'

interface Props { value: string; onChange: (v: string) => void }

export function LearnSearchBar({ value, onChange }: Props) {
    return (
        <div style={{ position: 'relative', maxWidth: 360 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
            <input
                type="search"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Search articles…"
                style={{
                    width: '100%', height: 40, paddingLeft: 36, paddingRight: 12,
                    borderRadius: 10, border: '1.5px solid var(--color-border)',
                    background: 'var(--color-surface)', fontSize: 13,
                    color: 'var(--color-text)', outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#93c5fd'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)'}
            />
        </div>
    )
}