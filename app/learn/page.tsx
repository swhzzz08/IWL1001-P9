import { CategoryGrid } from '@/components/learn/CategoryGrid'
import { ResourceList } from '@/components/learn/ResourceList'
import { categories } from '@/data/education'
import { BookOpen, GraduationCap, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Learn — MarketWise',
    description: 'Educational resources on stocks, options, ETFs, and more.',
}

const STATS = [
    { value: '7', label: 'Topics covered' },
    { value: '7+', label: 'Articles' },
    { value: 'Free', label: 'Always free' },
]

export default function LearnPage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative overflow-hidden hero-grid border-b border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 relative">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                                Financial Education Hub
                            </h1>
                            <p className="mt-2 text-muted-foreground max-w-xl leading-relaxed">
                                Everything you need to understand markets — from what a stock is to reading financial statements and managing risk.
                            </p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-8 flex flex-wrap gap-6">
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="flex items-baseline gap-2">
                                <span className="font-heading text-2xl font-bold text-primary">{value}</span>
                                <span className="text-sm text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl w-full px-4 py-10 space-y-12">
                {/* Categories */}
                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="font-heading text-lg font-bold">Browse by Topic</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Pick a subject to explore</p>
                        </div>
                    </div>
                    <CategoryGrid categories={categories} />
                </section>

                {/* All articles */}
                <section>
                    <div className="mb-5">
                        <h2 className="font-heading text-lg font-bold">All Articles</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Search and filter by topic or difficulty</p>
                    </div>
                    <ResourceList />
                </section>

                {/* Beginner CTA */}
                <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold">Not sure where to start?</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Begin with "What Is a Stock?" — our most-read beginner article.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/learn/stocks/what-is-a-stock.ts"
                            className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                            Read article
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}