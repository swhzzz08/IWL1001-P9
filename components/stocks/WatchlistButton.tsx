'use client'
import { useWatchlist } from '@/hooks/useWatchlist'
import { Star } from 'lucide-react'
import { useState } from 'react'

export function WatchlistButton({ symbol }: { symbol: string }) {
  const { isWatched, addToWatchlist, removeFromWatchlist, requiresAuth } = useWatchlist()
  const [animating, setAnimating] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const watched = isWatched(symbol)

  function toggle() {
    if (requiresAuth) {
      setShowPrompt(true)
      return
    }
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)
    if (watched) removeFromWatchlist(symbol)
    else addToWatchlist(symbol)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggle} title={watched ? 'Remove from watchlist' : 'Add to watchlist'} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
        cursor: 'pointer', transition: 'all 0.2s',
        border: `2px solid ${watched ? '#0d9488' : 'var(--color-border)'}`,
        background: watched ? '#f0fdfa' : 'var(--color-surface)',
        color: watched ? '#0f766e' : 'var(--color-text-muted)',
        transform: animating ? 'scale(0.92)' : 'scale(1)',
      }}>
        <Star size={15} fill={watched ? '#0d9488' : 'none'} color={watched ? '#0d9488' : 'var(--color-text-subtle)'} style={{ transition: 'all 0.2s' }} />
        {watched ? 'Watching' : 'Watch'}
      </button>

      {showPrompt && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 20,
          minWidth: 220, background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '12px 14px',
        }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
            Log in to save stocks to your watchlist.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/auth/login" style={{
              fontSize: 13, fontWeight: 700, color: 'white', textDecoration: 'none',
              background: 'linear-gradient(135deg, #0f766e, #0d9488)', borderRadius: 8, padding: '6px 12px',
            }}>
              Log in
            </a>
            <button onClick={() => setShowPrompt(false)} style={{
              fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 4px',
            }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}