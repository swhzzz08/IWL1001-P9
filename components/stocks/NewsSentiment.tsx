'use client'

import { useState, useEffect } from 'react'
import type { NewsArticle, SentimentSummary } from '@/types/stock'
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, AlertCircle, BookOpen } from 'lucide-react'

function formatDate(raw: string) {
  // Alpha Vantage format: 20240101T120000
  if (raw.includes('T') && !raw.includes('-')) {
    const y = raw.slice(0, 4), mo = raw.slice(4, 6), d = raw.slice(6, 8)
    const h = raw.slice(9, 11), mi = raw.slice(11, 13)
    return new Date(`${y}-${mo}-${d}T${h}:${mi}:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return new Date(raw).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SentimentGauge({ summary }: { summary: SentimentSummary }) {
  const pct = Math.round(((summary.score + 1) / 2) * 100)
  const color = summary.label === 'Positive' ? '#16a34a' : summary.label === 'Negative' ? '#dc2626' : '#d97706'
  const bg = summary.label === 'Positive' ? '#f0fdf4' : summary.label === 'Negative' ? '#fef2f2' : '#fffbeb'

  return (
    <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
          Market Sentiment
        </h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 700 }}>
          {summary.label === 'Positive' ? <TrendingUp size={11} /> : summary.label === 'Negative' ? <TrendingDown size={11} /> : <Minus size={11} />}
          {summary.label}
        </div>
      </div>

      {/* Gauge bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{ height: 10, borderRadius: 999, background: 'linear-gradient(90deg, #dc2626, #d97706, #16a34a)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', borderRadius: 999 }} />
        </div>
        {/* Needle */}
        <div style={{
          position: 'absolute', top: -3, width: 16, height: 16, borderRadius: '50%',
          background: 'white', border: `3px solid ${color}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          left: `calc(${pct}% - 8px)`,
          transition: 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-subtle)', marginBottom: 16 }}>
        <span>Bearish</span><span>Neutral</span><span>Bullish</span>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Positive', count: summary.positive, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Neutral', count: summary.neutral, color: '#d97706', bg: '#fffbeb' },
          { label: 'Negative', count: summary.negative, color: '#dc2626', bg: '#fef2f2' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{ background: bg, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color, margin: 0, fontFamily: 'var(--font-heading)' }}>{count}</p>
            <p style={{ fontSize: 10, fontWeight: 600, color, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Educational note */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'flex-start', background: '#f8fafc', borderRadius: 8, padding: '10px 12px' }}>
        <BookOpen size={12} color="var(--color-text-subtle)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
          <strong>What is sentiment?</strong> Sentiment analysis uses NLP to determine whether news articles are positive, negative or neutral. A bullish sentiment often correlates with price increases, but is not a guarantee.
        </p>
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: NewsArticle }) {
  const sentColor = article.sentiment === 'positive' ? '#16a34a' : article.sentiment === 'negative' ? '#dc2626' : '#d97706'
  const sentBg = article.sentiment === 'positive' ? '#f0fdf4' : article.sentiment === 'negative' ? '#fef2f2' : '#fffbeb'
  const sentLabel = article.sentiment === 'positive' ? 'Bullish' : article.sentiment === 'negative' ? 'Bearish' : 'Neutral'

  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
      display: 'block', padding: '16px', textDecoration: 'none',
      borderBottom: '1px solid var(--color-border)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-subtle)' }}>{article.source}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{formatDate(article.publishedAt)}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 6px', lineHeight: 1.5 }}>
            {article.title}
          </p>
          {article.description && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {article.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sentBg, color: sentColor, borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {article.sentiment === 'positive' ? <TrendingUp size={9} /> : article.sentiment === 'negative' ? <TrendingDown size={9} /> : <Minus size={9} />}
            {sentLabel}
          </div>
          <ExternalLink size={12} color="var(--color-text-subtle)" />
        </div>
      </div>

      {/* Sentiment score bar */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-subtle)', width: 60, flexShrink: 0 }}>Sentiment</span>
        <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--color-surface-2)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: sentColor,
            width: `${Math.round(((article.sentimentScore + 1) / 2) * 100)}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontSize: 10, color: sentColor, fontWeight: 700, width: 36, textAlign: 'right' }}>
          {article.sentimentScore > 0 ? '+' : ''}{article.sentimentScore.toFixed(2)}
        </span>
      </div>
    </a>
  )
}

export function NewsSentiment({ symbol }: { symbol: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function load() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/news?symbol=${symbol}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setArticles(data)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [symbol])

  // Compute sentiment summary
  const summary: SentimentSummary = {
    score: articles.length ? articles.reduce((a, b) => a + b.sentimentScore, 0) / articles.length : 0,
    label: (() => {
      if (!articles.length) return 'Neutral'
      const avg = articles.reduce((a, b) => a + b.sentimentScore, 0) / articles.length
      return avg > 0.1 ? 'Positive' : avg < -0.1 ? 'Negative' : 'Neutral'
    })(),
    positive: articles.filter(a => a.sentiment === 'positive').length,
    neutral: articles.filter(a => a.sentiment === 'neutral').length,
    negative: articles.filter(a => a.sentiment === 'negative').length,
    total: articles.length,
  }

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Newspaper size={14} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', margin: 0 }}>
            News & Sentiment
          </h2>
        </div>
        <button onClick={load} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600,
          color: 'var(--color-text-muted)', cursor: 'pointer',
        }}>
          <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Sentiment gauge */}
      {!loading && !error && articles.length > 0 && <SentimentGauge summary={summary} />}

      {/* Articles */}
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 16, width: '90%', marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: '70%' }} />
              </div>
            ))}
          </div>
        ) : error || articles.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <AlertCircle size={22} color="#dc2626" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>No news available</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              Could not load news for <strong>{symbol}</strong>. This may be an API limit issue.
            </p>
            <button onClick={load} style={{
              background: '#eff6ff', color: '#2563eb', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Try again</button>
          </div>
        ) : (
          <>
            {articles.map((article, i) => <ArticleCard key={i} article={article} />)}
            <div style={{ padding: '12px 16px', background: 'var(--color-surface-2)', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: 0 }}>
                Showing {articles.length} recent articles · Sentiment scored automatically using NLP
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}