import { NextRequest, NextResponse } from 'next/server'
import { analyzeSentiment } from '@/lib/sentiment'
import type { NewsArticle } from '@/types/stock'

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 })

  // Try NewsAPI first, fall back to Alpha Vantage news
  try {
    const articles = await fetchFromAlphaVantageNews(symbol)
    return NextResponse.json(articles)
  } catch {
    // Return empty gracefully so UI can show fallback
    return NextResponse.json([])
  }
}

async function fetchFromAlphaVantageNews(symbol: string): Promise<NewsArticle[]> {
  const KEY = process.env.NEXT_PUBLIC_MASSIVE_API_KEY
  if (!KEY) throw new Error('No API key')

  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&limit=10&apikey=${KEY}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`News fetch failed: ${res.status}`)

  const json = await res.json()
  const feed = json?.feed

  if (!feed || !Array.isArray(feed)) throw new Error('No news feed')

  return feed.slice(0, 10).map((item: any) => {
    const text = `${item.title ?? ''} ${item.summary ?? ''}`
    const { score, label } = analyzeSentiment(text)

    // Use Alpha Vantage's own sentiment if available
    const avSentiment = item.overall_sentiment_label?.toLowerCase() ?? label
    const avScore = parseFloat(item.overall_sentiment_score ?? score)

    return {
      title: item.title ?? 'No title',
      description: item.summary ?? null,
      url: item.url ?? '#',
      source: item.source ?? 'Unknown',
      publishedAt: item.time_published ?? new Date().toISOString(),
      sentiment: avSentiment.includes('bullish') || avSentiment === 'positive' ? 'positive'
        : avSentiment.includes('bearish') || avSentiment === 'negative' ? 'negative'
        : 'neutral',
      sentimentScore: isNaN(avScore) ? score : avScore,
    } as NewsArticle
  })
}