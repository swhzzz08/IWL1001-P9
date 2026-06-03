import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ResourceCard } from '@/components/learn/ResourceCard'
import { articles, categories } from '@/data/education'
import { ArrowLeft } from 'lucide-react'

export default async function CategoryPage({
                                               params,
                                           }: {
    params: Promise<{ category: string }>
}) {
    const { category: categorySlug } = await params
    const category = categories.find((c) => c.slug === categorySlug)
    if (!category) notFound()

    const categoryArticles = articles.filter(
        (a) => a.category === category.name
    )

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <Link
                href="/learn"
                className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Learn
            </Link>

            <h1 className="font-heading text-3xl font-bold">{category.name}</h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.length > 0 ? (
                    categoryArticles.map((article) => (
                        <ResourceCard
                            key={article.slug}
                            article={article}
                            categorySlug={categorySlug}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No articles in this category yet.
                    </p>
                )}
            </div>
        </div>
    )
}