import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MCPClient } from '../../../src/server/mcp/client'

// Create a proper mock Headers class
class MockHeaders {
  private headers: Map<string, string>

  constructor(init?: Record<string, string>) {
    this.headers = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value)
      })
    }
  }

  get(name: string): string | null {
    return this.headers.get(name.toLowerCase()) || null
  }
}

// Mock fetch
global.fetch = vi.fn()
global.Headers = vi.fn().mockImplementation((init) => new MockHeaders(init)) as any

describe('MCPClient', () => {
  let client: MCPClient

  beforeEach(() => {
    client = new MCPClient()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await client.disconnect()
  })

  describe('initialize', () => {
    it('should initialize connection successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        headers: new MockHeaders({ 'Mcp-Session-Id': 'test-session-123' }),
        json: async () => ({
          jsonrpc: '2.0',
          id: 1,
          result: { protocolVersion: '2025-06-18' },
        }),
      } as Response)

      await client.initialize()

      expect(fetch).toHaveBeenCalledWith(
        'https://korean-law-mcp.fly.dev/mcp',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'MCP-Protocol-Version': '2025-06-18',
          }),
        })
      )
    })

    it('should throw error on failed initialization', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(client.initialize()).rejects.toThrow('MCP initialization failed')
    })
  })

  describe('callTool', () => {
    beforeEach(async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        headers: new MockHeaders({ 'Mcp-Session-Id': 'test-session-123' }),
        json: async () => ({
          jsonrpc: '2.0',
          id: 1,
          result: { protocolVersion: '2025-06-18' },
        }),
      } as Response)
      await client.initialize()
    })

    it('should call search_law tool successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 2,
          result: {
            content: [{ type: 'text', text: '검색 결과: 관세법' }],
          },
        }),
      } as Response)

      const result = await client.callTool('search_law', { query: '관세법', display: 20 })

      expect(result.content[0].text).toBe('검색 결과: 관세법')
      expect(fetch).toHaveBeenCalledWith(
        'https://korean-law-mcp.fly.dev/mcp',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Mcp-Session-Id': 'test-session-123',
          }),
        })
      )
    })

    it('should throw error on tool call failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(client.callTool('search_law', { query: '관세법' }))
        .rejects.toThrow('MCP tool call failed')
    })

    it('should handle MCP error response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 2,
          error: { code: -32602, message: 'Invalid params' },
        }),
      } as Response)

      await expect(client.callTool('search_law', { query: '관세법' }))
        .rejects.toThrow('MCP error: Invalid params')
    })

    it('should throw error on session expired (401)', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      await expect(client.callTool('search_law', { query: '관세법' }))
        .rejects.toThrow('MCP tool call failed: 401')
    })
  })
})
