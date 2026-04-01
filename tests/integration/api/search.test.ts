import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@server/mcp/client')
vi.mock('@server/qwen/client')

describe('Search API Integration', () => {
  const BASE_URL = 'http://localhost:8788'

  describe('POST /api/search', () => {
    it('should return search results', async () => {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '관세법 제 38 조',
          token: 'valid-token',
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.answer).toBeDefined()
      expect(data.sources).toBeDefined()
      expect(Array.isArray(data.sources)).toBe(true)
    })

    it('should return 401 without token', async () => {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '관세법' }),
      })

      expect(response.status).toBe(401)
    })

    it('should return 400 with invalid token', async () => {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '관세법',
          token: 'invalid-token',
        }),
      })

      expect(response.status).toBe(401)
    })

    it('should return 400 with missing query', async () => {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'valid-token' }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/search', () => {
    it('should return 405 for GET requests', async () => {
      const response = await fetch(`${BASE_URL}/api/search?query=관세법`)

      expect(response.status).toBe(405)
    })
  })
})
