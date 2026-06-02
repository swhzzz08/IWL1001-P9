import { Suspense } from 'react'
import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { TrendingStocks } from '@/components/dashboard/TrendingStocks'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { BookOpen, TrendingUp } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Hero */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                    Learn to Trade. <span className="text-primary">Track the Market.</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Live market data, interactive charts, and educational resources — all in one place.
                </p>
                <div className="mt-4 flex gap-3">
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <BookOpen className="h-4 w-4" />
                        Start Learning
                    </Link>
                    <Link
                        href="/stocks/AAPL"
                        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <TrendingUp className="h-4 w-4" />
                        View Charts
                    </Link>
                </div>
            </div>

            {/* Market Overview */}
            <Suspense fallback={
                <div className="flex h-24 items-center justify-center">
                    <LoadingSpinner />
                </div>
            }>
                <MarketOverview />
            </Suspense>

            {/* Trending */}
            <div className="mt-8">
                <Suspense fallback={
                    <div className="flex h-40 items-center justify-center">
                        <LoadingSpinner />
                    </div>
                }>
                    <TrendingStocks />
                </Suspense>
            </div>
        </div>
    )
}