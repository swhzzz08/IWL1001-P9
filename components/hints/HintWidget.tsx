'use client'

import { motion } from 'motion/react'
import { Lightbulb, ChevronUp, Minus } from 'lucide-react'
import { useHints } from '@/hooks/useHints'
import { HintPanelContent } from './HintPanelContent'

export function HintWidget() {
    const { isOpen, toggle } = useHints()

    return (
        <motion.div
            layout
            layoutId="hint-widget"
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed bottom-6 left-6 z-40"
            style={isOpen ? { width: 288 } : { width: 'auto' }}
        >
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            {!isOpen && (
                <button
                    onClick={toggle}
                    aria-label="Open trading hints"
                    className="flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-sm font-semibold">Trading Hints</span>
                    <ChevronUp className="h-3.5 w-3.5" />
                </button>
            )}

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col"
                >
                    <div className="flex items-center justify-between bg-primary px-4 py-3">
                        <h2 className="text-sm font-bold text-primary-foreground">Trading Hints</h2>
                        <button
                            onClick={toggle}
                            aria-label="Minimize trading hints"
                            className="text-primary-foreground/70 hover:text-primary-foreground"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                    </div>
                    <HintPanelContent />
                </motion.div>
            )}
          </div>
        </motion.div>
    )
}
