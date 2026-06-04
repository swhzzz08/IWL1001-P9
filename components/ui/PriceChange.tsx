import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
    change: number
    changePercent: number
    className?: string
    compact?: boolean
}

export function PriceChange({ change, changePercent, className, compact }: Props) {
    const isPositive = change >= 0
    const sign = isPositive ? '+' : ''

    if (compact) {
        return (
            <span
                data-testid="price-change"
                className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
                    isPositive
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400',
                    className
                )}
            >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {sign}{changePercent.toFixed(2)}%
            </span>
        )
    }

    return (
        <span
            data-testid="price-change"
            className={cn(
                'inline-flex items-center gap-1 text-sm font-semibold tabular-nums',
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                className
            )}
        >
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
        </span>
    )
}