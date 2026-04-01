import { describe, it, expect } from 'vitest'

describe('Sample Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
  
  it('should handle Korean text', () => {
    const text = '법률 검색'
    expect(text).toContain('법률')
  })
})
