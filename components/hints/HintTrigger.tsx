'use client'

import { Lightbulb, ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
    isOpen: boolean
    onToggle: () => void
}

export function HintTrigger({ isOpen, onToggle }: Props) {
    return (
        <button
            onClick={onToggle}
            aria-label={isOpen ? 'Close trading hints' : 'Open trading hints'}
            className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
        >
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-semibold">Trading Hints</span>
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
    )
}
