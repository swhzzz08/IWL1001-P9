'use client'

import { useEffect, useMemo, useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { calculateFIFO, calculateLIFO, calculateAverageCost, simulateScenario, type Trade } from '@/lib/accounting'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock'
import type { AccountingMethod } from '@/components/portfolio/AccountingMethodPanel'

type QuoteMap = Record<string, StockQuote | undefined>

const PRESETS = [
    { label: '-25%', multiplier: 0.75 },
    { label: '-10%', multiplier: 0.90 },
    { label: 'Today', multiplier: 1 },
    { label: '+10%', multiplier: 1.10 },
    { label: '+25%', multiplier: 1.25 },
    { label: '+50%', multiplier: 1.50 },
]

function calculate(method: AccountingMethod, trades: Trade[]) {
    if (method === 'FIFO') return calculateFIFO(trades)
    if (method === 'LIFO') return calculateLIFO(trades)
    return calculateAverageCost(trades)
}

interface Props {
    trades: Trade[]
    quotes: QuoteMap
    currency: string
    selectedSymbol: string
    method: AccountingMethod
}

export function ScenarioExplorer({ trades, quotes, currency, selectedSymbol, method }: Props) {
    const symbolTrades = useMemo(
        () => trades.filter(t => t.tickerSymbol === selectedSymbol),
        [trades, selectedSymbol]
    )
    const result = useMemo(() => calculate(method, symbolTrades), [method, symbolTrades])
    const currentPrice = quotes[selectedSymbol]?.price ?? result.averageCost

    const [hypotheticalPrice, setHypotheticalPrice] = useState(currentPrice)

    // Reset the hypothetical price whenever the selected symbol (and thus current price) changes
    useEffect(() => {
        setHypotheticalPrice(currentPrice)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSymbol, currentPrice])

    const todayValue = currentPrice * result.remainingShares
    const scenario = simulateScenario(result, hypotheticalPrice)
    const gainPct = result.remainingCost > 0 ? (scenario.unrealisedGain / result.remainingCost) * 100 : 0
    const valueDelta = scenario.portfolioValue - todayValue

    const sliderMax = Math.max(currentPrice * 3, currentPrice + 10, 10)

    return (
        <section style={{
            background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
            borderRadius: 16, overflow: 'hidden', marginBottom: 24,
        }}>
            <div style={{ padding: '17px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FlaskConical size={16} color="#2563eb" />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: 17 }}>Scenario explorer — {selectedSymbol}</h2>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
                        See how a hypothetical future price would affect this position, without placing a real trade.
                    </p>
                </div>
            </div>

            {result.remainingShares <= 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    You don&apos;t currently hold any {selectedSymbol} shares under the {method === 'AVERAGE' ? 'Average Cost' : method} method. Pick a symbol you still hold above to explore a scenario.
                </div>
            ) : (
                <div style={{ padding: '20px' }}>
                    {/* Presets */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        {PRESETS.map(preset => {
                            const presetPrice = Math.round(currentPrice * preset.multiplier * 100) / 100
                            const isActive = Math.abs(hypotheticalPrice - presetPrice) < 0.005
                            return (
                                <button
                                    key={preset.label}
                                    onClick={() => setHypotheticalPrice(presetPrice)}
                                    style={{
                                        padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                        border: `1.5px solid ${isActive ? '#2563eb' : 'var(--color-border)'}`,
                                        background: isActive ? '#eff6ff' : 'var(--color-surface)',
                                        color: isActive ? '#2563eb' : 'var(--color-text-muted)',
                                    }}
                                >
                                    {preset.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Slider + input */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label htmlFor="hypothetical-price" style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                                Hypothetical future price
                            </label>
                            <input
                                id="hypothetical-price"
                                type="number"
                                step="0.01"
                                min={0}
                                value={hypotheticalPrice}
                                onChange={e => setHypotheticalPrice(Math.max(0, Number(e.target.value) || 0))}
                                style={{
                                    width: 110, padding: '6px 10px', borderRadius: 8, border: '1.5px solid var(--color-border)',
                                    fontSize: 13, fontWeight: 700, textAlign: 'right',
                                }}
                            />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={sliderMax}
                            step={0.5}
                            value={hypotheticalPrice}
                            onChange={e => setHypotheticalPrice(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#2563eb' }}
                        />
                    </div>

                    {/* Today vs Scenario comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--color-surface-2)' }}>
                            <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)' }}>
                                Today (at {formatCurrency(currentPrice, currency)})
                            </p>
                            <strong style={{ fontSize: 18, display: 'block' }}>{formatCurrency(todayValue, currency)}</strong>
                            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{result.remainingShares.toLocaleString()} shares held</span>
                        </div>
                        <div style={{ padding: '14px 16px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                            <p style={{ margin: '0 0 6px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb' }}>
                                Scenario (at {formatCurrency(hypotheticalPrice, currency)})
                            </p>
                            <strong style={{ fontSize: 18, display: 'block', color: '#1e3a8a' }}>{formatCurrency(scenario.portfolioValue, currency)}</strong>
                            <span style={{ fontSize: 11, color: '#2563eb' }}>
                                {valueDelta >= 0 ? '+' : ''}{formatCurrency(valueDelta, currency)} vs today
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ padding: '12px 16px', borderRadius: 12, background: scenario.unrealisedGain >= 0 ? '#f0fdf4' : '#fef2f2', flex: 1, minWidth: 180 }}>
                            <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: scenario.unrealisedGain >= 0 ? '#15803d' : '#b91c1c' }}>
                                Projected unrealised gain
                            </p>
                            <strong style={{ fontSize: 16, color: scenario.unrealisedGain >= 0 ? '#15803d' : '#b91c1c' }}>
                                {scenario.unrealisedGain >= 0 ? '+' : ''}{formatCurrency(scenario.unrealisedGain, currency)} ({formatPercent(gainPct)})
                            </strong>
                        </div>
                    </div>

                    <p style={{ marginTop: 16, fontSize: 11.5, color: 'var(--color-text-subtle)', lineHeight: 1.6 }}>
                        This is a &ldquo;what-if&rdquo; projection based on your {method === 'AVERAGE' ? 'Average Cost' : method} cost basis of {result.remainingShares.toLocaleString()} remaining shares — no real or simulated trade is placed here.
                    </p>
                </div>
            )}
        </section>
    )
}