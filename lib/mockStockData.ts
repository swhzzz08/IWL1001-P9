import type { StockQuote, TimeSeriesPoint } from '@/types/stock'

// Note: eps/roe/debtToEquity below are illustrative, rounded figures included purely for
// teaching the definitions of these ratios (this whole file is mock data, not live financials).
export const MOCK_QUOTES: Record<string, StockQuote> = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 213.49, change: 2.31, changePercent: 1.09, volume: 52_341_200, marketCap: 3_270_000_000_000, peRatio: 33.2, eps: 6.43, roe: 149.8, debtToEquity: 1.45, weekHigh52: 237.23, weekLow52: 164.08, open: 211.80, previousClose: 211.18 },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: -1.54, changePercent: -0.37, volume: 18_920_400, marketCap: 3_080_000_000_000, peRatio: 36.1, eps: 11.50, roe: 34.2, debtToEquity: 0.32, weekHigh52: 468.35, weekLow52: 385.58, open: 417.10, previousClose: 416.86 },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 121.44, change: 3.87, changePercent: 3.29, volume: 312_450_000, marketCap: 2_970_000_000_000, peRatio: 54.7, eps: 2.22, roe: 91.5, debtToEquity: 0.38, weekHigh52: 153.13, weekLow52: 86.22, open: 118.20, previousClose: 117.57 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 178.02, change: 0.94, changePercent: 0.53, volume: 21_340_500, marketCap: 2_180_000_000_000, peRatio: 22.4, eps: 7.95, roe: 29.8, debtToEquity: 0.09, weekHigh52: 207.05, weekLow52: 155.65, open: 177.15, previousClose: 177.08 },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 192.45, change: -0.82, changePercent: -0.42, volume: 31_205_600, marketCap: 2_040_000_000_000, peRatio: 43.8, eps: 4.39, roe: 21.6, debtToEquity: 0.52, weekHigh52: 230.00, weekLow52: 162.75, open: 193.20, previousClose: 193.27 },
  META: { symbol: 'META', name: 'Meta Platforms', price: 543.21, change: 5.63, changePercent: 1.05, volume: 14_320_800, marketCap: 1_380_000_000_000, peRatio: 28.9, eps: 18.80, roe: 31.4, debtToEquity: 0.15, weekHigh52: 611.05, weekLow52: 414.50, open: 538.40, previousClose: 537.58 },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -4.12, changePercent: -1.63, volume: 89_432_100, marketCap: 793_000_000_000, peRatio: 68.3, eps: 3.64, roe: 19.3, debtToEquity: 0.18, weekHigh52: 488.54, weekLow52: 138.80, open: 252.30, previousClose: 252.62 },
  SPY:  { symbol: 'SPY',  name: 'S&P 500 ETF',   price: 537.82, change: 3.41, changePercent: 0.64, volume: 67_120_000, marketCap: 0, peRatio: null, eps: null, roe: null, debtToEquity: null, weekHigh52: 613.23, weekLow52: 480.97, open: 534.90, previousClose: 534.41 },
  QQQ:  { symbol: 'QQQ',  name: 'NASDAQ ETF',     price: 468.25, change: 4.10, changePercent: 0.88, volume: 43_210_000, marketCap: 0, peRatio: null, eps: null, roe: null, debtToEquity: null, weekHigh52: 540.81, weekLow52: 400.34, open: 464.70, previousClose: 464.15 },
  DIA:  { symbol: 'DIA',  name: 'Dow Jones ETF',  price: 421.67, change: 1.23, changePercent: 0.29, volume: 3_420_000,  marketCap: 0, peRatio: null, eps: null, roe: null, debtToEquity: null, weekHigh52: 452.38, weekLow52: 374.00, open: 420.80, previousClose: 420.44 },
}

function generateSeries(basePrice: number, days: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  let price = basePrice * 0.85
  const now = new Date('2026-06-09')

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const change = (Math.random() - 0.48) * price * 0.022
    const open = price
    price = Math.max(price + change, 1)
    const high = Math.max(open, price) * (1 + Math.random() * 0.008)
    const low  = Math.min(open, price) * (1 - Math.random() * 0.008)

    points.push({
      time: dateStr,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low:  parseFloat(low.toFixed(2)),
      close: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 80_000_000 + 10_000_000),
    })
  }
  return points
}

const SERIES_CACHE: Record<string, TimeSeriesPoint[]> = {}

function getSeries(symbol: string): TimeSeriesPoint[] {
  if (!SERIES_CACHE[symbol]) {
    const base = MOCK_QUOTES[symbol]?.price ?? 100
    SERIES_CACHE[symbol] = generateSeries(base, 730)
  }
  return SERIES_CACHE[symbol]
}

const TIMEFRAME_DAYS: Record<string, number> = {
  '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 9999,
}

export function getMockTimeSeries(symbol: string, timeframe: string): TimeSeriesPoint[] {
  const all = getSeries(symbol)
  const days = TIMEFRAME_DAYS[timeframe] ?? 30
  return all.slice(-days)
}