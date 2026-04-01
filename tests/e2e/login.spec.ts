import { test, expect } from '@playwright/test'

test.describe('로그인 기능', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/auth', async (route) => {
      const request = route.request()
      if (request.method() === 'POST') {
        const postData = await request.postDataJSON()
        if (postData.password === '0629') {
          // Generate a valid token
          const tokenData = {
            timestamp: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            userId: 'user-001',
          }
          const token = btoa(JSON.stringify(tokenData))
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true, token }),
          })
        } else {
          await route.fulfill({
            status: 401,
            body: JSON.stringify({
              success: false,
              message: '비밀번호가 일치하지 않습니다',
            }),
          })
        }
      } else {
        await route.continue()
      }
    })

    await page.goto('/')
  })

  test('로그인 페이지로 리디렉션된다', async ({ page }) => {
    await expect(page).toHaveURL('/login')
    await expect(page.locator('h1')).toContainText('법률 검색')
  })

  test('올바른 비밀번호로 로그인할 수 있다', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')

    // 대기 후 URL 확인
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('법률 검색 - 서우넷')
  })

  test('잘못된 비밀번호로 실패한다', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', 'wrong')
    await page.click('[data-testid="login-button"]')

    // 에러 메시지 확인
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('비밀번호가 일치하지 않습니다')
    await expect(page).toHaveURL('/login')
  })

  test('빈 비밀번호로 제출할 수 없다', async ({ page }) => {
    await page.click('[data-testid="login-button"]')

    // HTML5 validation 이 작동해야 함
    await expect(page.locator('[data-testid="password-input"]'))
      .toHaveAttribute('required')
  })

  test('로그아웃 후 다시 로그인할 수 있다', async ({ page }) => {
    // 로그인
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/')
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // 검색 페이지로 이동 확인 - h1 텍스트로 확인
    await expect(page.locator('h1')).toContainText('법률 검색 - 서우넷')

    // 로그아웃
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('/login')

    // 다시 로그인
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('로딩 상태가 표시된다', async ({ page }) => {
    // 네트워크 지연 시뮬레이션
    await page.route('/api/auth', async (route) => {
      const request = route.request()
      if (request.method() === 'POST') {
        const postData = await request.postDataJSON()
        if (postData.password === '0629') {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const tokenData = {
            timestamp: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            userId: 'user-001',
          }
          const token = btoa(JSON.stringify(tokenData))
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ success: true, token }),
          })
        }
      }
    })

    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')

    // 로딩 상태 확인 (버튼 텍스트 변경)
    await expect(page.locator('[data-testid="login-button"]'))
      .toContainText('로그인 중...')
  })
})
