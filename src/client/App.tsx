import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SearchPage from './pages/SearchPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default App
