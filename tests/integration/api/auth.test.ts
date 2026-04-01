import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock MCP and Qwen clients
vi.mock('@server/mcp/client')
vi.mock('@server/qwen/client')

describe('Auth API Integration', () => {
  const BASE_URL = 'http://localhost:8788'

  describe('POST /api/auth', () => {
    it('should return success with correct password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '0629' }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.token).toBeDefined()
      expect(data.message).toBe('로그인 성공')
    })

    it('should return 401 with wrong password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'wrong' }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.message).toBe('비밀번호가 일치하지 않습니다')
    })

    it('should return 400 with missing password', async () => {
      const response = await fetch(`${BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
    })

    it('should return 405 with GET method', async () => {
      const response = await fetch(`${BASE_URL}/api/auth`, {
        method: 'GET',
      })

      expect(response.status).toBe(405)
    })

    it('should return token with valid structure', async () => {
      const response = await fetch(`${BASE_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '0629' }),
      })

      const data = await response.json()
      const decoded = atob(data.token)
      const tokenData = JSON.parse(decoded)

      expect(tokenData.timestamp).toBeDefined()
      expect(tokenData.expiresAt).toBeDefined()
      expect(tokenData.expiresAt).toBeGreaterThan(tokenData.timestamp)
    })
  })
})
