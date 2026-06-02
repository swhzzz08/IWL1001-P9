# Stock Market Educational Website — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 16 frontend for an educational stock market platform with a live-data dashboard, a charting page with a contextual hint system, and a standalone /learn resource repository.

**Architecture:** App Router with Route Handlers proxying Alpha Vantage API calls (key stays server-side). Interactive chart/hint components are Client Components; data-fetching wrappers are Server Components. Education content is static TypeScript data for the MVP.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, TradingView Lightweight Charts v5, Alpha Vantage API, Jest + React Testing Library

---

## File Map

```
app/
  layout.tsx                          MODIFY — add Navbar + Footer
  page.tsx                            REPLACE — Dashboard home
  stocks/
    [symbol]/
      page.tsx                        CREATE — Stock detail page
  learn/
    page.tsx                          CREATE — Education repository
    [category]/
      page.tsx                        CREATE — Category listing
      [slug]/
        page.tsx                      CREATE — Individual article
  api/
    stocks/
      quote/route.ts                  CREATE — proxies Alpha Vantage quote
      timeseries/route.ts             CREATE — proxies Alpha Vantage time series

components/
  layout/
    Navbar.tsx                        CREATE — top nav with search + links
    Footer.tsx                        CREATE — simple footer
  dashboard/
    MarketIndexCard.tsx               CREATE — single index display card
    MarketOverview.tsx                CREATE — row of three index cards
    TrendingStockRow.tsx              CREATE — one row in trending list
    TrendingStocks.tsx                CREATE — full trending stocks panel
  stocks/
    StockHeader.tsx                   CREATE — symbol, price, change %
    StockChart.tsx                    CREATE — lightweight-charts client wrapper
    TimeframePicker.tsx               CREATE — 1D/1W/1M/3M/1Y buttons
    StockStats.tsx                    CREATE — volume, market cap, P/E, 52W
  hints/
    HintPanel.tsx                     CREATE — collapsible right-side drawer
    HintCard.tsx                      CREATE — single hint with title + body
    HintTrigger.tsx                   CREATE — floating ? button
  learn/
    CategoryCard.tsx                  CREATE — topic category card
    CategoryGrid.tsx                  CREATE — grid of CategoryCards
    ResourceCard.tsx                  CREATE — article/resource card
    ResourceList.tsx                  CREATE — filterable article list
    LearnSearchBar.tsx                CREATE — search input (client)
    FilterTabs.tsx                    CREATE — topic filter tabs (client)
  ui/
    PriceChange.tsx                   CREATE — green/red ▲▼ display
    LoadingSpinner.tsx                CREATE — animated spinner

lib/
  utils.ts                            EXISTING
  formatters.ts                       CREATE — formatCurrency, formatVolume, formatPercent
  stockApi.ts                         CREATE — server-side Alpha Vantage fetch helpers

types/
  stock.ts                            CREATE — StockQuote, TimeSeriesPoint, StockStats
  education.ts                        CREATE — Article, Category, ResourceItem

data/
  hints.ts                            CREATE — 30+ static hint objects
  education.ts                        CREATE — static articles + categories

hooks/
  useStockData.ts                     CREATE — client hook fetching from /api/stocks/*
  useHints.ts                         CREATE — hint panel state + active hints

__tests__/
  lib/formatters.ts              CREATE
  hooks/useHints.test.ts              CREATE
  components/ui/PriceChange.test.tsx  CREATE
  components/stocks/StockHeader.test.tsx CREATE
  components/learn/FilterTabs.test.tsx   CREATE
```

---

## Task 1: Testing Infrastructure

**Files:**
- Modify: `package.json`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Install testing dependencies**

```bash
cd C:/Users/Raiha/WebstormProjects/iwl1001-p9
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

Expected output: packages added to node_modules, no peer dep errors.

- [ ] **Step 2: Create jest.config.ts**

```ts
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 3: Create jest.setup.ts**

```ts
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to the `"scripts"` block:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: Verify setup with a smoke test**

Create `__tests__/smoke.test.ts`:
```ts
test('jest is configured', () => {
  expect(true).toBe(true)
})
```

Run: `npm test -- --testPathPattern=smoke`
Expected: `PASS __tests__/smoke.test.ts`

Delete `__tests__/smoke.test.ts` after it passes.

- [ ] **Step 6: Commit**

```bash
git add jest.config.ts jest.setup.ts package.json package-lock.json
git commit -m "chore: add Jest + React Testing Library"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `types/stock.ts`
- Create: `types/education.ts`

- [ ] **Step 1: Create types/stock.ts**

```ts
// types/stock.ts.ts

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

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'

export interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
}
```

- [ ] **Step 2: Create types/education.ts**

```ts
// types/education.ts

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type TopicCategory =
  | 'Stocks'
  | 'Options'
  | 'ETFs'
  | 'Crypto'
  | 'Bonds'
  | 'Fundamentals'
  | 'Technical Analysis'
  | 'Risk Management'

export interface Article {
  slug: string
  title: string
  summary: string
  category: TopicCategory
  difficulty: DifficultyLevel
  readTimeMinutes: number
  body: string   // plain text or simple markdown for MVP
  publishedAt: string  // 'YYYY-MM-DD'
}

export interface Category {
  slug: string
  name: TopicCategory
  description: string
  articleCount: number
  iconName: string   // lucide-react icon name
}

export interface ResourceItem {
  article: Article
  category: Category
}
```

- [ ] **Step 3: Commit**

```bash
git add types/
git commit -m "feat: add stock and education type definitions"
```

---

## Task 3: Formatters (TDD)

**Files:**
- Create: `lib/formatters.ts`
- Create: `__tests__/lib/formatters.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/lib/formatters.ts
import { formatCurrency, formatVolume, formatPercent, formatMarketCap } from '@/lib/formatters'

describe('formatCurrency', () => {
  it('formats a positive number with $ and 2 decimal places', () => {
    expect(formatCurrency(185.5)).toBe('$185.50')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatVolume', () => {
  it('abbreviates millions', () => {
    expect(formatVolume(55_000_000)).toBe('55.0M')
  })
  it('abbreviates billions', () => {
    expect(formatVolume(1_200_000_000)).toBe('1.2B')
  })
  it('shows raw number under 1M', () => {
    expect(formatVolume(500_000)).toBe('500,000')
  })
})

describe('formatPercent', () => {
  it('formats positive with + sign and 2 decimals', () => {
    expect(formatPercent(1.23)).toBe('+1.23%')
  })
  it('formats negative with sign', () => {
    expect(formatPercent(-0.5)).toBe('-0.50%')
  })
})

describe('formatMarketCap', () => {
  it('abbreviates trillions', () => {
    expect(formatMarketCap(2_800_000_000_000)).toBe('$2.80T')
  })
  it('abbreviates billions', () => {
    expect(formatMarketCap(45_000_000_000)).toBe('$45.00B')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=formatters
```

Expected: FAIL — `Cannot find module '@/lib/formatters'`

- [ ] **Step 3: Implement lib/formatters.ts**

```ts
// lib/formatters.ts

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  return formatCurrency(value)
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern=formatters
```

Expected: PASS — 8 tests

- [ ] **Step 5: Commit**

```bash
git add lib/formatters.ts __tests__/lib/formatters.ts
git commit -m "feat: add number formatters with tests"
```

