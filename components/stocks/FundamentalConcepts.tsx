'use client'

import { useState } from 'react'
import { ChevronDown, Landmark } from 'lucide-react'
import type { StockQuote } from '@/types/stock'

interface ConceptDef {
    key: string
    label: string
    value: string
    definition: string
    interpretation: string
    example: string
}

function peInterpretation(pe: number | null, symbol: string): string {
    if (pe == null) return `${symbol} doesn't have a meaningful P/E ratio right now (this is common for ETFs, or companies with no or negative earnings).`
    if (pe > 40) return `${symbol}'s P/E of ${pe.toFixed(1)} is high — the market is pricing in strong future growth. That growth needs to actually show up in earnings, or the stock can look "expensive" in hindsight.`
    if (pe > 20) return `${symbol}'s P/E of ${pe.toFixed(1)} is in a fairly typical range for an established, moderately growing company.`
    return `${symbol}'s P/E of ${pe.toFixed(1)} is on the lower side — this can mean the stock is undervalued, or that the market expects slower growth or higher risk ahead. Worth digging into why before assuming it's "cheap."`
}

function epsInterpretation(eps: number | null, symbol: string): string {
    if (eps == null) return `${symbol} doesn't report a standalone EPS in this view (typical for index ETFs, which hold many companies rather than being one).`
    if (eps > 10) return `${symbol} earns $${eps.toFixed(2)} per share — a large absolute number, though what matters more is whether this is growing year over year and how it compares to the share price (that's what P/E measures).`
    return `${symbol} earns $${eps.toFixed(2)} per share. On its own, EPS doesn't tell you if the stock is cheap or expensive — pair it with the P/E ratio for that.`
}

function roeInterpretation(roe: number | null, symbol: string): string {
    if (roe == null) return `${symbol} doesn't have a standalone ROE figure in this view.`
    if (roe > 60) return `${symbol}'s ROE of ${roe.toFixed(1)}% is very high. That can reflect an efficient, capital-light business model — or it can be inflated by heavy borrowing. Check the Debt-to-Equity ratio alongside this before concluding the business is simply "excellent."`
    if (roe > 20) return `${symbol}'s ROE of ${roe.toFixed(1)}% suggests the company converts shareholder equity into profit fairly efficiently — generally viewed as healthy, though it's most meaningful compared against similar companies in the same industry.`
    return `${symbol}'s ROE of ${roe.toFixed(1)}% is more modest. That's not automatically bad — capital-intensive industries (utilities, manufacturing) typically run lower ROE than software or services businesses.`
}

function deInterpretation(de: number | null, symbol: string): string {
    if (de == null) return `${symbol} doesn't have a standalone Debt-to-Equity figure in this view.`
    if (de > 1) return `${symbol}'s Debt-to-Equity of ${de.toFixed(2)} means it carries more debt than shareholder equity. That's not unusual for some industries, but it does mean higher fixed interest obligations and more risk if business slows down.`
    if (de > 0.4) return `${symbol}'s Debt-to-Equity of ${de.toFixed(2)} reflects a moderate amount of leverage — a mix of shareholder and borrowed capital funding the business.`
    return `${symbol}'s Debt-to-Equity of ${de.toFixed(2)} is low — the company relies mostly on shareholder equity rather than debt, which generally means lower financial risk (though also potentially less use of "cheap" leverage to grow faster).`
}

function buildConcepts(quote: StockQuote): ConceptDef[] {
    const s = quote.symbol
    return [
        {
            key: 'pe',
            label: 'P/E Ratio (Price-to-Earnings)',
            value: quote.peRatio != null ? quote.peRatio.toFixed(2) : 'N/A',
            definition: 'P/E = Share Price ÷ Earnings Per Share. It shows how much investors are paying today for every $1 of the company\'s annual profit.',
            interpretation: peInterpretation(quote.peRatio, s),
            example: 'Example: a stock priced at $60 with EPS of $3 has a P/E of 20 — investors are paying $20 for every $1 of current annual earnings.',
        },
        {
            key: 'eps',
            label: 'EPS (Earnings Per Share)',
            value: quote.eps != null ? `$${quote.eps.toFixed(2)}` : 'N/A',
            definition: 'EPS = Net Income ÷ Shares Outstanding. It measures how much profit the company generated for each individual share.',
            interpretation: epsInterpretation(quote.eps, s),
            example: 'Example: a company with $100M net income and 50M shares outstanding has an EPS of $2.00.',
        },
        {
            key: 'roe',
            label: 'ROE (Return on Equity)',
            value: quote.roe != null ? `${quote.roe.toFixed(1)}%` : 'N/A',
            definition: 'ROE = Net Income ÷ Shareholder Equity. It measures how efficiently a company turns shareholders\' invested money into profit.',
            interpretation: roeInterpretation(quote.roe, s),
            example: 'Example: $100M net income ÷ $500M shareholder equity = 20% ROE — every $1 of equity generated $0.20 of profit that year.',
        },
        {
            key: 'de',
            label: 'Debt-to-Equity Ratio',
            value: quote.debtToEquity != null ? quote.debtToEquity.toFixed(2) : 'N/A',
            definition: 'D/E = Total Debt ÷ Shareholder Equity. It shows how much of the company is funded by borrowing versus shareholder capital.',
            interpretation: deInterpretation(quote.debtToEquity, s),
            example: 'Example: a company with $1 in debt for every $1 of equity has a D/E of 1.0 — roughly half its funding comes from borrowing.',
        },
    ]
}

function ConceptCard({ concept }: { concept: ConceptDef }) {
    const [open, setOpen] = useState(false)

    return (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
            >
                <div>
                    <p style={{ margin: '0 0 3px', fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-muted)' }}>{concept.label}</p>
                    <strong style={{ fontSize: 20, color: 'var(--color-text)' }}>{concept.value}</strong>
                </div>
                <ChevronDown size={18} color="var(--color-text-subtle)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>

            {open && (
                <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f766e' }}>Definition</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text)', lineHeight: 1.7 }}>{concept.definition}</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb' }}>Real-world interpretation</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text)', lineHeight: 1.7 }}>{concept.interpretation}</p>
                    </div>
                    <div style={{ background: 'var(--color-surface-2)', borderRadius: 10, padding: '10px 14px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)' }}>Practical example</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{concept.example}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export function FundamentalConcepts({ quote }: { quote: StockQuote }) {
    const concepts = buildConcepts(quote)

    return (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Landmark size={15} color="#0f766e" />
                <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
                    Key Financial Concepts
                </h2>
                <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>· tap a card to expand</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 12 }}>
                {concepts.map(c => <ConceptCard key={c.key} concept={c} />)}
            </div>
        </div>
    )
}