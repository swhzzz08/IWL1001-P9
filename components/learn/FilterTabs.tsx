'use client'

import { cn } from '@/lib/utils'

interface Props {
    categories: string[]
    selected: string
    onSelect: (cat: string) => void
}

export function FilterTabs({ categories, selected, onSelect }: Props) {
    return (
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = selected === cat
                return (
                    <button
                        key={cat}
                        aria-pressed={isActive}
                        onClick={() => onSelect(cat)}
                        className={cn(
                            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        )}
                    >
                        {cat}
                    </button>
                )
            })}
        </div>
    )
}