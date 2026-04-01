import { describe, it, expect } from 'vitest'
import { QwenClient } from '../../../src/server/qwen/client'

describe('QwenClient', () => {
  it('should export QwenClient class', () => {
    expect(QwenClient).toBeDefined()
    expect(typeof QwenClient).toBe('function')
  })

  it('should have chatCompletion method', () => {
    const client = new QwenClient()
    expect(typeof client.chatCompletion).toBe('function')
  })

  it('should have chatCompletionStream method', () => {
    const client = new QwenClient()
    expect(typeof client.chatCompletionStream).toBe('function')
  })
})
