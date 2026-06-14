'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'marketwise_watchlist'

export interface WatchlistItem {
  symbol: string
  addedAt: string
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setWatchlist(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
    } catch {}
  }, [watchlist, loaded])

  const addToWatchlist = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase().trim()
    if (!upper) return
    setWatchlist(prev => {
      if (prev.find(i => i.symbol === upper)) return prev
      return [...prev, { symbol: upper, addedAt: new Date().toISOString() }]
    })
  }, [])

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(i => i.symbol !== symbol.toUpperCase()))
  }, [])

  const isWatched = useCallback((symbol: string) => {
    return watchlist.some(i => i.symbol === symbol.toUpperCase())
  }, [watchlist])

  const clearWatchlist = useCallback(() => setWatchlist([]), [])

  return { watchlist, addToWatchlist, removeFromWatchlist, isWatched, clearWatchlist, loaded }
}