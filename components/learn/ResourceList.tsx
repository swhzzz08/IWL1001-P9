'use client'

import { useState, useMemo } from 'react'
import { LearnSearchBar } from './LearnSearchBar'
import { FilterTabs } from './FilterTabs'
import { ResourceCard } from './ResourceCard'
import { articles, categories } from '@/data/education'
import type { TopicCategory } from '@/types/education'

const ALL_LABEL = 'All'
const CATEGORY_LABELS = [ALL_LABEL, ...categories.map((c) => c.name)]

function getCategorySlug(name: TopicCategory): string {
    return categories.find((c) => c.name === name)?.slug ?? name.toLowerCase().replace(/\s+/g, '-')
}

export function ResourceList() {
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(ALL_LABEL)

    const filtered = useMemo(() => {
        return articles.filter((a) => {
            const matchesCategory = selected === ALL_LABEL || a.category === selected
            const matchesSearch =
                search === '' ||
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.summary.toLowerCase().includes(search.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [search, selected])

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <LearnSearchBar value={search} onChange={setSearch} />
                <FilterTabs categories={CATEGORY_LABELS} selected={selected} onSelect={setSelected} />
            </div>

            {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No articles match your search.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((article) => (
                        <ResourceCard
                            key={article.slug}
                            article={article}
                            categorySlug={getCategorySlug(article.category)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}