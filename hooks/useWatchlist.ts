'use client'

import { useCallback } from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { SUPPORTED_SYMBOLS } from '@/lib/stocks'

export interface WatchlistItem {
  symbol: string
  addedAt: string
}

interface WatchlistStockDTO {
  tickerSymbol: string
  addedAt: string
}

interface WatchlistDTO {
  id: number
  stocks: WatchlistStockDTO[]
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to load watchlist')
    return res.json() as Promise<WatchlistDTO[]>
  })

export function useWatchlist() {
  const { status } = useSession()
  const authenticated = status === 'authenticated'

  const { data, isLoading, mutate } = useSWR(
    authenticated ? '/api/watchlist' : null,
    fetcher
  )

  const watchlist: WatchlistItem[] = (data?.[0]?.stocks ?? []).map(s => ({
    symbol: s.tickerSymbol,
    addedAt: s.addedAt,
  }))

  const addToWatchlist = useCallback(async (symbol: string) => {
    if (!authenticated) return
    const upper = symbol.toUpperCase().trim()
    if (!upper || !SUPPORTED_SYMBOLS.includes(upper)) return
    if (watchlist.some(item => item.symbol === upper)) return

    await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: upper }),
    })
    mutate()
  }, [authenticated, watchlist, mutate])

  const removeFromWatchlist = useCallback(async (symbol: string) => {
    if (!authenticated) return
    await fetch('/api/watchlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: symbol.toUpperCase() }),
    })
    mutate()
  }, [authenticated, mutate])

  const isWatched = useCallback(
    (symbol: string) => watchlist.some(item => item.symbol === symbol.toUpperCase()),
    [watchlist]
  )

  const clearWatchlist = useCallback(async () => {
    if (!authenticated) return
    await Promise.all(
      watchlist.map(item =>
        fetch('/api/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: item.symbol }),
        })
      )
    )
    mutate()
  }, [authenticated, watchlist, mutate])

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    clearWatchlist,
    loaded: status !== 'loading' && !isLoading,
    requiresAuth: status === 'unauthenticated',
  }
}
