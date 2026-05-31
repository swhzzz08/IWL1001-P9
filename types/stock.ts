export interface StockQuote {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap: number
    peRatio: number | null
    weekHigh52: number
    weekLow52: number
    open: number
    previousClose: number
}

export interface TimeSeriesPoint {
    time: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface MarketIndex {
    symbol: string
    name: string
    value: number
    change: number
    changePercent: number
}

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL'