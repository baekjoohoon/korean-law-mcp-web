import { useState, useEffect, useCallback } from 'react'

export interface TokenData {
  timestamp: number
  expiresAt: number
  userId: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)

  const checkAuth = useCallback(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      try {
        const decoded = atob(storedToken)
        const data = JSON.parse(decoded) as TokenData

        // Check if token is expired
        if (Date.now() < data.expiresAt) {
          setToken(storedToken)
          setTokenData(data)
          setIsAuthenticated(true)
          setIsLoading(false)
          return true
        } else {
          // Token expired
          localStorage.removeItem('auth_token')
          setToken(null)
          setTokenData(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Invalid token
        console.error('Token validation error:', error)
        localStorage.removeItem('auth_token')
        setToken(null)
        setTokenData(null)
        setIsAuthenticated(false)
      }
    } else {
      setToken(null)
      setTokenData(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    return false
  }, [])

  useEffect(() => {
    checkAuth()

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuth()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Check token expiry every minute
    const expiryCheck = setInterval(checkAuth, 60000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(expiryCheck)
    }
  }, [checkAuth])

  const login = useCallback(async (password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.token)
        setToken(data.token)

        // Parse and store token data
        const decoded = atob(data.token)
        const parsed = JSON.parse(decoded) as TokenData
        setTokenData(parsed)

        setIsAuthenticated(true)

        // Notify other tabs
        window.dispatchEvent(new Event('storage'))

        return { success: true }
      } else {
        return {
          success: false,
          message: data.message || '로그인에 실패했습니다'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다'
      }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setTokenData(null)
    setIsAuthenticated(false)

    // Notify other tabs
    window.dispatchEvent(new Event('storage'))
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    // For now, just re-validate existing token
    // Could be extended to call refresh endpoint
    return checkAuth()
  }, [checkAuth])

  return {
    isAuthenticated,
    isLoading,
    token,
    tokenData,
    login,
    logout,
    refreshToken,
    checkAuth,
  }
}
