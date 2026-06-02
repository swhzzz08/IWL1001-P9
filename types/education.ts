export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type TopicCategory =
    | 'Stocks'
    | 'Options'
    | 'ETFs'
    | 'Crypto'
    | 'Bonds'
    | 'Fundamentals'
    | 'Technical Analysis'
    | 'Risk Management'

export interface Article {
    slug: string
    title: string
    summary: string
    category: TopicCategory
    difficulty: DifficultyLevel
    readTimeMinutes: number
    body: string   // plain text or simple markdown for MVP
    publishedAt: string  // 'YYYY-MM-DD'
}

export interface Category {
    slug: string
    name: TopicCategory
    description: string
    articleCount: number
    iconName: string   // lucide-react icon name
}

export interface ResourceItem {
    article: Article
    category: Category
}