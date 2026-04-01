import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  const handleLoginSubmit = useCallback(
    async (password: string) => {
      const result = await login(password)
      if (result.success) {
        // Explicitly navigate after successful login
        navigate('/', { replace: true })
      }
      return result
    },
    [login, navigate],
  )

  // Redirect if already authenticated (e.g., token in localStorage)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  return <Login onLoginSubmit={handleLoginSubmit} />
}
