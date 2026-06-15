import { CategoryCard } from './CategoryCard'
import type { Category } from '@/types/education'

export function CategoryGrid({ categories }: { categories: Category[] }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
        }}>
            {categories.map((cat, i) => (
                <CategoryCard key={cat.slug} category={cat} index={i} />
            ))}
        </div>
    )
}