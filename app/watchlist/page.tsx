'use client'

import { useState } from 'react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useStockQuote } from '@/hooks/useStockData'
import Link from 'next/link'
import { Star, Trash2, TrendingUp, TrendingDown, Plus, BookOpen, ArrowRight } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function WatchlistRow({ symbol, onRemove }: { symbol: string; onRemove: () => void }) {
  const { quote, isLoading } = useStockQuote(symbol)
  const up = quote ? quote.change >= 0 : true

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10, flexShrink: 0,
          background: isLoading ? 'var(--color-surface-2)' : up ? '#f0fdf4' : '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800,
          color: isLoading ? 'var(--color-text-subtle)' : up ? '#15803d' : '#b91c1c',
        }}>
          {symbol.slice(0, 2)}
        </div>
        <div>
          <Link href={`/stocks/${symbol}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', textDecoration: 'none' }}>
            {symbol}
          </Link>
          {quote && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '2px 0 0', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{quote.name}</p>}
          {isLoading && <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', margin: '2px 0 0' }}>Loading…</p>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {quote && (
          <>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              {fmt(quote.price)}
            </span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: up ? '#f0fdf4' : '#fef2f2',
              color: up ? '#15803d' : '#b91c1c',
              borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700,
            }}>
              {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {up ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </div>
            <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
              Vol: {quote.volume >= 1e6 ? `${(quote.volume / 1e6).toFixed(1)}M` : `${(quote.volume / 1e3).toFixed(0)}K`}
            </span>
          </>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/stocks/${symbol}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: '#eff6ff', color: '#2563eb', textDecoration: 'none',
          }}>
            Chart <ArrowRight size={11} />
          </Link>
          <button onClick={onRemove} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            color: 'var(--color-text-subtle)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#fef2f2'; el.style.color = '#dc2626'; el.style.borderColor = '#fca5a5' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--color-surface)'; el.style.color = 'var(--color-text-subtle)'; el.style.borderColor = 'var(--color-border)' }}
            title="Remove from watchlist"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AddStockForm({ onAdd }: { onAdd: (s: string) => void }) {
  const [input, setInput] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const s = input.trim().toUpperCase()
    if (s) { onAdd(s); setInput('') }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add ticker… e.g. TSLA"
        style={{
          flex: 1, height: 40, padding: '0 14px',
          borderRadius: 10, border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface-2)', fontSize: 13,
          color: 'var(--color-text)', outline: 'none',
        }}
      />
      <button type="submit" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '0 16px', height: 40, borderRadius: 10, fontSize: 13, fontWeight: 700,
        background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer',
      }}>
        <Plus size={15} /> Add
      </button>
    </form>
  )
}

export default function WatchlistPage() {
  const { watchlist, addToWatchlist, removeFromWatchlist, clearWatchlist, loaded } = useWatchlist()

  if (!loaded) return null

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={18} color="#d97706" fill="#d97706" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              My Watchlist
            </h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
            Track stocks you're interested in. Click any row to view its chart.
          </p>
        </div>
        {watchlist.length > 0 && (
          <button onClick={clearWatchlist} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            color: 'var(--color-text-muted)', cursor: 'pointer',
          }}>
            <Trash2 size={13} /> Clear all
          </button>
        )}
      </div>

      {/* Add stock */}
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
          Add a stock
        </p>
        <AddStockForm onAdd={addToWatchlist} />
      </div>

      {/* Watchlist table */}
      {watchlist.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Star size={26} color="#d97706" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 8px' }}>
            Your watchlist is empty
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: '0 auto 20px', maxWidth: 340 }}>
            Add stocks above, or click the ⭐ Watch button on any stock page to start tracking it.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#2563eb', color: 'white', textDecoration: 'none' }}>
            Browse markets <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)', paddingLeft: 54 }}>Symbol</span>
            <div style={{ display: 'flex', gap: 80, paddingRight: 100 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>Price</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-subtle)' }}>Change</span>
            </div>
          </div>
          {watchlist.map(item => (
            <WatchlistRow key={item.symbol} symbol={item.symbol} onRemove={() => removeFromWatchlist(item.symbol)} />
          ))}
        </div>
      )}

      {/* Educational note */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: '16px 20px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookOpen size={15} color="#2563eb" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>What is a watchlist?</p>
          <p style={{ fontSize: 12, color: '#3b82f6', margin: 0, lineHeight: 1.7 }}>
            A watchlist lets you monitor stocks you're interested in without actually buying them.
            Professional investors use watchlists to track potential opportunities and monitor price movements before making a decision.
            Your watchlist is saved locally on your device.
          </p>
        </div>
      </div>
    </div>
  )
}