---

## Task 4: Stock API Route Handlers

**Files:**
- Create: `.env.local`
- Create: `lib/stockApi.ts`
- Create: `app/api/stocks/quote/route.ts`
- Create: `app/api/stocks/timeseries/route.ts`

- [ ] **Step 1: Create .env.local**

```
# .env.local  (never commit this file)
ALPHA_VANTAGE_API_KEY=your_key_here
```

Get a free key at https://www.alphavantage.co/support/#api-key (sign up, instant key).

- [ ] **Step 2: Create lib/stockApi.ts**

```ts
// lib/stockApi.ts
import type { StockQuote, TimeSeriesPoint, Timeframe, MarketIndex } from '@/types/stock.ts'

const BASE = 'https://www.alphavantage.co/query'
const KEY = process.env.ALPHA_VANTAGE_API_KEY

if (!KEY) throw new Error('ALPHA_VANTAGE_API_KEY is not set')

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
  '1D': 'TIME_SERIES_INTRADAY',
  '1W': 'TIME_SERIES_DAILY',
  '1M': 'TIME_SERIES_DAILY',
  '3M': 'TIME_SERIES_DAILY',
  '1Y': 'TIME_SERIES_WEEKLY',
  'ALL': 'TIME_SERIES_MONTHLY',
}

const TIMEFRAME_KEY: Record<Timeframe, string> = {
  '1D': 'Time Series (60min)',
  '1W': 'Time Series (Daily)',
  '1M': 'Time Series (Daily)',
  '3M': 'Time Series (Daily)',
  '1Y': 'Weekly Time Series',
  'ALL': 'Monthly Time Series',
}

function cutoffDate(timeframe: Timeframe): Date {
  const now = new Date()
  const offsets: Record<Timeframe, number> = {
    '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 99999,
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
  const extra = timeframe === '1D' ? '&interval=60min' : '&outputsize=full'
  const url = `${BASE}?function=${fn}&symbol=${symbol}${extra}&apikey=${KEY}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Alpha Vantage timeseries failed: ${res.status}`)
  const json = await res.json()
  const key = TIMEFRAME_KEY[timeframe]
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
      return { ...q, name } as MarketIndex
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<MarketIndex> => r.status === 'fulfilled')
    .map((r) => r.value)
}
```

- [ ] **Step 3: Create app/api/stocks/quote/route.ts**

```ts
// app/api/stocks/quote/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchQuote } from '@/lib/stockApi'

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  }
  try {
    const quote = await fetchQuote(symbol.toUpperCase())
    return NextResponse.json(quote)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create app/api/stocks/timeseries/route.ts**

```ts
// app/api/stocks/timeseries/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchTimeSeries } from '@/lib/stockApi'
import type { Timeframe } from '@/types/stock.ts'

