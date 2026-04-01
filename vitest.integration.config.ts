import { defineConfig } from 'vitest/config'

// Vitest 설정 - 통합 테스트용
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['tests/unit/**', 'tests/e2e/**'],
    setupFiles: ['./tests/integration/setup.ts'],
    testTimeout: 10000,
  }
})
