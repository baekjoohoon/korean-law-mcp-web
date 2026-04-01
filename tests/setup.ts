import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global mocks
global.fetch = vi.fn()
global.Headers = vi.fn()
global.Request = vi.fn()
global.Response = vi.fn()

// Mock console.error in tests to reduce noise
vi.spyOn(console, 'error').mockImplementation(() => {})