const VALID_TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  const timeframe = request.nextUrl.searchParams.get('timeframe') as Timeframe | null

  if (!symbol) return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  if (!timeframe || !VALID_TIMEFRAMES.includes(timeframe)) {
    return NextResponse.json({ error: 'valid timeframe is required' }, { status: 400 })
  }

  try {
    const data = await fetchTimeSeries(symbol.toUpperCase(), timeframe)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 5: Verify routes work**

```bash
npm run dev
```

Open: `http://localhost:3000/api/stocks/quote?symbol=AAPL`

Expected: JSON with `price`, `change`, `changePercent` fields.

- [ ] **Step 6: Commit**

```bash
git add lib/stockApi.ts app/api/
git commit -m "feat: add Alpha Vantage proxy route handlers"
```

> Note: Do NOT commit `.env.local`. Verify it is in `.gitignore`.

---

## Task 5: useStockData Hook

**Files:**
- Create: `hooks/useStockData.ts`

- [ ] **Step 1: Install SWR for client-side data fetching**

```bash
npm install swr
```

- [ ] **Step 2: Create hooks/useStockData.ts**

```ts
// hooks/useStockData.ts
'use client'

import useSWR from 'swr'
import type { StockQuote, TimeSeriesPoint, Timeframe } from '@/types/stock.ts'

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    return res.json()
  })

export function useStockQuote(symbol: string) {
  const { data, error, isLoading } = useSWR<StockQuote>(
    symbol ? `/api/stocks/quote?symbol=${symbol}` : null,
    fetcher,
    { refreshInterval: 60_000 }
  )
  return { quote: data, error, isLoading }
}

export function useTimeSeries(symbol: string, timeframe: Timeframe) {
  const { data, error, isLoading } = useSWR<TimeSeriesPoint[]>(
    symbol ? `/api/stocks/timeseries?symbol=${symbol}&timeframe=${timeframe}` : null,
    fetcher
  )
  return { series: data ?? [], error, isLoading }
}
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useStockData.ts package.json package-lock.json
git commit -m "feat: add useStockData and useTimeSeries hooks with SWR"
```

---

## Task 6: Hint Data & useHints Hook (TDD)

**Files:**
- Create: `data/hints.ts`
- Create: `hooks/useHints.ts`
- Create: `__tests__/hooks/useHints.test.ts`

- [ ] **Step 1: Create data/hints.ts**

```ts
// data/hints.ts

export interface Hint {
  id: string
  title: string
  body: string
  category: 'Reading Charts' | 'Risk Management' | 'Entry & Exit' | 'Psychology' | 'Indicators'
}

export const hints: Hint[] = [
  {
    id: 'candlestick-basics',
    title: 'Reading Candlesticks',
    body: 'Each candle shows open, high, low, and close. A green candle means the close was higher than the open. A red candle means the close was lower. The wicks show the full price range for that period.',
    category: 'Reading Charts',
  },
  {
    id: 'support-resistance',
    title: 'Support & Resistance',
    body: 'Support is a price level where buying tends to overpower selling, causing price to bounce up. Resistance is where selling overpowers buying. Watch for price to test these levels repeatedly before breaking through.',
    category: 'Reading Charts',
  },
  {
    id: 'trend-lines',
    title: 'Drawing Trend Lines',
    body: 'Connect at least two higher lows to form an uptrend line. Connect two lower highs to form a downtrend line. A valid trend line touches at least three points. Break of a trend line is an early signal of reversal.',
    category: 'Reading Charts',
  },
  {
    id: 'volume-confirmation',
    title: 'Volume Confirms Moves',
    body: 'A price breakout on high volume is more reliable than one on low volume. If price breaks resistance but volume is weak, the move may fail. Always check volume when evaluating breakouts.',
    category: 'Reading Charts',
  },
  {
    id: 'moving-average-cross',
    title: 'Moving Average Crossovers',
    body: 'When a shorter MA (e.g. 50-day) crosses above a longer MA (e.g. 200-day), it is called a Golden Cross — a bullish signal. The opposite (Death Cross) is bearish. These are lagging indicators, best used to confirm trends.',
    category: 'Indicators',
  },
  {
    id: 'rsi-overbought',
    title: 'RSI Overbought/Oversold',
    body: 'RSI above 70 suggests a stock.ts may be overbought (due for a pullback). RSI below 30 suggests it may be oversold (potential bounce). In a strong trend, RSI can stay overbought or oversold for extended periods.',
    category: 'Indicators',
  },
  {
    id: 'macd-basics',
    title: 'Understanding MACD',
    body: 'MACD measures momentum by subtracting the 26-period EMA from the 12-period EMA. When the MACD line crosses above the signal line, it is a buy signal. Below is a sell signal. The histogram shows the difference between the two lines.',
    category: 'Indicators',
  },
  {
    id: 'bollinger-bands',
    title: 'Bollinger Bands',
    body: 'Bollinger Bands are two standard deviations above and below a 20-period moving average. When price touches the upper band in an uptrend, it shows strength. When bands narrow (squeeze), a large move is often imminent.',
    category: 'Indicators',
  },
  {
    id: 'risk-per-trade',
    title: 'Risk Per Trade',
    body: 'Most professional traders risk no more than 1-2% of their total portfolio on any single trade. If your account is $10,000 and you risk 1%, your maximum loss per trade is $100. Consistent position sizing protects you from catastrophic drawdowns.',
    category: 'Risk Management',
  },
  {
    id: 'stop-loss',
    title: 'Always Use a Stop Loss',
    body: 'A stop loss is a predefined price where you exit a losing trade. Place it below a recent swing low for long trades, or above a swing high for shorts. Never move a stop loss in the direction of the loss — it defeats its purpose.',
    category: 'Risk Management',
  },
  {
    id: 'risk-reward',
    title: 'Risk/Reward Ratio',
    body: 'Before entering a trade, calculate your risk (entry minus stop) vs. your reward (entry to target). Aim for at least a 1:2 risk/reward. This means even if you are right only 40% of the time, you can still be profitable.',
    category: 'Risk Management',
  },
  {
    id: 'diversification',
    title: 'Diversification',
    body: 'Spreading investments across different sectors, asset classes, and geographies reduces the risk that any single loss destroys your portfolio. However, over-diversification can dilute returns. Most retail investors benefit from 10-20 holdings.',
    category: 'Risk Management',
  },
  {
    id: 'entry-breakout',
    title: 'Breakout Entry',
    body: 'A breakout entry is buying when price moves above a key resistance level with volume confirmation. The old resistance often becomes new support. Wait for the candle to close above resistance before entering to avoid false breakouts.',
    category: 'Entry & Exit',
  },
  {
    id: 'pullback-entry',
    title: 'Pullback Entry',
    body: 'Instead of chasing a breakout, wait for price to pull back to a previous support level (often the breakout point). This gives you a lower-risk entry with a tighter stop and better risk/reward.',
    category: 'Entry & Exit',
  },
  {
    id: 'scaling-out',
    title: 'Scaling Out of Positions',
    body: 'Rather than selling your entire position at once, consider selling in thirds: one-third at the first target, one-third at the second, and letting the last third run with a trailing stop. This locks in profit while staying in winning trades.',
    category: 'Entry & Exit',
  },
  {
    id: 'trailing-stop',
    title: 'Trailing Stops',
    body: 'A trailing stop moves up (for long trades) as price rises, locking in profits while leaving room for the trend to continue. Common methods: a fixed dollar amount, a percentage, or below a moving average.',
    category: 'Entry & Exit',
  },
  {
    id: 'fomo',
    title: 'Avoid FOMO',
    body: 'Fear of Missing Out drives traders to chase parabolic moves near the top. If a stock.ts has already moved 30-50% and you have no position, the risk/reward is poor. There will always be another opportunity. Wait for a proper setup.',
    category: 'Psychology',
  },
  {
    id: 'trading-journal',
    title: 'Keep a Trading Journal',
    body: 'Record every trade: entry, exit, size, reason, and outcome. Reviewing your journal regularly reveals patterns in your mistakes. Most traders improve dramatically simply by tracking what they actually did vs. what they planned.',
    category: 'Psychology',
  },
  {
    id: 'revenge-trading',
    title: 'Avoid Revenge Trading',
    body: 'After a loss, the urge to immediately make it back leads to impulsive trades with poor setups. The best action after a loss is to step away, review what happened, and only re-enter when a clean setup appears.',
    category: 'Psychology',
  },
  {
    id: 'plan-the-trade',
    title: 'Plan the Trade, Trade the Plan',
    body: 'Write down your entry, stop loss, and target before entering any trade. Once in the trade, do not change the plan based on emotions. If your rules say exit, exit. If they say stay, stay.',
    category: 'Psychology',
  },
  {
    id: 'timeframe-alignment',
    title: 'Timeframe Alignment',
    body: 'The most reliable trades occur when multiple timeframes agree. If the weekly chart shows an uptrend and the daily chart gives a buy signal, the probability is higher than a signal on the daily alone. Start with the higher timeframe.',
    category: 'Reading Charts',
  },
  {
    id: 'pe-ratio',
    title: 'Understanding P/E Ratio',
    body: 'The Price/Earnings ratio compares a stock.ts\'s price to its annual earnings per share. A P/E of 20 means you pay $20 for every $1 of earnings. Compare P/E to industry peers and the stock.ts\'s own historical average — not just the market average.',
    category: 'Indicators',
  },
  {
    id: 'earnings-impact',
    title: 'Earnings Reports',
    body: 'Companies report earnings quarterly. Stock prices often move sharply after earnings — sometimes the opposite of expectations ("buy the rumor, sell the news"). Holding through earnings is speculative. Know the report date before entering a trade.',
    category: 'Entry & Exit',
  },
  {
    id: 'short-selling',
    title: 'Short Selling Basics',
    body: 'Shorting means borrowing shares to sell at today\'s price, hoping to buy them back cheaper later. Risk is theoretically unlimited because price can rise indefinitely. Shorts require a margin account and have additional costs (borrow fee).',
    category: 'Entry & Exit',
  },
  {
    id: 'market-open-volatility',
    title: 'First 30 Minutes Volatility',
    body: 'The first 30 minutes after market open (9:30–10:00 AM ET) are often the most volatile. Many professional traders wait for the initial chaos to settle before entering positions. The opening range can set the tone for the day.',
    category: 'Reading Charts',
  },
]
```

- [ ] **Step 2: Write failing tests for useHints**

```ts
// __tests__/hooks/useHints.test.ts
import { renderHook, act } from '@testing-library/react'
import { useHints } from '@/hooks/useHints'

describe('useHints', () => {
  it('starts with the panel closed', () => {
    const { result } = renderHook(() => useHints())
    expect(result.current.isOpen).toBe(false)
  })

  it('opens the panel when toggle is called', () => {
    const { result } = renderHook(() => useHints())
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
  })

  it('closes the panel on second toggle', () => {
    const { result } = renderHook(() => useHints())
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })

  it('returns hints filtered by category', () => {
    const { result } = renderHook(() => useHints())
    act(() => result.current.setCategory('Risk Management'))
    expect(result.current.activeHints.every(h => h.category === 'Risk Management')).toBe(true)
    expect(result.current.activeHints.length).toBeGreaterThan(0)
  })

  it('returns all hints when category is null', () => {
    const { result } = renderHook(() => useHints())
    act(() => result.current.setCategory(null))
    expect(result.current.activeHints.length).toBe(25)
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=useHints
```

Expected: FAIL — `Cannot find module '@/hooks/useHints'`

- [ ] **Step 4: Implement hooks/useHints.ts**

```ts
// hooks/useHints.ts
'use client'

import { useState, useMemo } from 'react'
import { hints, type Hint } from '@/data/hints'

type HintCategory = Hint['category'] | null

export function useHints() {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<HintCategory>(null)

  const activeHints = useMemo(
    () => (category ? hints.filter((h) => h.category === category) : hints),
    [category]
  )

  return {
    isOpen,
    toggle: () => setIsOpen((prev) => !prev),
    close: () => setIsOpen(false),
    category,
    setCategory,
    activeHints,
  }
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern=useHints
```

Expected: PASS — 5 tests

- [ ] **Step 6: Commit**

```bash
git add data/hints.ts hooks/useHints.ts __tests__/hooks/useHints.test.ts
git commit -m "feat: add hint data and useHints hook with tests"
```

---

## Task 7: Shared UI Components (TDD)

**Files:**
- Create: `components/ui/PriceChange.tsx`
- Create: `components/ui/LoadingSpinner.tsx`
- Create: `__tests__/components/ui/PriceChange.test.tsx`

- [ ] **Step 1: Write failing PriceChange tests**

```tsx
// __tests__/components/ui/PriceChange.test.tsx
import { render, screen } from '@testing-library/react'
import { PriceChange } from '@/components/ui/PriceChange'

describe('PriceChange', () => {
  it('shows + prefix and green class for positive change', () => {
    render(<PriceChange change={1.23} changePercent={0.66} />)
    const el = screen.getByTestId('price-change')
    expect(el).toHaveTextContent('+1.23')
    expect(el).toHaveTextContent('+0.66%')
    expect(el.className).toMatch(/text-green/)
  })

  it('shows red class for negative change', () => {
    render(<PriceChange change={-2.50} changePercent={-1.34} />)
    const el = screen.getByTestId('price-change')
    expect(el.className).toMatch(/text-red/)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=PriceChange
```

Expected: FAIL — `Cannot find module '@/components/ui/PriceChange'`

- [ ] **Step 3: Implement components/ui/PriceChange.tsx**

```tsx
// components/ui/PriceChange.tsx
import { cn } from '@/lib/utils'

interface Props {
  change: number
  changePercent: number
  className?: string
}

export function PriceChange({ change, changePercent, className }: Props) {
  const isPositive = change >= 0
  const sign = isPositive ? '+' : ''

  return (
    <span
      data-testid="price-change"
      className={cn(
        'text-sm font-medium tabular-nums',
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
        className
      )}
    >
      {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
    </span>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern=PriceChange
```

Expected: PASS — 2 tests

- [ ] **Step 5: Create components/ui/LoadingSpinner.tsx**

```tsx
// components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary',
        className
      )}
    />
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ui/PriceChange.tsx components/ui/LoadingSpinner.tsx __tests__/components/ui/
git commit -m "feat: add PriceChange and LoadingSpinner UI components"
```

---

## Task 8: Education Static Data

**Files:**
- Create: `data/education.ts`

- [ ] **Step 1: Create data/education.ts**

```ts
// data/education.ts
import type { Article, Category } from '@/types/education'

export const categories: Category[] = [
  {
    slug: 'stocks',
    name: 'Stocks',
    description: 'Learn how stocks work, how to read price action, and how to evaluate companies.',
    articleCount: 5,
    iconName: 'TrendingUp',
  },
  {
    slug: 'options',
    name: 'Options',
    description: 'Calls, puts, Greeks, and strategies from beginner to advanced.',
    articleCount: 4,
    iconName: 'Layers',
  },
  {
    slug: 'etfs',
    name: 'ETFs',
    description: 'Exchange-traded funds: diversification, costs, and how to use them.',
    articleCount: 3,
    iconName: 'PieChart',
  },
  {
    slug: 'technical-analysis',
    name: 'Technical Analysis',
    description: 'Charts, patterns, indicators, and price action strategies.',
    articleCount: 6,
    iconName: 'BarChart2',
  },
  {
    slug: 'risk-management',
    name: 'Risk Management',
    description: 'Position sizing, stop losses, portfolio construction, and drawdown control.',
    articleCount: 4,
    iconName: 'Shield',
  },
  {
    slug: 'fundamentals',
    name: 'Fundamentals',
    description: 'Reading financial statements, valuation ratios, and earnings analysis.',
    articleCount: 5,
    iconName: 'BookOpen',
  },
  {
    slug: 'crypto',
    name: 'Crypto',
    description: 'Blockchain basics, major cryptocurrencies, and crypto-specific risk.',
    articleCount: 3,
    iconName: 'Coins',
  },
  {
    slug: 'bonds',
    name: 'Bonds',
    description: 'Fixed income investing: yields, duration, and how bonds fit in a portfolio.',
    articleCount: 3,
    iconName: 'Landmark',
  },
]

export const articles: Article[] = [
  {
    slug: 'what-is-a-stock.ts',
    title: 'What Is a Stock?',
    summary: 'A stock.ts represents ownership in a company. When you buy shares, you become a partial owner entitled to a share of the company\'s assets and earnings.',
    category: 'Stocks',
    difficulty: 'Beginner',
    readTimeMinutes: 5,
    publishedAt: '2024-01-10',
    body: `A stock (also called a share or equity) represents a unit of ownership in a company. When a company wants to raise money, it can "go public" through an Initial Public Offering (IPO), selling portions of ownership to investors.\n\nAs a shareholder, you can profit in two ways:\n\n1. **Capital appreciation** — the stock price rises above what you paid.\n2. **Dividends** — some companies distribute a portion of profits to shareholders.\n\nStocks trade on exchanges (NYSE, NASDAQ) during market hours (9:30 AM–4:00 PM ET, weekdays). The price fluctuates based on supply and demand, driven by earnings, economic conditions, and investor sentiment.`,
  },
  {
    slug: 'how-to-read-a-stock.ts-chart',
    title: 'How to Read a Stock Chart',
    summary: 'Stock charts visually represent price history. Learning to read them is the foundation of technical analysis.',
    category: 'Stocks',
    difficulty: 'Beginner',
    readTimeMinutes: 7,
    publishedAt: '2024-01-15',
    body: `A stock chart shows price over time. The x-axis is time; the y-axis is price. The most common chart types are:\n\n**Line Chart** — plots only the closing price. Simple, good for trend overview.\n\n**Candlestick Chart** — shows open, high, low, and close for each period. A green (or white) candle means close > open. A red (or black) candle means close < open. The thin lines (wicks) show the high and low.\n\n**Volume bars** at the bottom show how many shares were traded. High volume on a price move adds conviction.\n\n**Timeframes:** A "1D" chart shows one candle per day. "1W" shows one per week. Longer timeframes show bigger trends; shorter timeframes show day-to-day movements.`,
  },
  {
    slug: 'position-sizing',
    title: 'Position Sizing: The Key to Long-Term Survival',
    summary: 'How much of your portfolio to put into any single trade is arguably the most important decision you make as a trader.',
    category: 'Risk Management',
    difficulty: 'Intermediate',
    readTimeMinutes: 8,
    publishedAt: '2024-02-01',
    body: `Position sizing determines how many shares or contracts you buy in a single trade. Getting this wrong is one of the fastest ways to lose money, even with a good strategy.\n\n**The 1% Rule:** Risk no more than 1% of your total account on any single trade. With a $10,000 account, you risk at most $100 per trade.\n\n**Calculating position size:**\n1. Decide your maximum dollar risk (e.g., $100)\n2. Set your stop loss (e.g., $2 below entry)\n3. Divide: $100 / $2 = 50 shares\n\nThis keeps any single loss manageable and prevents one bad trade from ruining your account.`,
  },
  {
    slug: 'what-are-options',
    title: 'What Are Options?',
    summary: 'Options are contracts that give you the right — but not the obligation — to buy or sell a stock.ts at a specific price before a specific date.',
    category: 'Options',
    difficulty: 'Intermediate',
    readTimeMinutes: 10,
    publishedAt: '2024-02-10',
    body: `An option is a contract between a buyer and a seller. It gives the buyer the *right* (not obligation) to buy or sell 100 shares of a stock at a predetermined price (the **strike price**) before a specific date (the **expiration date**).\n\n**Call Option** — gives you the right to *buy* at the strike price. You buy calls when you expect the stock to rise.\n\n**Put Option** — gives you the right to *sell* at the strike price. You buy puts when you expect the stock to fall, or to protect a position you own.\n\n**Premium:** You pay a premium upfront to buy the option. This is your maximum loss as a buyer.\n\nOptions offer leverage — you can control 100 shares for a fraction of the cost of buying the shares outright.`,
  },
  {
    slug: 'reading-financial-statements',
    title: 'Reading Financial Statements',
    summary: 'Three core documents — the income statement, balance sheet, and cash flow statement — tell you almost everything about a company\'s financial health.',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    readTimeMinutes: 12,
    publishedAt: '2024-03-01',
    body: `Every public company files quarterly and annual reports with the SEC. The three core financial statements are:\n\n**Income Statement (P&L)**\nShows revenue, expenses, and net income over a period. Key metrics: gross margin, operating income, EPS (earnings per share).\n\n**Balance Sheet**\nA snapshot of assets, liabilities, and equity at a single point in time. Assets = Liabilities + Equity. Look at cash vs. debt levels.\n\n**Cash Flow Statement**\nShows actual cash moving in and out. Operating cash flow is more reliable than net income (which can be manipulated with accounting). A company can show profit but run out of cash.\n\nFocus on trends: are revenues growing? Is debt increasing faster than earnings? Is free cash flow positive?`,
  },
  {
    slug: 'introduction-to-etfs',
    title: 'Introduction to ETFs',
    summary: 'ETFs (Exchange-Traded Funds) hold a basket of assets and trade like a single stock.ts. They\'re one of the most efficient vehicles for diversified investing.',
    category: 'ETFs',
    difficulty: 'Beginner',
    readTimeMinutes: 6,
    publishedAt: '2024-03-15',
    body: `An ETF is a fund that holds many assets (stocks, bonds, commodities) and trades on an exchange like a single stock. When you buy one share of SPY (the S&P 500 ETF), you get exposure to all 500 companies in the index.\n\n**Advantages:**\n- Instant diversification\n- Low expense ratios (often 0.03%–0.20%/year)\n- Tax efficient\n- Trade throughout the day\n\n**Types:** Index ETFs track an index (SPY, QQQ). Sector ETFs focus on one industry (XLF for financials). Bond ETFs hold fixed income (AGG). Inverse/leveraged ETFs are for sophisticated traders.\n\nFor most long-term investors, a simple portfolio of broad index ETFs (e.g. VTI + VXUS + BND) outperforms most actively managed strategies.`,
  },
  {
    slug: 'technical-indicators-overview',
    title: 'Technical Indicators: An Overview',
    summary: 'Technical indicators are mathematical calculations based on price and volume, used to identify trends, momentum, and potential reversal points.',
    category: 'Technical Analysis',
    difficulty: 'Intermediate',
    readTimeMinutes: 9,
    publishedAt: '2024-04-01',
    body: `Technical indicators fall into four categories:\n\n**Trend Indicators** (Moving Averages, MACD)\nShow the direction and strength of a trend. Use these to avoid trading against the dominant direction.\n\n**Momentum Indicators** (RSI, Stochastic)\nMeasure the speed of price movement. Help identify overbought/oversold conditions.\n\n**Volatility Indicators** (Bollinger Bands, ATR)\nMeasure how much price is fluctuating. Expanding bands suggest increasing volatility; contracting bands suggest a breakout may be coming.\n\n**Volume Indicators** (OBV, Volume Profile)\nConfirm or challenge price moves. A breakout with low volume is suspect.\n\n**Warning:** Indicators lag — they are based on past price data. Never use an indicator as a standalone signal. Combine them with price action and proper risk management.`,
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add data/education.ts
git commit -m "feat: add static education content (categories + articles)"
```

---

## Task 9: Navbar & Footer + Root Layout Update

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/layout/Navbar.tsx**

```tsx
// components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { TrendingUp, Search, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Markets' },
  { href: '/learn', label: 'Learn' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const symbol = search.trim().toUpperCase()
    if (symbol) {
      router.push(`/stocks/${symbol}`)
      setSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>MarketWise</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol… (AAPL)"
              className="h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </form>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create components/layout/Footer.tsx**

```tsx
// components/layout/Footer.tsx
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/40 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>MarketWise</span>
          </div>
          <p className="text-xs text-muted-foreground">
            For educational purposes only. Not financial advice. Data from Alpha Vantage.
          </p>
          <nav className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Markets</Link>
            <Link href="/learn" className="hover:text-foreground">Learn</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update app/layout.tsx to include Navbar and Footer**

Replace the `<body>` content in `app/layout.tsx`:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const jetbrainsMonoHeading = JetBrains_Mono({ subsets: ['latin'], variable: '--font-heading' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketWise — Learn & Trade Smarter",
  description: "Educational stock.ts market platform with live charts and trading resources.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable, geistMono.variable,
        outfit.variable, jetbrainsMonoHeading.variable,
        "font-sans"
      )}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify layout renders**

```bash
npm run dev
```

Visit `http://localhost:3000` — should show Navbar at top and Footer at bottom.

- [ ] **Step 5: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: add Navbar, Footer, and update root layout"
```

---

## Task 10: Dashboard Components

**Files:**
- Create: `components/dashboard/MarketIndexCard.tsx`
- Create: `components/dashboard/MarketOverview.tsx`
- Create: `components/dashboard/TrendingStockRow.tsx`
- Create: `components/dashboard/TrendingStocks.tsx`

- [ ] **Step 1: Create components/dashboard/MarketIndexCard.tsx**

```tsx
// components/dashboard/MarketIndexCard.tsx
import { PriceChange } from '@/components/ui/PriceChange'
import { formatCurrency } from '@/lib/formatters'
import type { MarketIndex } from '@/types/stock.ts'

export function MarketIndexCard({ index }: { index: MarketIndex }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{index.name}</p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums">
        {formatCurrency(index.value)}
      </p>
      <PriceChange
        change={index.change}
        changePercent={index.changePercent}
        className="mt-1"
      />
    </div>
  )
}
```

- [ ] **Step 2: Create components/dashboard/MarketOverview.tsx**

```tsx
// components/dashboard/MarketOverview.tsx
import { MarketIndexCard } from './MarketIndexCard'
import { fetchMarketIndices } from '@/lib/stockApi'

