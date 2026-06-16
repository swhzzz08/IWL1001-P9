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

// ─── ARIMA (simplified ARIMA(1,1,1)) ───────────────────────────────────────
export interface ARIMAResult {
  predictions: { date: string; value: number }[]
  upperBand:   { date: string; value: number }[]
  lowerBand:   { date: string; value: number }[]
  confidence:  number   // 0–100
  recommendation: 'Buy' | 'Hold' | 'Sell'
  targetPrice: number
  lastActualPrice: number
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  // Skip weekends
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export function calculateARIMA(
  series: TimeSeriesPoint[],
  forecastDays = 30
): ARIMAResult | null {
  if (series.length < 30) return null

  const closes = series.map(p => p.close)
  const n = closes.length

  // Step 1: First differences (I=1)
  const diff: number[] = []
  for (let i = 1; i < n; i++) diff.push(closes[i] - closes[i - 1])

  // Step 2: Estimate AR(1) coefficient via OLS
  let sumXY = 0, sumXX = 0
  for (let i = 1; i < diff.length; i++) {
    sumXY += diff[i - 1] * diff[i]
    sumXX += diff[i - 1] * diff[i - 1]
  }
  const phi = sumXX !== 0 ? Math.max(-0.95, Math.min(0.95, sumXY / sumXX)) : 0

  // Step 3: Estimate MA(1) coefficient from residuals
  const residuals: number[] = [diff[0]]
  for (let i = 1; i < diff.length; i++) {
    residuals.push(diff[i] - phi * diff[i - 1])
  }
  let sumRR = 0, sumR2 = 0
  for (let i = 1; i < residuals.length; i++) {
    sumRR += residuals[i - 1] * residuals[i]
    sumR2 += residuals[i - 1] * residuals[i - 1]
  }
  const theta = sumR2 !== 0 ? Math.max(-0.95, Math.min(0.95, sumRR / sumR2)) : 0

  // Step 4: Forecast differences
  const forecastDiffs: number[] = []
  let lastDiff = diff[diff.length - 1]
  let lastResidual = residuals[residuals.length - 1]

  for (let h = 0; h < forecastDays; h++) {
    const nextDiff = phi * lastDiff + theta * lastResidual
    forecastDiffs.push(nextDiff)
    lastResidual = 0 // future residuals are 0 in expectation
    lastDiff = nextDiff
  }

  // Step 5: Reconstruct price level
  let price = closes[n - 1]
  const predictions: { date: string; value: number }[] = []
  let date = series[n - 1].time

  for (let h = 0; h < forecastDays; h++) {
    price += forecastDiffs[h]
    price = Math.max(price, closes[n - 1] * 0.5) // floor at 50% of current
    date = addDays(date, 1)
    predictions.push({ date, value: parseFloat(price.toFixed(2)) })
  }

  // Step 6: Confidence bands (based on residual std dev)
  const residualMean = residuals.reduce((a, b) => a + b, 0) / residuals.length
  const residualStd = Math.sqrt(
    residuals.reduce((s, r) => s + (r - residualMean) ** 2, 0) / residuals.length
  )

  const upperBand = predictions.map((p, i) => ({
    date: p.date,
    value: parseFloat((p.value + residualStd * Math.sqrt(i + 1) * 1.96).toFixed(2)),
  }))
  const lowerBand = predictions.map((p, i) => ({
    date: p.date,
    value: parseFloat(Math.max(0, p.value - residualStd * Math.sqrt(i + 1) * 1.96).toFixed(2)),
  }))

  // Step 7: Confidence score (inverse of relative std dev, capped)
  const relativeStd = residualStd / closes[n - 1]
  const confidence = Math.round(Math.max(10, Math.min(90, (1 - relativeStd * 10) * 100)))

  // Step 8: Recommendation
  const targetPrice = predictions[predictions.length - 1].value
  const currentPrice = closes[n - 1]
  const pctChange = ((targetPrice - currentPrice) / currentPrice) * 100

  const recommendation: 'Buy' | 'Hold' | 'Sell' =
    pctChange > 3 ? 'Buy' : pctChange < -3 ? 'Sell' : 'Hold'

  return {
    predictions,
    upperBand,
    lowerBand,
    confidence,
    recommendation,
    targetPrice,
    lastActualPrice: currentPrice,
  }
}