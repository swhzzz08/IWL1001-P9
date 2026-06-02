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

        chartRef.current = createChart(containerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'hsl(var(--foreground))',
                fontFamily: 'var(--font-sans)',
            },
            grid: {
                vertLines: { color: 'hsl(var(--border))' },
                horzLines: { color: 'hsl(var(--border))' },
            },
            width: containerRef.current.clientWidth,
            height: 400,
            timeScale: { borderColor: 'hsl(var(--border))' },
            rightPriceScale: { borderColor: 'hsl(var(--border))' },
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