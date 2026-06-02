'use client'

import { cn } from '@/lib/utils'
import type { Timeframe } from '@/types/stock.ts'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

interface Props {
    selected: Timeframe
    onChange: (tf: Timeframe) => void
}

export function TimeframePicker({ selected, onChange }: Props) {
    return (
        <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
                <button
                    key={tf}
                    onClick={() => onChange(tf)}
                    className={cn(
                        'rounded px-3 py-1 text-xs font-medium transition-colors',
                        selected === tf
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                >
                    {tf}
                </button>
            ))}
        </div>
    )
}