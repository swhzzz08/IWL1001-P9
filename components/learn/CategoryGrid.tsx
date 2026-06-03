import { CategoryCard } from './CategoryCard'
import type { Category } from '@/types/education'

export function CategoryGrid({ categories }: { categories: Category[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
            ))}
        </div>
    )
}