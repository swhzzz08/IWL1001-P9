'use client'

import { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'
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
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
        <>
            <HintTrigger isOpen={isOpen} onToggle={toggle} />

            {isOpen && (
                <div className="fixed bottom-20 left-6 z-30 w-72 flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between bg-primary px-4 py-3">
                        <div>
                            <h2 className="text-sm font-bold text-primary-foreground">Trading Hints</h2>
                            <p className="text-xs text-primary-foreground/70 mt-0.5">Quick guides to help you read charts</p>
                        </div>
                        <button onClick={close} aria-label="Close hints" className="text-primary-foreground/70 hover:text-primary-foreground mt-0.5">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-1 overflow-x-auto px-3 py-2 border-b border-border scrollbar-none">
                        {CATEGORIES.map((cat) => {
                            const label = CATEGORY_LABELS[String(cat)]
                            const active = category === cat
                            return (
                                <button
                                    key={String(cat)}
                                    onClick={() => { setCategory(cat); setExpandedId(null) }}
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
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

                    {/* Hint rows */}
                    <div className="flex-1 overflow-y-auto max-h-80 divide-y divide-border">
                        {activeHints.map((hint) => (
                            <div key={hint.id}>
                                <button
                                    onClick={() => setExpandedId(expandedId === hint.id ? null : hint.id)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                                >
                                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
                                    <span className="flex-1 text-sm font-medium text-foreground">{hint.title}</span>
                                    <ChevronRight
                                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandedId === hint.id ? 'rotate-90' : ''}`}
                                    />
                                </button>
                                {expandedId === hint.id && (
                                    <p className="px-4 pb-3 text-xs leading-relaxed text-muted-foreground">
                                        {hint.body}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
