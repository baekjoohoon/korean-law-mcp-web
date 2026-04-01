import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return { isAuthenticated, isLoading }
}

/**
 * Hook to redirect authenticated users away from login
 */
export function useRedirectIfAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return { isAuthenticated, isLoading }
}
