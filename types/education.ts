export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type TopicCategory =
    | 'Stocks'
    | 'Options'
    | 'Bonds'
    | 'ETFs'
    | 'Crypto'
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
    body: string
    publishedAt: string
}

export interface Category {
    slug: string
    name: TopicCategory
    description: string
    articleCount: number
    iconName: string
}

export interface ResourceItem {
    article: Article
    category: Category
}