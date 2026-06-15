'use client'

import { useState, useMemo } from 'react'
import { LearnSearchBar } from './LearnSearchBar'
import { FilterTabs } from './FilterTabs'
import { ResourceCard } from './ResourceCard'
import { articles, categories } from '@/data/education'
import type { TopicCategory } from '@/types/education'

const ALL_LABEL = 'All'
const CATEGORY_LABELS = [ALL_LABEL, ...categories.map(c => c.name)]

function getCategorySlug(name: TopicCategory): string {
    return categories.find(c => c.name === name)?.slug ?? name.toLowerCase().replace(/\s+/g, '-')
}

export function ResourceList() {
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(ALL_LABEL)

    const filtered = useMemo(() => {
        return articles.filter(a => {
            const matchesCategory = selected === ALL_LABEL || a.category === selected
            const matchesSearch = search === '' ||
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.summary.toLowerCase().includes(search.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [search, selected])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <LearnSearchBar value={search} onChange={setSearch} />
                <FilterTabs categories={CATEGORY_LABELS} selected={selected} onSelect={setSelected} />
            </div>

            {filtered.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16 }}>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>No articles match your search.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                    {filtered.map(article => (
                        <ResourceCard key={article.slug} article={article} categorySlug={getCategorySlug(article.category)} />
                    ))}
                </div>
            )}
        </div>
    )
}