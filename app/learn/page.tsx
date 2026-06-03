import { CategoryGrid } from '@/components/learn/CategoryGrid'
import { ResourceList } from '@/components/learn/ResourceList'
import { categories } from '@/data/education'

export const metadata = {
    title: 'Learn — MarketWise',
    description: 'Educational resources on stocks, options, ETFs, and more.',
}

export default function LearnPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
            {/* Hero */}
            <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight">
                    Financial Education Hub
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Everything you need to understand markets, from basic concepts to advanced strategies.
                </p>
            </div>

            {/* Categories */}
            <section>
                <h2 className="mb-4 font-heading text-lg font-semibold">Browse by Topic</h2>
                <CategoryGrid categories={categories} />
            </section>

            {/* All articles with search + filter */}
            <section>
                <h2 className="mb-4 font-heading text-lg font-semibold">All Articles</h2>
                <ResourceList />
            </section>
        </div>
    )
}