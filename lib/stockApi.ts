import type { StockQuote, TimeSeriesPoint, Timeframe, MarketIndex } from '@/types/stock.ts'

const BASE = 'https://www.alphavantage.co/query'
const KEY = process.env.NEXT_PUBLIC_MASSIVE_API_KEY

if (!KEY) throw new Error('NEXT_PUBLIC_MASSIVE_API_KEY is not set')
  
export async function fetchQuote(symbol: string): Promise<StockQuote> {
  const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Alpha Vantage quote failed: ${res.status}`)
  const json = await res.json()
  const q = json['Global Quote']
  if (!q || !q['05. price']) throw new Error(`No quote data for ${symbol}`)

  return {
    symbol: q['01. symbol'],
    name: symbol,
    price: parseFloat(q['05. price']),
    change: parseFloat(q['09. change']),
    changePercent: parseFloat(q['10. change percent'].replace('%', '')),
    volume: parseInt(q['06. volume'], 10),
    marketCap: 0,      // not in Global Quote; populate from overview if needed
    peRatio: null,
    weekHigh52: parseFloat(q['03. high']),
    weekLow52: parseFloat(q['04. low']),
    open: parseFloat(q['02. open']),
    previousClose: parseFloat(q['08. previous close']),
  }
}

const TIMEFRAME_FUNCTION: Record<Timeframe, string> = {
  '1W': 'TIME_SERIES_DAILY',
  '1M': 'TIME_SERIES_DAILY',
  '3M': 'TIME_SERIES_DAILY',
  '1Y': 'TIME_SERIES_WEEKLY',
  'ALL': 'TIME_SERIES_MONTHLY',
}

const TIMEFRAME_KEY: Record<Timeframe, string> = {
  '1W': 'Time Series (Daily)',
  '1M': 'Time Series (Daily)',
  '3M': 'Time Series (Daily)',
  '1Y': 'Weekly Time Series',
  'ALL': 'Monthly Time Series',
}

function cutoffDate(timeframe: Timeframe): Date {
  const now = new Date()
  const offsets: Record<Timeframe, number> = {
    '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 99999,
  }
  const d = new Date(now)
  d.setDate(d.getDate() - offsets[timeframe])
  return d
}

export async function fetchTimeSeries(
    symbol: string,
    timeframe: Timeframe
): Promise<TimeSeriesPoint[]> {
  const fn = TIMEFRAME_FUNCTION[timeframe]
  const extra = ''
  const url = `${BASE}?function=${fn}&symbol=${symbol}${extra}&apikey=${KEY}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Alpha Vantage timeseries failed: ${res.status}`)
  const json = await res.json()
  const key = TIMEFRAME_KEY[timeframe]
  if (json['Information'] || json['Note']) {
    throw new Error(json['Information'] ?? json['Note'])
  }
  const raw: Record<string, Record<string, string>> = json[key]
  if (!raw) throw new Error(`No time series data for ${symbol}`)

  const cutoff = cutoffDate(timeframe)
  return Object.entries(raw)
      .filter(([date]) => new Date(date) >= cutoff)
      .map(([date, v]) => ({
        time: date,
        open: parseFloat(v['1. open']),
        high: parseFloat(v['2. high']),
        low: parseFloat(v['3. low']),
        close: parseFloat(v['4. close']),
        volume: parseInt(v['5. volume'], 10),
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
}

export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  const symbols = [
    { symbol: '^GSPC', name: 'S&P 500' },
    { symbol: '^IXIC', name: 'NASDAQ' },
    { symbol: '^DJI', name: 'Dow Jones' },
  ]
  const results = await Promise.allSettled(
      symbols.map(async ({ symbol, name }) => {
        const q = await fetchQuote(symbol)
        return {...q, name} as unknown as MarketIndex
      })
  )
  return results
      .filter((r): r is PromiseFulfilledResult<MarketIndex> => r.status === 'fulfilled')
      .map((r) => r.value)
}