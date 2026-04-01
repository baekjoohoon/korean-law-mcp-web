import { describe, it, expect } from 'vitest'
import {
  SYSTEM_PROMPT,
  createLegalQueryPrompt,
  createSearchRefinementPrompt,
  DISCLAIMER
} from '../../../src/server/qwen/prompts'

describe('Qwen Prompts', () => {
  describe('SYSTEM_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(SYSTEM_PROMPT).toBeDefined()
      expect(SYSTEM_PROMPT.length).toBeGreaterThan(0)
    })

    it('should contain Korean text', () => {
      expect(SYSTEM_PROMPT).toContain('대한민국')
      expect(SYSTEM_PROMPT).toContain('법률')
    })

    it('should include disclaimer requirement', () => {
      expect(SYSTEM_PROMPT).toContain('법적 조언이 아닌 정보 제공')
    })
  })

  describe('createLegalQueryPrompt', () => {
    it('should create a prompt with user question', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const prompt = createLegalQueryPrompt(question)
      
      expect(prompt).toContain('사용자 질문')
      expect(prompt).toContain(question)
    })

    it('should include law data when provided', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const lawData = '민법 제 543 조'
      const prompt = createLegalQueryPrompt(question, lawData)
      
      expect(prompt).toContain('관련 법령')
      expect(prompt).toContain(lawData)
    })

    it('should include precedents when provided', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const precedents = '대법원 2020 다 12345'
      const prompt = createLegalQueryPrompt(question, undefined, precedents)
      
      expect(prompt).toContain('관련 판례')
      expect(prompt).toContain(precedents)
    })

    it('should include interpretations when provided', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const interpretations = '법무부 해석례 2023-001'
      const prompt = createLegalQueryPrompt(question, undefined, undefined, interpretations)
      
      expect(prompt).toContain('관련 해석례')
      expect(prompt).toContain(interpretations)
    })

    it('should include all provided information', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const lawData = '민법 제 543 조'
      const precedents = '대법원 2020 다 12345'
      const interpretations = '법무부 해석례 2023-001'
      
      const prompt = createLegalQueryPrompt(question, lawData, precedents, interpretations)
      
      expect(prompt).toContain('사용자 질문')
      expect(prompt).toContain('관련 법령')
      expect(prompt).toContain('관련 판례')
      expect(prompt).toContain('관련 해석례')
    })
  })

  describe('createSearchRefinementPrompt', () => {
    it('should create a search refinement prompt', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const prompt = createSearchRefinementPrompt(question)
      
      expect(prompt).toContain(question)
      expect(prompt).toContain('검색할 키워드')
      expect(prompt).toContain('MCP 도구')
    })

    it('should request formatted output', () => {
      const question = '계약 해지 조건은 무엇인가요?'
      const prompt = createSearchRefinementPrompt(question)
      
      expect(prompt).toContain('1. 검색할 법령명')
      expect(prompt).toContain('2. 검색 키워드')
      expect(prompt).toContain('3. 추천 MCP 도구')
    })
  })

  describe('DISCLAIMER', () => {
    it('should be a non-empty string', () => {
      expect(DISCLAIMER).toBeDefined()
      expect(DISCLAIMER.length).toBeGreaterThan(0)
    })

    it('should contain warning symbol', () => {
      expect(DISCLAIMER).toContain('⚠️')
    })

    it('should mention AI-generated content', () => {
      expect(DISCLAIMER).toContain('AI 가 생성한 법률 정보')
    })

    it('should recommend professional consultation', () => {
      expect(DISCLAIMER).toContain('변호사')
      expect(DISCLAIMER).toContain('상담')
    })
  })
})
