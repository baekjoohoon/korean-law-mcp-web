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
        // Force storage event to trigger re-render in App.tsx
        window.localStorage.setItem('auth_token', window.localStorage.getItem('auth_token') || '')
        window.dispatchEvent(new Event('storage'))

        // Small delay to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 50))

        // Explicit navigation after successful login
        navigate('/', { replace: true })
      }
      return result
    },
    [login, navigate],
  )

  return <Login onLoginSubmit={handleLoginSubmit} />
}
