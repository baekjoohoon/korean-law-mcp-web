import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  // Check localStorage immediately (synchronous)
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('auth_token') !== null

  // Use localStorage check as primary, isAuthenticated as secondary
  const isAuth = hasToken || isAuthenticated

  // Show loading state only if no token exists
  if (isLoading && !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={isAuth ? <SearchPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
