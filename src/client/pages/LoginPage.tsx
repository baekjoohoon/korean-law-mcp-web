import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleLoginSubmit = async (password: string) => {
    const result = await login(password)
    return result
  }

  return <Login onLoginSubmit={handleLoginSubmit} />
}
