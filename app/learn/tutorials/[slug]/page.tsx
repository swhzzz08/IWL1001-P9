'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, ListChecks } from 'lucide-react'
import { getTutorial } from '@/data/tutorials'
import { TutorialPlayer } from '@/components/learn/TutorialPlayer'

export default function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const tutorial = getTutorial(slug)
    if (!tutorial) notFound()

    return (
        <div style={{ maxWidth: 940, margin: '0 auto', padding: '32px 24px 80px' }}>
            <Link href="/learn#tutorials" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 20 }}>
                <ArrowLeft size={14} /> Back to Learn
            </Link>

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>
                    {tutorial.title}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: '0 0 10px', lineHeight: 1.7, maxWidth: 700 }}>
                    {tutorial.description}
                </p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-subtle)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {tutorial.estimatedMinutes} min
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ListChecks size={12} /> {tutorial.steps.length} steps
                    </span>
                </div>
            </div>

            <TutorialPlayer tutorial={tutorial} />
        </div>
    )
}