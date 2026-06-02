// components/ui/PriceChange.tsx
import { cn } from '@/lib/utils'

interface Props {
    change: number
    changePercent: number
    className?: string
}

export function PriceChange({ change, changePercent, className }: Props) {
    const isPositive = change >= 0
    const sign = isPositive ? '+' : ''

    return (
        <span
            data-testid="price-change"
            className={cn(
                'text-sm font-medium tabular-nums',
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                className
            )}
        >
      {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
    </span>
    )
}