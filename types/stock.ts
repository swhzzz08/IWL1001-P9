export interface StockQuote {
    symbol: string
    name: string
    price: number
    change: number        // absolute change
    changePercent: number // e.g. 1.23 means +1.23%
    volume: number
    marketCap: number
    peRatio: number | null
    weekHigh52: number
    weekLow52: number
    open: number
    previousClose: number
}

export interface TimeSeriesPoint {
    time: string   // 'YYYY-MM-DD' for daily; ISO string for intraday
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export type Timeframe = '1W' | '1M' | '3M' | '1Y' | 'ALL'

export interface MarketIndex {
    symbol: string
    name: string
    value: number
    change: number
    changePercent: number
}