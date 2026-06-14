'use client'

import { useWatchlist } from '@/hooks/useWatchlist'
import { Star } from 'lucide-react'
import { useState } from 'react'

export function WatchlistButton({ symbol }: { symbol: string }) {
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [animating, setAnimating] = useState(false)
  const watched = isWatched(symbol)

  function toggle() {
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)
    if (watched) removeFromWatchlist(symbol)
    else addToWatchlist(symbol)
  }

  return (
    <button
      onClick={toggle}
      title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
        cursor: 'pointer', transition: 'all 0.2s',
        border: `2px solid ${watched ? '#f59e0b' : 'var(--color-border)'}`,
        background: watched ? '#fffbeb' : 'var(--color-surface)',
        color: watched ? '#d97706' : 'var(--color-text-muted)',
        transform: animating ? 'scale(0.92)' : 'scale(1)',
      }}
    >
      <Star
        size={15}
        fill={watched ? '#f59e0b' : 'none'}
        color={watched ? '#f59e0b' : 'var(--color-text-subtle)'}
        style={{ transition: 'all 0.2s' }}
      />
      {watched ? 'Watching' : 'Watch'}
    </button>
  )
}