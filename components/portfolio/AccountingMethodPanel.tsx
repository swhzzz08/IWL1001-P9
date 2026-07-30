'use client'

import { useMemo } from 'react'
import { Calculator, Info } from 'lucide-react'
import { calculateByMethod, calculateUnrealisedGain, type AccountingMethod, type Trade, type AccountingResult } from '@/lib/accounting'
import { formatCurrency } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock'

export type { AccountingMethod } from '@/lib/accounting'

type QuoteMap = Record<string, StockQuote | undefined>

const METHOD_LABEL: Record<AccountingMethod, string> = {
    FIFO: 'FIFO',
    LIFO: 'LIFO',
    AVERAGE: 'Average Cost',
}

const METHOD_BLURB: Record<AccountingMethod, string> = {
    FIFO: 'First In, First Out assumes the oldest shares you bought are the ones sold first. This is the default method most brokerages use.',
    LIFO: 'Last In, First Out assumes the most recently bought shares are sold first. This can change your realised gain a lot when prices have moved sharply.',
    AVERAGE: 'Average Cost blends every purchase into one weighted average price before calculating any sale — it smooths out the effect of any single lot.',
}

function computeAll(trades: Trade[]) {
    return {
        FIFO: calculateByMethod('FIFO', trades),
        LIFO: calculateByMethod('LIFO', trades),
        AVERAGE: calculateByMethod('AVERAGE', trades),
    } as Record<AccountingMethod, AccountingResult>
}

interface Props {
    trades: Trade[]
    quotes: QuoteMap
    currency: string
    selectedSymbol: string
    onSelectSymbol: (symbol: string) => void
    method: AccountingMethod
    onMethodChange: (method: AccountingMethod) => void
}

export function AccountingMethodPanel({ trades, quotes, currency, selectedSymbol, onSelectSymbol, method, onMethodChange }: Props) {
    const symbols = useMemo(() => {
        const set = new Set(trades.map(t => t.tickerSymbol))
        return Array.from(set).sort()
    }, [trades])

    const symbolTrades = useMemo(
        () => trades.filter(t => t.tickerSymbol === selectedSymbol),
        [trades, selectedSymbol]
    )

    const results = useMemo(() => computeAll(symbolTrades), [symbolTrades])
    const active = results[method]
    const currentPrice = quotes[selectedSymbol]?.price ?? active.averageCost
    const unrealisedGain = calculateUnrealisedGain(active, currentPrice)
    const totalGain = active.realisedGain + unrealisedGain

    return (
        <section style={{
            background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
            borderRadius: 16, overflow: 'hidden', marginBottom: 24,
        }}>
            <div style={{ padding: '17px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calculator size={16} color="#7c3aed" />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 17 }}>Accounting method explorer</h2>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                        See how FIFO, LIFO and Average Cost change your realised gain from the same trades.
                    </p>
                </div>
            </div>

            {symbols.length === 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    Make a simulated trade first — this panel compares accounting methods using your actual trade history.
                </div>
            ) : (
                <div style={{ padding: '20px' }}>
                    {/* Symbol selector */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        {symbols.map(symbol => (
                            <button
                                key={symbol}
                                onClick={() => onSelectSymbol(symbol)}
                                style={{
                                    padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                                    border: `1.5px solid ${symbol === selectedSymbol ? '#7c3aed' : 'var(--color-border)'}`,
                                    background: symbol === selectedSymbol ? '#f5f3ff' : 'var(--color-surface)',
                                    color: symbol === selectedSymbol ? '#7c3aed' : 'var(--color-text-muted)',
                                }}
                            >
                                {symbol}
                            </button>
                        ))}
                    </div>

                    {/* Method tabs */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, background: 'var(--color-surface-2)', borderRadius: 10, padding: 4 }}>
                        {(['FIFO', 'LIFO', 'AVERAGE'] as AccountingMethod[]).map(m => (
                            <button
                                key={m}
                                onClick={() => onMethodChange(m)}
                                style={{
                                    flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    fontSize: 12.5, fontWeight: 700,
                                    background: method === m ? 'var(--color-surface)' : 'transparent',
                                    color: method === m ? '#7c3aed' : 'var(--color-text-muted)',
                                    boxShadow: method === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                }}
                            >
                                {METHOD_LABEL[m]}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
                        <Info size={13} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ margin: 0, fontSize: 12, color: '#6b21a8', lineHeight: 1.6 }}>{METHOD_BLURB[method]}</p>
                    </div>

                    {/* Result grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
                        {[
                            { label: 'Realised gain', value: active.realisedGain, tone: true },
                            { label: 'Remaining shares', value: active.remainingShares, plain: true },
                            { label: 'Avg cost / share', value: active.averageCost, currency: true },
                            { label: 'Remaining cost basis', value: active.remainingCost, currency: true },
                            { label: 'Unrealised gain', value: unrealisedGain, tone: true },
                            { label: 'Total gain (realised + unrealised)', value: totalGain, tone: true, bold: true },
                        ].map(stat => (
                            <div key={stat.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--color-surface-2)' }}>
                                <p style={{ margin: '0 0 4px', fontSize: 10.5, color: 'var(--color-text-subtle)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {stat.label}
                                </p>
                                <strong style={{
                                    fontSize: 15,
                                    color: stat.tone ? (stat.value >= 0 ? '#15803d' : '#b91c1c') : 'var(--color-text)',
                                }}>
                                    {stat.plain
                                        ? stat.value.toLocaleString()
                                        : `${stat.tone && stat.value >= 0 ? '+' : ''}${formatCurrency(stat.value, currency)}`}
                                </strong>
                            </div>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-subtle)', margin: '0 0 8px' }}>
                        Same trades, three methods
                    </p>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 420 }}>
                            <thead>
                                <tr style={{ background: 'var(--color-surface-2)' }}>
                                    {['Method', 'Realised gain', 'Remaining shares', 'Avg cost/share'].map(h => (
                                        <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Method' ? 'left' : 'right', color: 'var(--color-text-muted)', fontSize: 10.5, textTransform: 'uppercase' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(['FIFO', 'LIFO', 'AVERAGE'] as AccountingMethod[]).map(m => {
                                    const r = results[m]
                                    const isActive = m === method
                                    return (
                                        <tr key={m} style={{ borderTop: '1px solid var(--color-border)', background: isActive ? '#faf5ff' : 'transparent' }}>
                                            <td style={{ padding: '10px 12px', fontWeight: isActive ? 800 : 600, color: isActive ? '#7c3aed' : 'var(--color-text)' }}>
                                                {METHOD_LABEL[m]}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', color: r.realisedGain >= 0 ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                                                {r.realisedGain >= 0 ? '+' : ''}{formatCurrency(r.realisedGain, currency)}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{r.remainingShares.toLocaleString()}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatCurrency(r.averageCost, currency)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    )
}