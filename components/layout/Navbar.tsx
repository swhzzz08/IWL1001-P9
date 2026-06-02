'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { TrendingUp, Search, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
    { href: '/', label: 'Markets' },
    { href: '/learn', label: 'Learn' },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        const symbol = search.trim().toUpperCase()
        if (symbol) {
            router.push(`/stocks/${symbol}`)
            setSearch('')
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>MarketWise</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="hidden items-center gap-2 md:flex">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search symbol… (AAPL)"
                            className="h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                </form>

                {/* Mobile menu button */}
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t border-border bg-background px-4 py-3 md:hidden">
                    <form onSubmit={handleSearch} className="mb-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search symbol…"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                        />
                    </form>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block py-2 text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}