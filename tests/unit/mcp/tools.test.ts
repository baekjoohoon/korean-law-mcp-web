import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LawTools } from '../../../src/server/mcp/tools'
import { MCPClient } from '../../../src/server/mcp/client'

vi.mock('../../../src/server/mcp/client')

describe('LawTools', () => {
  let lawTools: LawTools
  let mockClient: vi.Mocked<MCPClient>

  beforeEach(() => {
    mockClient = new MCPClient() as vi.Mocked<MCPClient>
    lawTools = new LawTools(mockClient)
  })

  describe('searchLaw', () => {
    it('should search law with query', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '관세법 검색 결과' }],
      })

      const result = await lawTools.searchLaw('관세법', 20)

      expect(result).toBe('관세법 검색 결과')
      expect(mockClient.callTool).toHaveBeenCalledWith('search_law', {
        query: '관세법',
        display: 20,
      })
    })

    it('should use default display count', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '관세법 검색 결과' }],
      })

      await lawTools.searchLaw('관세법')
      expect(mockClient.callTool).toHaveBeenCalledWith('search_law', {
        query: '관세법',
        display: 20,
      })
    })
  })

  describe('getLawText', () => {
    it('should get law text with mst and jo', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '관세법 제 38 조 내용' }],
      })

      const result = await lawTools.getLawText('160001', '제 38 조')

      expect(result).toBe('관세법 제 38 조 내용')
      expect(mockClient.callTool).toHaveBeenCalledWith('get_law_text', {
        mst: '160001',
        jo: '제 38 조',
      })
    })

    it('should work without jo parameter', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '관세법 내용' }],
      })

      await lawTools.getLawText('160001')
      expect(mockClient.callTool).toHaveBeenCalledWith('get_law_text', {
        mst: '160001',
      })
    })
  })

  describe('searchPrecedents', () => {
    it('should search precedents with court filter', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '대법원 판례 결과' }],
      })

      const result = await lawTools.searchPrecedents('부당해고', '대법원', 20)

      expect(result).toBe('대법원 판례 결과')
      expect(mockClient.callTool).toHaveBeenCalledWith('search_precedents', {
        query: '부당해고',
        court: '대법원',
        display: 20,
      })
    })
  })

  describe('searchInterpretations', () => {
    it('should search interpretations', async () => {
      mockClient.callTool.mockResolvedValueOnce({
        content: [{ type: 'text', text: '근로기준법 해석례' }],
      })

      const result = await lawTools.searchInterpretations('근로기준법 제 74 조', 20)

      expect(result).toBe('근로기준법 해석례')
      expect(mockClient.callTool).toHaveBeenCalledWith('search_interpretations', {
        query: '근로기준법 제 74 조',
        display: 20,
      })
    })
  })
})
