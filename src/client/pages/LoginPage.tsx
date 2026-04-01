import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLoginSubmit = useCallback(
    async (password: string) => {
      const result = await login(password)
      if (result.success) {
        // Explicit navigation after successful login
        navigate('/', { replace: true })
      }
      return result
    },
    [login, navigate],
  )

  return <Login onLoginSubmit={handleLoginSubmit} />
}
