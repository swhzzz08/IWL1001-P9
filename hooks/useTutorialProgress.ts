'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_PREFIX = 'tutorial-progress:'

interface StoredProgress {
    completedStepIds: string[]
    completed: boolean
    updatedAt: string
}

function readProgress(slug: string): StoredProgress {
    if (typeof window === 'undefined') return { completedStepIds: [], completed: false, updatedAt: '' }
    try {
        const raw = window.localStorage.getItem(STORAGE_PREFIX + slug)
        if (!raw) return { completedStepIds: [], completed: false, updatedAt: '' }
        const parsed = JSON.parse(raw) as StoredProgress
        return {
            completedStepIds: Array.isArray(parsed.completedStepIds) ? parsed.completedStepIds : [],
            completed: Boolean(parsed.completed),
            updatedAt: parsed.updatedAt ?? '',
        }
    } catch {
        return { completedStepIds: [], completed: false, updatedAt: '' }
    }
}

function writeProgress(slug: string, progress: StoredProgress) {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(progress))
    } catch {
        // localStorage unavailable (private browsing etc.) — progress just won't persist
    }
}

/**
 * Tracks which steps of a tutorial the learner has completed, persisted per-browser.
 * No account/database required — this is intentionally lightweight since tutorial
 * progress is a nice-to-have convenience, not a system of record.
 */
export function useTutorialProgress(slug: string, totalSteps: number) {
    const [completedStepIds, setCompletedStepIds] = useState<string[]>([])
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        const stored = readProgress(slug)
        setCompletedStepIds(stored.completedStepIds)
        setHydrated(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    const markStepComplete = useCallback((stepId: string) => {
        setCompletedStepIds(prev => {
            if (prev.includes(stepId)) return prev
            const next = [...prev, stepId]
            writeProgress(slug, {
                completedStepIds: next,
                completed: next.length >= totalSteps,
                updatedAt: new Date().toISOString(),
            })
            return next
        })
    }, [slug, totalSteps])

    const resetProgress = useCallback(() => {
        setCompletedStepIds([])
        writeProgress(slug, { completedStepIds: [], completed: false, updatedAt: new Date().toISOString() })
    }, [slug])

    return {
        completedStepIds,
        completedCount: completedStepIds.length,
        isComplete: totalSteps > 0 && completedStepIds.length >= totalSteps,
        markStepComplete,
        resetProgress,
        hydrated,
    }
}

/** Reads completion summary for many tutorials at once, for list/card views. */
export function useAllTutorialProgress(slugs: string[]) {
    const [summary, setSummary] = useState<Record<string, StoredProgress>>({})

    useEffect(() => {
        const next: Record<string, StoredProgress> = {}
        for (const slug of slugs) {
            next[slug] = readProgress(slug)
        }
        setSummary(next)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugs.join(',')])

    return summary
}