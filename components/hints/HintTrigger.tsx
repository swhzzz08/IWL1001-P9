'use client'

import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    isOpen: boolean
    onToggle: () => void
}

export function HintTrigger({ isOpen, onToggle }: Props) {
    return (
        <button
            onClick={onToggle}
            aria-label={isOpen ? 'Close trading hints' : 'Open trading hints'}
            className={cn(
                'fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors',
                isOpen
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
            )}
        >
            <HelpCircle className="h-5 w-5" />
        </button>
    )
}