'use client'

import { useEffect, useRef } from 'react'
import {
    createChart,
    CandlestickSeries,
    type IChartApi,
    type ISeriesApi,
    type CandlestickData,
    ColorType,
} from 'lightweight-charts'
import type { TimeSeriesPoint } from '@/types/stock.ts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Props {
    series: TimeSeriesPoint[]
    isLoading: boolean
}

export function StockChart({ series, isLoading }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

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
            timeScale: { borderColor },
            rightPriceScale: { borderColor },
        })

        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderUpColor: '#22c55e',
            borderDownColor: '#ef4444',
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
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

    useEffect(() => {
        if (!seriesRef.current || series.length === 0) return
        const data: CandlestickData[] = series.map((p) => ({
            time: p.time as CandlestickData['time'],
            open: p.open,
            high: p.high,
            low: p.low,
            close: p.close,
        }))
        seriesRef.current.setData(data)
        chartRef.current?.timeScale().fitContent()
    }, [series])

    return (
        <div className="relative rounded-lg border border-border bg-card p-2">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            )}
            <div ref={containerRef} className="w-full" />
        </div>
    )
}