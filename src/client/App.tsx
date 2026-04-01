import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'

function App() {
  // Synchronous localStorage check - NO race condition
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('auth_token') !== null

  // Render immediately based on localStorage
  return (
    <Routes>
      <Route path="/login" element={!hasToken ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={hasToken ? <SearchPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