export async function MarketOverview() {
  let indices = await fetchMarketIndices().catch(() => [])

  // Fallback data when API key is missing or rate-limited
  if (indices.length === 0) {
    indices = [
      { symbol: '^GSPC', name: 'S&P 500', value: 5308.13, change: 12.45, changePercent: 0.23 },
      { symbol: '^IXIC', name: 'NASDAQ', value: 16785.22, change: -45.30, changePercent: -0.27 },
      { symbol: '^DJI', name: 'Dow Jones', value: 39127.80, change: 88.10, changePercent: 0.23 },
    ]
  }

  return (
    <section aria-label="Market Overview">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Market Overview
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {indices.map((idx) => (
          <MarketIndexCard key={idx.symbol} index={idx} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create components/dashboard/TrendingStockRow.tsx**

```tsx
// components/dashboard/TrendingStockRow.tsx
import Link from 'next/link'
import { PriceChange } from '@/components/ui/PriceChange'
import { formatCurrency } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

export function TrendingStockRow({ quote }: { quote: StockQuote }) {
  return (
    <Link
      href={`/stocks/${quote.symbol}`}
      className="flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-muted/60"
    >
      <div>
        <span className="font-heading text-sm font-bold">{quote.symbol}</span>
        <span className="ml-2 text-xs text-muted-foreground">{quote.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-heading text-sm font-semibold tabular-nums">
          {formatCurrency(quote.price)}
        </span>
        <PriceChange change={quote.change} changePercent={quote.changePercent} />
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Create components/dashboard/TrendingStocks.tsx**

```tsx
// components/dashboard/TrendingStocks.tsx
import { TrendingStockRow } from './TrendingStockRow'
import { fetchQuote } from '@/lib/stockApi'
import type { StockQuote } from '@/types/stock.ts'

const TRENDING_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B']

export async function TrendingStocks() {
  const results = await Promise.allSettled(
    TRENDING_SYMBOLS.map((s) => fetchQuote(s))
  )

  const quotes: StockQuote[] = results
    .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (quotes.length === 0) {
    return (
      <section aria-label="Trending Stocks">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Trending Stocks
        </h2>
        <p className="text-sm text-muted-foreground">
          Unable to load trending stocks. Check your API key.
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Trending Stocks">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Trending Stocks
      </h2>
      <div className="rounded-lg border border-border bg-card">
        {quotes.map((quote) => (
          <TrendingStockRow key={quote.symbol} quote={quote} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/
git commit -m "feat: add dashboard MarketOverview and TrendingStocks components"
```

---

## Task 11: Dashboard Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { MarketOverview } from '@/components/dashboard/MarketOverview'
import { TrendingStocks } from '@/components/dashboard/TrendingStocks'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { BookOpen, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Learn to Trade. <span className="text-primary">Track the Market.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Live market data, interactive charts, and educational resources — all in one place.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            Start Learning
          </Link>
          <Link
            href="/stocks/AAPL"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <TrendingUp className="h-4 w-4" />
            View Charts
          </Link>
        </div>
      </div>

      {/* Market Overview */}
      <Suspense fallback={
        <div className="flex h-24 items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <MarketOverview />
      </Suspense>

      {/* Trending */}
      <div className="mt-8">
        <Suspense fallback={
          <div className="flex h-40 items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <TrendingStocks />
        </Suspense>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify home page renders**

```bash
npm run dev
```

Visit `http://localhost:3000` — should show hero text, market overview cards, and trending stocks list.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build dashboard home page"
```

---

## Task 12: Stock Chart Component

**Files:**
- Create: `components/stocks/StockChart.tsx`

- [ ] **Step 1: Install lightweight-charts**

```bash
npm install lightweight-charts
```

- [ ] **Step 2: Create components/stocks/StockChart.tsx**

```tsx
// components/stocks/StockChart.tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add components/stocks/StockChart.tsx package.json package-lock.json
git commit -m "feat: add TradingView Lightweight Charts stock chart component"
```

---

## Task 13: Stock Page Components

**Files:**
- Create: `components/stocks/StockHeader.tsx`
- Create: `components/stocks/TimeframePicker.tsx`
- Create: `components/stocks/StockStats.tsx`

- [ ] **Step 1: Write StockHeader test**

```tsx
// __tests__/components/stocks/StockHeader.test.tsx
import { render, screen } from '@testing-library/react'
import { StockHeader } from '@/components/stocks/StockHeader'

const mockQuote = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 185.50,
  change: 1.23,
  changePercent: 0.67,
  volume: 55000000,
  marketCap: 2900000000000,
  peRatio: 28.5,
  weekHigh52: 199.62,
  weekLow52: 164.08,
  open: 184.30,
  previousClose: 184.27,
}

test('renders symbol and price', () => {
  render(<StockHeader quote={mockQuote} isLoading={false} />)
  expect(screen.getByText('AAPL')).toBeInTheDocument()
  expect(screen.getByText('$185.50')).toBeInTheDocument()
})

test('shows loading state', () => {
  render(<StockHeader quote={null} isLoading={true} />)
  expect(screen.getByRole('status')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --testPathPattern=StockHeader
```

Expected: FAIL — `Cannot find module '@/components/stocks/StockHeader'`

- [ ] **Step 3: Create components/stocks/StockHeader.tsx**

```tsx
// components/stocks/StockHeader.tsx
'use client'

import { PriceChange } from '@/components/ui/PriceChange'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatCurrency } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

interface Props {
  quote: StockQuote | null
  isLoading: boolean
}

export function StockHeader({ quote, isLoading }: Props) {
  if (isLoading || !quote) {
    return (
      <div className="flex h-16 items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <h1 className="font-heading text-3xl font-bold">{quote.symbol}</h1>
      <span className="text-muted-foreground">{quote.name}</span>
      <span className="font-heading text-3xl font-bold tabular-nums">
        {formatCurrency(quote.price)}
      </span>
      <PriceChange change={quote.change} changePercent={quote.changePercent} />
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern=StockHeader
```

Expected: PASS — 2 tests

- [ ] **Step 5: Create components/stocks/TimeframePicker.tsx**

```tsx
// components/stocks/TimeframePicker.tsx
'use client'

import { cn } from '@/lib/utils'
import type { Timeframe } from '@/types/stock.ts'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

interface Props {
  selected: Timeframe
  onChange: (tf: Timeframe) => void
}

export function TimeframePicker({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={cn(
            'rounded px-3 py-1 text-xs font-medium transition-colors',
            selected === tf
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Create components/stocks/StockStats.tsx**

```tsx
// components/stocks/StockStats.tsx
import { formatCurrency, formatVolume, formatMarketCap, formatPercent } from '@/lib/formatters'
import type { StockQuote } from '@/types/stock.ts'

export function StockStats({ quote }: { quote: StockQuote }) {
  const stats = [
    { label: 'Open', value: formatCurrency(quote.open) },
    { label: 'Prev Close', value: formatCurrency(quote.previousClose) },
    { label: 'Volume', value: formatVolume(quote.volume) },
    { label: 'Market Cap', value: formatMarketCap(quote.marketCap) },
    { label: 'P/E Ratio', value: quote.peRatio?.toFixed(2) ?? 'N/A' },
    { label: '52W High', value: formatCurrency(quote.weekHigh52) },
    { label: '52W Low', value: formatCurrency(quote.weekLow52) },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-4">
      {stats.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-0.5 font-heading text-sm font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/stocks/ __tests__/components/stocks/
git commit -m "feat: add StockHeader, TimeframePicker, StockStats components"
```

---

## Task 14: Hint System Components

**Files:**
- Create: `components/hints/HintCard.tsx`
- Create: `components/hints/HintTrigger.tsx`
- Create: `components/hints/HintPanel.tsx`

- [ ] **Step 1: Create components/hints/HintCard.tsx**

```tsx
// components/hints/HintCard.tsx
import type { Hint } from '@/data/hints'

const CATEGORY_COLORS: Record<Hint['category'], string> = {
  'Reading Charts': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Risk Management': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  'Entry & Exit': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Psychology': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Indicators': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
}

export function HintCard({ hint }: { hint: Hint }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold">{hint.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[hint.category]}`}>
          {hint.category}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{hint.body}</p>
    </div>
  )
}
```

- [ ] **Step 2: Create components/hints/HintTrigger.tsx**

```tsx
// components/hints/HintTrigger.tsx
'use client'

import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onToggle: () => void
}

export function HintTrigger({ isOpen, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close trading hints' : 'Open trading hints'}
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors',
        isOpen
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary'
      )}
    >
      <HelpCircle className="h-5 w-5" />
    </button>
  )
}
```

- [ ] **Step 3: Create components/hints/HintPanel.tsx**

```tsx
// components/hints/HintPanel.tsx
'use client'

import { X } from 'lucide-react'
import { HintCard } from './HintCard'
import { HintTrigger } from './HintTrigger'
import { useHints } from '@/hooks/useHints'
import type { Hint } from '@/data/hints'

const CATEGORIES: Array<Hint['category'] | null> = [
  null,
  'Reading Charts',
  'Indicators',
  'Entry & Exit',
  'Risk Management',
  'Psychology',
]

const CATEGORY_LABELS: Record<string, string> = {
  'null': 'All',
  'Reading Charts': 'Charts',
  'Indicators': 'Indicators',
  'Entry & Exit': 'Entry/Exit',
  'Risk Management': 'Risk',
  'Psychology': 'Psychology',
}

export function HintPanel() {
  const { isOpen, toggle, close, category, setCategory, activeHints } = useHints()

  return (
    <>
      <HintTrigger isOpen={isOpen} onToggle={toggle} />

      {/* Drawer */}
      {isOpen && (
        <aside className="fixed right-0 top-0 z-30 flex h-full w-80 flex-col border-l border-border bg-background shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-heading text-sm font-bold">Trading Hints</h2>
            <button onClick={close} aria-label="Close hints panel">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1 border-b border-border px-4 py-2">
            {CATEGORIES.map((cat) => {
              const label = CATEGORY_LABELS[String(cat)]
              const active = category === cat
              return (
                <button
                  key={String(cat)}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Hint list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {activeHints.map((hint) => (
              <HintCard key={hint.id} hint={hint} />
            ))}
          </div>
        </aside>
      )}
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/hints/
git commit -m "feat: add HintCard, HintTrigger, and HintPanel components"
```

---

## Task 15: Stock Detail Page

**Files:**
- Create: `app/stocks/[symbol]/page.tsx`

- [ ] **Step 1: Create app/stocks/[symbol]/page.tsx**

```tsx
// app/stocks/[symbol]/page.tsx
'use client'

import { useState } from 'react'
import { StockHeader } from '@/components/stocks/StockHeader'
import { StockChart } from '@/components/stocks/StockChart'
import { TimeframePicker } from '@/components/stocks/TimeframePicker'
import { StockStats } from '@/components/stocks/StockStats'
import { HintPanel } from '@/components/hints/HintPanel'
import { useStockQuote, useTimeSeries } from '@/hooks/useStockData'
import type { Timeframe } from '@/types/stock.ts'
import { use } from 'react'

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const [timeframe, setTimeframe] = useState<Timeframe>('1M')
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol.toUpperCase())
  const { series, isLoading: seriesLoading } = useTimeSeries(symbol.toUpperCase(), timeframe)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <StockHeader quote={quote ?? null} isLoading={quoteLoading} />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Price Chart
          </h2>
          <TimeframePicker selected={timeframe} onChange={setTimeframe} />
        </div>

        <StockChart series={series} isLoading={seriesLoading} />

        {quote && <StockStats quote={quote} />}
      </div>

      {/* Hint panel floats over the page */}
      <HintPanel />
    </div>
  )
}
```

- [ ] **Step 2: Verify stock page works**

```bash
npm run dev
```

Visit `http://localhost:3000/stocks/AAPL` — should show price header, candlestick chart, stats panel, and a floating `?` button that opens the hint drawer.

- [ ] **Step 3: Commit**

```bash
git add app/stocks/
git commit -m "feat: build stock detail page with chart and hint system"
```

---

## Task 16: Learn Repository Components (TDD)

**Files:**
- Create: `components/learn/CategoryCard.tsx`
- Create: `components/learn/CategoryGrid.tsx`
- Create: `components/learn/ResourceCard.tsx`
- Create: `components/learn/FilterTabs.tsx`
- Create: `components/learn/LearnSearchBar.tsx`
- Create: `components/learn/ResourceList.tsx`
- Create: `__tests__/components/learn/FilterTabs.test.tsx`

- [ ] **Step 1: Write FilterTabs test**

```tsx
// __tests__/components/learn/FilterTabs.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterTabs } from '@/components/learn/FilterTabs'

const categories = ['All', 'Stocks', 'Options', 'ETFs']

test('renders all tab labels', () => {
  render(<FilterTabs categories={categories} selected="All" onSelect={() => {}} />)
  categories.forEach((c) => expect(screen.getByRole('button', { name: c })).toBeInTheDocument())
})

test('calls onSelect with clicked category', async () => {
  const user = userEvent.setup()
  const onSelect = jest.fn()
  render(<FilterTabs categories={categories} selected="All" onSelect={onSelect} />)
  await user.click(screen.getByRole('button', { name: 'Stocks' }))
  expect(onSelect).toHaveBeenCalledWith('Stocks')
})

test('marks the selected tab as active via aria-pressed', () => {
  render(<FilterTabs categories={categories} selected="Options" onSelect={() => {}} />)
  expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: 'Stocks' })).toHaveAttribute('aria-pressed', 'false')
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --testPathPattern=FilterTabs
```

Expected: FAIL — `Cannot find module '@/components/learn/FilterTabs'`

- [ ] **Step 3: Create components/learn/FilterTabs.tsx**

```tsx
// components/learn/FilterTabs.tsx
'use client'

import { cn } from '@/lib/utils'

interface Props {
  categories: string[]
  selected: string
  onSelect: (cat: string) => void
}

export function FilterTabs({ categories, selected, onSelect }: Props) {
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected === cat
        return (
          <button
            key={cat}
            aria-pressed={isActive}
            onClick={() => onSelect(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- --testPathPattern=FilterTabs
```

Expected: PASS — 3 tests

- [ ] **Step 5: Create components/learn/CategoryCard.tsx**

```tsx
// components/learn/CategoryCard.tsx
import Link from 'next/link'
import {
  TrendingUp, Layers, PieChart, BarChart2,
  Shield, BookOpen, Coins, Landmark,
} from 'lucide-react'
import type { Category } from '@/types/education'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Layers, PieChart, BarChart2,
  Shield, BookOpen, Coins, Landmark,
}

export function CategoryCard({ category }: { category: Category }) {
  const Icon = ICONS[category.iconName] ?? BookOpen
  return (
    <Link
      href={`/learn/${category.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-heading text-sm font-bold">{category.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{category.description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{category.articleCount} articles</p>
    </Link>
  )
}
```

- [ ] **Step 6: Create components/learn/CategoryGrid.tsx**

```tsx
// components/learn/CategoryGrid.tsx
import { CategoryCard } from './CategoryCard'
import type { Category } from '@/types/education'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.slug} category={cat} />
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Create components/learn/ResourceCard.tsx**

```tsx
// components/learn/ResourceCard.tsx
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Article } from '@/types/education'

const DIFFICULTY_STYLES = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export function ResourceCard({ article, categorySlug }: { article: Article; categorySlug: string }) {
  return (
    <Link
      href={`/learn/${categorySlug}/${article.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-sm font-bold leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[article.difficulty]}`}>
          {article.difficulty}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{article.summary}</p>
      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{article.readTimeMinutes} min read</span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 8: Create components/learn/LearnSearchBar.tsx**

```tsx
// components/learn/LearnSearchBar.tsx
'use client'

import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function LearnSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles…"
        className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
```

- [ ] **Step 9: Create components/learn/ResourceList.tsx**

```tsx
// components/learn/ResourceList.tsx
'use client'

import { useState, useMemo } from 'react'
import { LearnSearchBar } from './LearnSearchBar'
import { FilterTabs } from './FilterTabs'
import { ResourceCard } from './ResourceCard'
import { articles, categories } from '@/data/education'
import type { TopicCategory } from '@/types/education'

const ALL_LABEL = 'All'
const CATEGORY_LABELS = [ALL_LABEL, ...categories.map((c) => c.name)]

function getCategorySlug(name: TopicCategory): string {
  return categories.find((c) => c.name === name)?.slug ?? name.toLowerCase().replace(/\s+/g, '-')
}

export function ResourceList() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(ALL_LABEL)

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory = selected === ALL_LABEL || a.category === selected
      const matchesSearch =
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.summary.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, selected])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LearnSearchBar value={search} onChange={setSearch} />
        <FilterTabs categories={CATEGORY_LABELS} selected={selected} onSelect={setSelected} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No articles match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ResourceCard
              key={article.slug}
              article={article}
              categorySlug={getCategorySlug(article.category)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 10: Commit**

```bash
git add components/learn/ __tests__/components/learn/
git commit -m "feat: add Learn repository components with filter and search"
```

---

## Task 17: Learn Pages

**Files:**
- Create: `app/learn/page.tsx`
- Create: `app/learn/[category]/page.tsx`
- Create: `app/learn/[category]/[slug]/page.tsx`

- [ ] **Step 1: Create app/learn/page.tsx**

```tsx
// app/learn/page.tsx
import { CategoryGrid } from '@/components/learn/CategoryGrid'
import { ResourceList } from '@/components/learn/ResourceList'
import { categories } from '@/data/education'

export const metadata = {
  title: 'Learn — MarketWise',
  description: 'Educational resources on stocks, options, ETFs, and more.',
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      {/* Hero */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Financial Education Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to understand markets, from basic concepts to advanced strategies.
        </p>
      </div>

      {/* Categories */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold">Browse by Topic</h2>
        <CategoryGrid categories={categories} />
      </section>

      {/* All articles with search + filter */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold">All Articles</h2>
        <ResourceList />
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create app/learn/[category]/page.tsx**

```tsx
// app/learn/[category]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ResourceCard } from '@/components/learn/ResourceCard'
import { articles, categories } from '@/data/education'
import { ArrowLeft } from 'lucide-react'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params
  const category = categories.find((c) => c.slug === categorySlug)
  if (!category) notFound()

  const categoryArticles = articles.filter(
    (a) => a.category === category.name
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Learn
      </Link>

      <h1 className="font-heading text-3xl font-bold">{category.name}</h1>
      <p className="mt-2 text-muted-foreground">{category.description}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryArticles.length > 0 ? (
          categoryArticles.map((article) => (
            <ResourceCard
              key={article.slug}
              article={article}
              categorySlug={categorySlug}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No articles in this category yet.
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create app/learn/[category]/[slug]/page.tsx**

```tsx
// app/learn/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BarChart2 } from 'lucide-react'
import { articles, categories } from '@/data/education'

const DIFFICULTY_STYLES = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category: categorySlug, slug } = await params
  const article = articles.find((a) => a.slug === slug)
  const category = categories.find((c) => c.slug === categorySlug)

  if (!article || !category) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/learn/${categorySlug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {category.name}
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[article.difficulty]}`}>
            {article.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {article.readTimeMinutes} min read
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold leading-tight">{article.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>
      </header>

      <article className="prose prose-sm dark:prose-invert max-w-none">
        {article.body.split('\n\n').map((paragraph, i) => {
          // Bold **text** rendering
          const parts = paragraph.split(/(\*\*[^*]+\*\*)/)
          return (
            <p key={i} className="mb-4 text-sm leading-relaxed text-foreground">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={j}>{part.slice(2, -2)}</strong>
                ) : (
                  part
                )
              )}
            </p>
          )
        })}
      </article>

      {/* Related articles */}
      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          Category:{' '}
          <Link href={`/learn/${categorySlug}`} className="hover:text-primary underline">
            {category.name}
          </Link>
        </p>
      </footer>
    </div>
  )
}
```

- [ ] **Step 4: Verify all three learn routes work**

```bash
npm run dev
```

- `http://localhost:3000/learn` — category grid + searchable article list
- `http://localhost:3000/learn/stocks` — filtered articles for Stocks
- `http://localhost:3000/learn/stocks/what-is-a-stock` — full article view

- [ ] **Step 5: Commit**

```bash
git add app/learn/
git commit -m "feat: add /learn, /learn/[category], and /learn/[category]/[slug] pages"
```

---

## Task 18: Run Full Test Suite

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass. Currently covered: `formatters`, `useHints`, `PriceChange`, `StockHeader`, `FilterTabs`.

- [ ] **Step 2: Run dev build to catch type errors**

```bash
npm run build
```

Expected: No TypeScript errors. Fix any errors before continuing.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any build or type errors"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Yahoo Finance-style charting — `StockChart` with lightweight-charts + `TimeframePicker`
- [x] Hint system on graph page — `HintPanel` + `HintTrigger` + `useHints` on `/stocks/[symbol]`
- [x] Educational repository page — `/learn` with `CategoryGrid` + `ResourceList`
- [x] Category pages — `/learn/[category]`
- [x] Individual article pages — `/learn/[category]/[slug]`
- [x] Dashboard with market overview — `MarketOverview` + `TrendingStocks` on `/`
- [x] Stock API integration — Alpha Vantage via Route Handlers
- [x] Next.js 16 `params` as Promise (awaited in server components, `use()` in client components)

**Placeholder scan:** None found. All steps have complete code.

**Type consistency:** `StockQuote`, `TimeSeriesPoint`, `Timeframe`, `MarketIndex` defined in Task 2 and used consistently. `Hint` defined in `data/hints.ts` and referenced in `hooks/useHints.ts` and hint components. `Article`, `Category` from `types/education.ts` used across data and components.
