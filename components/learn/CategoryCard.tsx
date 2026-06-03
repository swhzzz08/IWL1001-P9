import Link from 'next/link'
import {
    TrendingUp, Layers, PieChart, BarChart2,
    Shield, BookOpen, Coins, Landmark,
} from 'lucide-react'
import type { Category } from '@/types/education'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp, Layers, PieChart, BarChart2,
    Shield, BookOpen, Coins, Landmark,
}

export function CategoryCard({ category }: { category: Category }) {
    const Icon = ICONS[category.iconName] ?? BookOpen
    return (
        <Link
            href={`/learn/${category.slug}`}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <h3 className="font-heading text-sm font-bold">{category.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{category.description}</p>
            </div>
            <p className="text-xs text-muted-foreground">{category.articleCount} articles</p>
        </Link>
    )
}