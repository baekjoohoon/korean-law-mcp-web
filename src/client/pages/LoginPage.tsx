import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSubmit = useCallback(
    async (password: string) => {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })

        const data = await response.json()

        if (data.success) {
          // Direct localStorage manipulation
          localStorage.setItem('auth_token', data.token)

          // Force reload to ensure App.tsx picks up the token
          window.location.href = '/'

          return { success: true }
        } else {
          return {
            success: false,
            message: data.message || '로그인에 실패했습니다',
          }
        }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          message: '네트워크 오류가 발생했습니다',
        }
      }
    },
    [navigate],
  )

  return <Login onLoginSubmit={handleLoginSubmit} />
}
