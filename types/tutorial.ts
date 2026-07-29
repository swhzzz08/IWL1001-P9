export type TutorialCategory =
    | 'Reading Charts'
    | 'Fundamentals'
    | 'Indicators'
    | 'Portfolio Simulation'
    | 'Accounting Methods'
    | 'Multi-Currency'

export interface TutorialQuizOption {
    id: string
    text: string
    correct: boolean
}

export interface TutorialQuiz {
    question: string
    options: TutorialQuizOption[]
    explanation: string
}

export interface TutorialStep {
    id: string
    title: string
    content: string
    /** Optional short callout box, e.g. a worked example or key takeaway. */
    tip?: string
    /** Optional comprehension check the learner must answer correctly to continue. */
    quiz?: TutorialQuiz
}

export interface Tutorial {
    slug: string
    title: string
    description: string
    category: TutorialCategory
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    estimatedMinutes: number
    steps: TutorialStep[]
}