import type { TimeSeriesPoint } from '@/types/stock'

export interface SMAPoint {
  time: string
  value: number
}

export interface RSIPoint {
  time: string
  value: number
}

// Simple Moving Average
export function calculateSMA(series: TimeSeriesPoint[], period: number): SMAPoint[] {
  if (series.length < period) return []
  const result: SMAPoint[] = []
  for (let i = period - 1; i < series.length; i++) {
    const slice = series.slice(i - period + 1, i + 1)
    const avg = slice.reduce((sum, p) => sum + p.close, 0) / period
    result.push({ time: series[i].time, value: parseFloat(avg.toFixed(4)) })
  }
  return result
}

// Relative Strength Index
export function calculateRSI(series: TimeSeriesPoint[], period = 14): RSIPoint[] {
  if (series.length < period + 1) return []
  const result: RSIPoint[] = []
  const closes = series.map(p => p.close)

  // Initial average gain/loss
  let avgGain = 0
  let avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff > 0) avgGain += diff
    else avgLoss += Math.abs(diff)
  }
  avgGain /= period
  avgLoss /= period

  const rsi = (ag: number, al: number) => {
    if (al === 0) return 100
    const rs = ag / al
    return parseFloat((100 - 100 / (1 + rs)).toFixed(2))
  }

  result.push({ time: series[period].time, value: rsi(avgGain, avgLoss) })

  // Wilder's smoothing
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? Math.abs(diff) : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    result.push({ time: series[i].time, value: rsi(avgGain, avgLoss) })
  }

  return result
}

// Interpret RSI value for educational display
export function interpretRSI(value: number): { label: string; color: string; bg: string; desc: string } {
  if (value >= 70) return {
    label: 'Overbought',
    color: '#dc2626',
    bg: '#fef2f2',
    desc: 'RSI above 70 suggests the stock may be overbought — it has risen quickly and could pull back.',
  }
  if (value <= 30) return {
    label: 'Oversold',
    color: '#16a34a',
    bg: '#f0fdf4',
    desc: 'RSI below 30 suggests the stock may be oversold — it has fallen quickly and could bounce back.',
  }
  if (value >= 60) return {
    label: 'Bullish',
    color: '#2563eb',
    bg: '#eff6ff',
    desc: 'RSI between 60–70 indicates bullish momentum. The stock is trending upward but not yet overbought.',
  }
  if (value <= 40) return {
    label: 'Bearish',
    color: '#d97706',
    bg: '#fffbeb',
    desc: 'RSI between 30–40 indicates bearish momentum. The stock is trending downward but not yet oversold.',
  }
  return {
    label: 'Neutral',
    color: '#64748b',
    bg: '#f8fafc',
    desc: 'RSI between 40–60 is considered neutral — no strong momentum in either direction.',
  }
}