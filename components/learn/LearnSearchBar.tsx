'use client'

import { Search } from 'lucide-react'

interface Props {
    value: string
    onChange: (v: string) => void
}

export function LearnSearchBar({ value, onChange }: Props) {
    return (
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search articles…"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
        </div>
    )
}