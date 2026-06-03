import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BarChart2 } from 'lucide-react'
import { articles, categories } from '@/data/education'

const DIFFICULTY_STYLES = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default async function ArticlePage({
                                              params,
                                          }: {
    params: Promise<{ category: string; slug: string }>
}) {
    const { category: categorySlug, slug } = await params
    const article = articles.find((a) => a.slug === slug)
    const category = categories.find((c) => c.slug === categorySlug)

    if (!article || !category) notFound()

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <Link
                href={`/learn/${categorySlug}`}
                className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to {category.name}
            </Link>

            <header className="mb-8">
                <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[article.difficulty]}`}>
            {article.difficulty}
          </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
                        {article.readTimeMinutes} min read
          </span>
                </div>
                <h1 className="font-heading text-3xl font-bold leading-tight">{article.title}</h1>
                <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>
            </header>

            <article className="prose prose-sm dark:prose-invert max-w-none">
                {article.body.split('\n\n').map((paragraph, i) => {
                    // Bold **text** rendering
                    const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
                    return (
                        <p key={i} className="mb-4 text-sm leading-relaxed text-foreground">
                            {parts.map((part, j) =>
                                part.startsWith('**') && part.endsWith('**') ? (
                                    <strong key={j}>{part.slice(2, -2)}</strong>
                                ) : (
                                    part
                                )
                            )}
                        </p>
                    )
                })}
            </article>

            {/* Related articles */}
            <footer className="mt-12 border-t border-border pt-6">
                <p className="text-xs text-muted-foreground">
                    Category:{' '}
                    <Link href={`/learn/${categorySlug}`} className="hover:text-primary underline">
                        {category.name}
                    </Link>
                </p>
            </footer>
        </div>
    )
}