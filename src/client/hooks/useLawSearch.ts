import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface SearchResult {
  success: boolean
  answer: string
  sources: Array<{
    type: string
    title: string
    preview: string
  }>
  fullSources?: Array<{
    type: string
    title: string
    content: string
  }>
  query: string
  timestamp: string
  error?: string
}

interface SearchCache {
  [query: string]: {
    result: SearchResult
    timestamp: number
  }
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useLawSearch() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [cache, setCache] = useState<SearchCache>({})

  const search = useCallback(async (query: string) => {
    if (!token) {
      setError('인증이 필요합니다')
      return
    }

    // Check cache first
    const cached = cache[query]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setResult(cached.result)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '검색 중 오류가 발생했습니다')
      }

      if (!data.success) {
        throw new Error(data.message || '검색에 실패했습니다')
      }

      const searchResult: SearchResult = {
        success: true,
        answer: data.answer,
        sources: data.sources || [],
        fullSources: data.fullSources || [],
        query: data.query,
        timestamp: data.timestamp,
      }

      setResult(searchResult)

      // Update cache
      setCache(prev => ({
        ...prev,
        [query]: {
          result: searchResult,
          timestamp: Date.now(),
        },
      }))

    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : '알 수 없는 오류가 발생했습니다'
      setError(errorMessage)
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }, [token, cache])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  const clearCache = useCallback(() => {
    setCache({})
  }, [])

  const refetch = useCallback(async () => {
    if (result?.query) {
      // Remove from cache and refetch
      setCache(prev => {
        const updated = { ...prev }
        delete updated[result.query]
        return updated
      })
      await search(result.query)
    }
  }, [result?.query, search])

  return {
    search,
    isLoading,
    error,
    result,
    clearError,
    clearResult,
    clearCache,
    refetch,
    hasCachedResult: (query: string) => {
      const cached = cache[query]
      return cached && Date.now() - cached.timestamp < CACHE_DURATION
    },
  }
}
