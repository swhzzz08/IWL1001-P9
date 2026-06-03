import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Article } from '@/types/education'

const DIFFICULTY_STYLES = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export function ResourceCard({ article, categorySlug }: { article: Article; categorySlug: string }) {
    return (
        <Link
            href={`/learn/${categorySlug}/${article.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary">
                    {article.title}
                </h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[article.difficulty]}`}>
          {article.difficulty}
        </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{article.summary}</p>
            <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{article.readTimeMinutes} min read</span>
            </div>
        </Link>
    )
}