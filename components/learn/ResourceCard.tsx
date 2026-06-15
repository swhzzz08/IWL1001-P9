"use client"

import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import type { Article } from '@/types/education'

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
    Beginner:     { bg: '#f0fdf4', color: '#16a34a' },
    Intermediate: { bg: '#fffbeb', color: '#d97706' },
    Advanced:     { bg: '#fef2f2', color: '#dc2626' },
}

export function ResourceCard({ article, categorySlug }: { article: Article; categorySlug: string }) {
    const diff = DIFFICULTY_STYLES[article.difficulty] ?? DIFFICULTY_STYLES.Beginner

    return (
        <Link href={`/learn/${categorySlug}/${article.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                borderRadius: 14, border: '1.5px solid var(--color-border)',
                background: 'var(--color-surface)', padding: '18px',
                height: '100%', transition: 'all 0.2s', cursor: 'pointer',
            }}
                onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = '#93c5fd'
                    el.style.boxShadow = '0 4px 16px rgba(37,99,235,0.08)'
                    el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--color-border)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-heading)' }}>
                        {article.title}
                    </h3>
                    <span style={{ ...diff, borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {article.difficulty}
                    </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {article.summary}
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-subtle)' }}>
                        <Clock size={11} />
                        {article.readTimeMinutes} min read
                    </div>
                    <ChevronRight size={14} color="var(--color-text-subtle)" />
                </div>
            </div>
        </Link>
    )
}