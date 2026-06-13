'use client'

import { useEffect, useRef, useState } from 'react'
import {
    createChart,
    CandlestickSeries,
    LineSeries,
    type IChartApi,
    type ISeriesApi,
    type CandlestickData,
    type LineData,
    ColorType,
} from 'lightweight-charts'
import type { TimeSeriesPoint } from '@/types/stock.ts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { calculateSMA } from '@/lib/indicators'

interface Props {
    series: TimeSeriesPoint[]
    isLoading: boolean
}

const SMA_OPTIONS = [
    { period: 20, color: '#f59e0b', label: 'SMA 20' },
    { period: 50, color: '#8b5cf6', label: 'SMA 50' },
]

export function StockChart({ series, isLoading }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
    const smaRefs = useRef<(ISeriesApi<'Line'> | null)[]>([null, null])
    const [activeSMAs, setActiveSMAs] = useState<boolean[]>([true, false])

    useEffect(() => {
        if (!containerRef.current) return

        // ── Preserve groupmates' color resolution logic for dark mode support ──
        const resolveColor = (cssValue: string, fallback: string): string => {
            const el = document.createElement('div')
            el.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
            containerRef.current!.appendChild(el)
            el.style.color = cssValue
            const computed = getComputedStyle(el).color
            containerRef.current!.removeChild(el)
            const canvas = document.createElement('canvas')
            canvas.width = canvas.height = 1
            const ctx = canvas.getContext('2d')
            if (!ctx) return fallback
            ctx.fillStyle = computed
            ctx.fillRect(0, 0, 1, 1)
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }

        const textColor = resolveColor('hsl(var(--foreground))', '#0f172a')
        const borderColor = resolveColor('hsl(var(--border))', '#e2e8f0')

        chartRef.current = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor,
                fontFamily: getComputedStyle(containerRef.current).fontFamily || 'sans-serif',
            },
            grid: {
                vertLines: { color: borderColor },
                horzLines: { color: borderColor },
            },
            width: containerRef.current.clientWidth,
            height: 400,
            timeScale: { borderColor, timeVisible: true },
            rightPriceScale: { borderColor },
            crosshair: {
                vertLine: { color: '#2563eb', labelBackgroundColor: '#2563eb' },
                horzLine: { color: '#2563eb', labelBackgroundColor: '#2563eb' },
            },
        })

        // Candlestick series
        candleRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        })

        // SMA series
        SMA_OPTIONS.forEach((opt, i) => {
            smaRefs.current[i] = chartRef.current!.addSeries(LineSeries, {
                color: opt.color,
                lineWidth: 2,
                priceLineVisible: false,
                lastValueVisible: true,
                crosshairMarkerVisible: false,
                visible: activeSMAs[i],
            })
        })

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0] && chartRef.current) {
                chartRef.current.applyOptions({ width: entries[0].contentRect.width })
            }
        })
        resizeObserver.observe(containerRef.current)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.remove()
        }
    }, [])

    // Update candlestick + SMA data when series changes
    useEffect(() => {
        if (!candleRef.current || series.length === 0) return

        const candles: CandlestickData[] = series.map((p) => ({
            time: p.time as CandlestickData['time'],
            open: p.open, high: p.high, low: p.low, close: p.close,
        }))
        candleRef.current.setData(candles)

        SMA_OPTIONS.forEach((opt, i) => {
            if (!smaRefs.current[i]) return
            const smaData = calculateSMA(series, opt.period)
            const lineData: LineData[] = smaData.map(p => ({
                time: p.time as LineData['time'],
                value: p.value,
            }))
            smaRefs.current[i]!.setData(lineData)
        })

        chartRef.current?.timeScale().fitContent()
    }, [series])

    // Toggle SMA visibility
    useEffect(() => {
        SMA_OPTIONS.forEach((_, i) => {
            smaRefs.current[i]?.applyOptions({ visible: activeSMAs[i] })
        })
    }, [activeSMAs])

    function toggleSMA(i: number) {
        setActiveSMAs(prev => {
            const next = [...prev]
            next[i] = !next[i]
            return next
        })
    }

    return (
        <div className="relative rounded-lg border border-border bg-card p-2">
            {/* SMA toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '4px 4px 0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Overlays:
                </span>
                {SMA_OPTIONS.map((opt, i) => (
                    <button key={opt.label} onClick={() => toggleSMA(i)} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', border: `2px solid ${opt.color}`,
                        background: activeSMAs[i] ? opt.color : 'transparent',
                        color: activeSMAs[i] ? 'white' : opt.color,
                        transition: 'all 0.15s',
                    }}>
                        <span style={{ width: 16, height: 2, background: activeSMAs[i] ? 'white' : opt.color, borderRadius: 1, display: 'inline-block' }} />
                        {opt.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            )}
            <div ref={containerRef} className="w-full" />
        </div>
    )
}