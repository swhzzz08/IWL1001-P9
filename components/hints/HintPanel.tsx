'use client'

import { X } from 'lucide-react'
import { HintCard } from './HintCard'
import { HintTrigger } from './HintTrigger'
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

export function HintPanel() {
    const { isOpen, toggle, close, category, setCategory, activeHints } = useHints()

    return (
        <>
            <HintTrigger isOpen={isOpen} onToggle={toggle} />

            {/* Floating popup */}
            {isOpen && (
                <aside className="fixed bottom-20 right-6 z-30 flex w-80 max-h-[70vh] flex-col rounded-xl border border-border bg-background shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-3 rounded-t-xl">
                        <h2 className="font-heading text-sm font-bold">Trading Hints</h2>
                        <button onClick={close} aria-label="Close hints panel">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Category filter */}
                    <div className="flex flex-wrap gap-1 border-b border-border px-4 py-2">
                        {CATEGORIES.map((cat) => {
                            const label = CATEGORY_LABELS[String(cat)]
                            const active = category === cat
                            return (
                                <button
                                    key={String(cat)}
                                    onClick={() => setCategory(cat)}
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                        active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Hint list */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {activeHints.map((hint) => (
                            <HintCard key={hint.id} hint={hint} />
                        ))}
                    </div>
                </aside>
            )}
        </>
    )
}