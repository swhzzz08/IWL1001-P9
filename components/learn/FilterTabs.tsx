interface Props { categories: string[]; selected: string; onSelect: (cat: string) => void }

export function FilterTabs({ categories, selected, onSelect }: Props) {
    return (
        <div role="group" aria-label="Filter by category" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {categories.map(cat => {
                const active = selected === cat
                return (
                    <button key={cat} aria-pressed={active} onClick={() => onSelect(cat)} style={{
                        padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', transition: 'all 0.15s',
                        border: `1.5px solid ${active ? '#2563eb' : 'var(--color-border)'}`,
                        background: active ? '#2563eb' : 'var(--color-surface)',
                        color: active ? 'white' : 'var(--color-text-muted)',
                    }}>
                        {cat}
                    </button>
                )
            })}
        </div>
    )
}