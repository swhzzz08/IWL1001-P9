'use client'

import { useState, useEffect, useCallback } from 'react'
import { SUPPORTED_SYMBOLS } from '@/lib/stocks'

const STORAGE_KEY = 'marketwise_watchlist'

// List of stocks supported by your website
const VALID_SYMBOLS = [
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'META',
  'TSLA',
  'NVDA',
]

export interface WatchlistItem {
  symbol: string
  addedAt: string
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: WatchlistItem[] = JSON.parse(stored)

        // Remove any unsupported stocks that may already exist
        const filtered = parsed.filter(item =>
          VALID_SYMBOLS.includes(item.symbol.toUpperCase())
        )

        setWatchlist(filtered)
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error)
    }

    setLoaded(true)
  }, [])

  // Save watchlist to localStorage
  useEffect(() => {
    if (!loaded) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
    } catch (error) {
      console.error('Failed to save watchlist:', error)
    }
  }, [watchlist, loaded])

  const addToWatchlist = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase().trim()

    if (!upper) return

    // Prevent unsupported stocks from being added
    if (!VALID_SYMBOLS.includes(upper)) {
      console.warn(`${upper} is not a supported stock.`)
      return
    }

    if (!SUPPORTED_SYMBOLS.includes(upper)) return

    setWatchlist(prev => {
      if (prev.find(item => item.symbol === upper)) {
        return prev
      }

      return [
        ...prev,
        {
          symbol: upper,
          addedAt: new Date().toISOString(),
        },
      ]
    })
  }, [])

  const removeFromWatchlist = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase()

    setWatchlist(prev =>
      prev.filter(item => item.symbol !== upper)
    )
  }, [])

  const isWatched = useCallback(
    (symbol: string) => {
      return watchlist.some(
        item => item.symbol === symbol.toUpperCase()
      )
    },
    [watchlist]
  )

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
  }, [])

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    clearWatchlist,
    loaded,
  }
}