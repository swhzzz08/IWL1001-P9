'use client'

import { useState, useMemo } from 'react'
import { hints, type Hint } from '@/data/hints'

type HintCategory = Hint['category'] | null

export function useHints() {
    const [isOpen, setIsOpen] = useState(false)
    const [category, setCategory] = useState<HintCategory>(null)

    const activeHints = useMemo(
        () => (category ? hints.filter((h) => h.category === category) : hints),
        [category]
    )

    return {
        isOpen,
        toggle: () => setIsOpen((prev) => !prev),
        close: () => setIsOpen(false),
        category,
        setCategory,
        activeHints,
    }
}