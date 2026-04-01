import { describe, it, expect } from 'vitest'

describe('Integration Sample', () => {
  it('should work in Node environment', () => {
    expect(typeof process).toBe('object')
  })
})
