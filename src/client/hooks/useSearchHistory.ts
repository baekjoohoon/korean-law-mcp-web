import { useState, useEffect, useCallback } from 'react'

const MAX_HISTORY = 10
const STORAGE_KEY = 'recent_searches'

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse search history:', error)
      }
    }
  }, [])

  const addToHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(s => s !== query)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
