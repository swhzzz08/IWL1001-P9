import type { Hint } from '@/data/hints'

const CATEGORY_COLORS: Record<Hint['category'], string> = {
    'Reading Charts': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    'Risk Management': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    'Entry & Exit': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    'Psychology': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    'Indicators': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

export function HintCard({ hint }: { hint: Hint }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold">{hint.title}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[hint.category]}`}>
          {hint.category}
        </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{hint.body}</p>
        </div>
    )
}