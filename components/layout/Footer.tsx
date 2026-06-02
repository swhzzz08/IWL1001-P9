import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-muted/40 py-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>MarketWise</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        For educational purposes only. Not financial advice. Data from Alpha Vantage.
                    </p>
                    <nav className="flex gap-4 text-xs text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">Markets</Link>
                        <Link href="/learn" className="hover:text-foreground">Learn</Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}