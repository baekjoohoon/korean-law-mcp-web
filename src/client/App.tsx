import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // Force re-check auth on every render
  const isAuth =
    isAuthenticated ||
    (typeof window !== 'undefined' && localStorage.getItem('auth_token') !== null)

  return (
    <Routes>
      <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={isAuth ? <SearchPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
