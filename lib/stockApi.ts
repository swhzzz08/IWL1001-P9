import type { StockQuote, TimeSeriesPoint, Timeframe, MarketIndex } from '@/types/stock.ts'
import { MOCK_QUOTES, getMockTimeSeries } from '@/lib/mockStockData'

// -- Real Alpha Vantage API (commented out while using mock data) --
// const BASE = 'https://www.alphavantage.co/query'
// const KEY = process.env.NEXT_PUBLIC_MASSIVE_API_KEY
// if (!KEY) throw new Error('NEXT_PUBLIC_MASSIVE_API_KEY is not set')

// Applies a small random jitter (up to ~0.3%) to the base mock price on every fetch, so quotes
// tick slightly like a real live market instead of being perfectly static. change/changePercent
// are recomputed to stay consistent with the jittered price. Everything else (P/E, EPS, ROE,
// volume, market cap, 52-week range, etc.) stays as the stable illustrative baseline.
function withJitter(mock: StockQuote): StockQuote {
  const jitterPct = (Math.random() - 0.5) * 0.006 // roughly ±0.3%
  const price = Math.round(mock.price * (1 + jitterPct) * 100) / 100
  const change = Math.round((price - mock.previousClose) * 100) / 100
  const changePercent = mock.previousClose !== 0
    ? Math.round((change / mock.previousClose) * 10000) / 100
    : 0
  return { ...mock, price, change, changePercent }
}

export async function fetchQuote(symbol: string): Promise<StockQuote> {
  // -- Real implementation --
  // const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`
  // const res = await fetch(url, { next: { revalidate: 60 } })
  // if (!res.ok) throw new Error(`Alpha Vantage quote failed: ${res.status}`)
  // const json = await res.json()
  // const q = json['Global Quote']
  // if (!q || !q['05. price']) throw new Error(`No quote data for ${symbol}`)
  // return {
  //   symbol: q['01. symbol'], name: symbol,
  //   price: parseFloat(q['05. price']), change: parseFloat(q['09. change']),
  //   changePercent: parseFloat(q['10. change percent'].replace('%', '')),
  //   volume: parseInt(q['06. volume'], 10), marketCap: 0, peRatio: null,
  //   eps: null, roe: null, debtToEquity: null, // these come from Alpha Vantage's OVERVIEW endpoint, not GLOBAL_QUOTE
  //   weekHigh52: parseFloat(q['03. high']), weekLow52: parseFloat(q['04. low']),
  //   open: parseFloat(q['02. open']), previousClose: parseFloat(q['08. previous close']),
  // }

  const mock = MOCK_QUOTES[symbol]
  if (!mock) throw new Error(`No mock data for symbol: ${symbol}`)
  return withJitter(mock)
}

export async function fetchTimeSeries(
    symbol: string,
    timeframe: Timeframe
): Promise<TimeSeriesPoint[]> {
  // -- Real implementation --
  // const TIMEFRAME_FUNCTION: Record<Timeframe, string> = {
  //   '1W': 'TIME_SERIES_DAILY', '1M': 'TIME_SERIES_DAILY', '3M': 'TIME_SERIES_DAILY',
  //   '1Y': 'TIME_SERIES_WEEKLY', 'ALL': 'TIME_SERIES_MONTHLY',
  // }
  // const TIMEFRAME_KEY: Record<Timeframe, string> = {
  //   '1W': 'Time Series (Daily)', '1M': 'Time Series (Daily)', '3M': 'Time Series (Daily)',
  //   '1Y': 'Weekly Time Series', 'ALL': 'Monthly Time Series',
  // }
  // const fn = TIMEFRAME_FUNCTION[timeframe]
  // const url = `${BASE}?function=${fn}&symbol=${symbol}&apikey=${KEY}`
  // const res = await fetch(url, { next: { revalidate: 300 } })
  // if (!res.ok) throw new Error(`Alpha Vantage timeseries failed: ${res.status}`)
  // const json = await res.json()
  // if (json['Information'] || json['Note']) throw new Error(json['Information'] ?? json['Note'])
  // const raw: Record<string, Record<string, string>> = json[TIMEFRAME_KEY[timeframe]]
  // if (!raw) throw new Error(`No time series data for ${symbol}`)
  // const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - ({ '1W':7,'1M':30,'3M':90,'1Y':365,'ALL':99999 }[timeframe]))
  // return Object.entries(raw)
  //   .filter(([date]) => new Date(date) >= cutoff)
  //   .map(([date, v]) => ({ time: date, open: parseFloat(v['1. open']), high: parseFloat(v['2. high']),
  //     low: parseFloat(v['3. low']), close: parseFloat(v['4. close']), volume: parseInt(v['5. volume'], 10) }))
  //   .sort((a, b) => a.time.localeCompare(b.time))

  return getMockTimeSeries(symbol, timeframe)
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