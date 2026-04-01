import { test as base, expect } from '@playwright/test'

export const test = base.extend<{
  loggedInPage: void
  authenticatedContext: {
    token: string
  }
}>({
  loggedInPage: async ({ page }, use) => {
    // 로그인 픽스처
    await page.goto('/login')
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/')

    await use()
  },
  authenticatedContext: async ({ page }, use) => {
    // 인증된 컨텍스트 픽스처
    await page.goto('/login')
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/')

    // 토큰 가져오기
    const token = await page.evaluate(() =>
      localStorage.getItem('auth_token')
    )

    await use({ token: token || '' })
  },
})

export { expect } from '@playwright/test'
