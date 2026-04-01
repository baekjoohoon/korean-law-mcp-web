import { test, expect } from '@playwright/test'

test.describe('법률 검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth API
    await page.route('/api/auth', async (route) => {
      const request = route.request()
      if (request.method() === 'POST') {
        const postData = await request.postDataJSON()
        if (postData.password === '0629') {
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

    // Mock search API
    await page.route('/api/search', async (route) => {
      const request = route.request()
      if (request.method() === 'POST') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            answer: '관세법은 수출입 물품에 대한 세금을 규정하는 법률입니다.',
            sources: [
              {
                type: 'law',
                title: '관세법',
                reference: '제1조',
                content: '관세는 수출입 물품에 부과한다.',
              },
            ],
            query: '관세법',
            timestamp: new Date().toISOString(),
          }),
        })
      }
    })

    // 로그인
    await page.goto('/login')
    await page.fill('[data-testid="password-input"]', '0629')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/')
  })

  test('검색 페이지에 접근할 수 있다', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('법률 검색 - 선우넷')
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
  })

  test('검색어를 입력할 수 있다', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', '관세법')
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('관세법')
  })

  test('검색 버튼이 비활성화된다 (빈 입력)', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', '')
    await expect(page.locator('[data-testid="search-button"]')).toBeDisabled()
  })

  test('최근 검색어가 로컬 스토리지에 저장된다', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', '관세법')
    await page.click('[data-testid="search-button"]')

    // 약간의 대기 (검색 완료)
    await page.waitForTimeout(500)

    // 로컬 스토리지 확인
    const recentSearches = await page.evaluate(() => localStorage.getItem('recent_searches'))
    expect(recentSearches).toBeTruthy()
    const searches = JSON.parse(recentSearches || '[]')
    expect(searches).toContain('관세법')
  })

  test('검색 기록을 삭제할 수 있다', async ({ page }) => {
    // 검색 수행
    await page.fill('[data-testid="search-input"]', '관세법')
    await page.click('[data-testid="search-button"]')
    await page.waitForTimeout(500)

    // 페이지 새로고침 (검색어 표시 확인용)
    await page.reload()
    await page.waitForTimeout(500)

    // 기록 삭제 버튼 클릭
    await page.click('[data-testid="clear-history-button"]')

    // 로컬 스토리지 확인
    const recentSearches = await page.evaluate(() => localStorage.getItem('recent_searches'))
    expect(recentSearches).toBeNull()
  })

  test('로딩 상태가 표시된다', async ({ page }) => {
    // 네트워크 지연 시뮬레이션
    await page.route('/api/search', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          answer: '테스트 답변',
          sources: [],
          query: '관세법',
          timestamp: new Date().toISOString(),
        }),
      })
    })

    await page.fill('[data-testid="search-input"]', '관세법')
    await page.click('[data-testid="search-button"]')

    // 로딩 상태 확인
    await expect(page.locator('[data-testid="loading"]')).toBeVisible()
  })

  test('모바일에서도 반응형으로 작동한다', async ({ page }) => {
    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="search-button"]')).toBeVisible()

    // 검색 수행
    await page.fill('[data-testid="search-input"]', '근로기준법')
    await page.click('[data-testid="search-button"]')

    // URL 변경 없음 (현재 페이지에 머무름)
    await expect(page).toHaveURL('/')
  })

  test('헤더에서 로그아웃할 수 있다', async ({ page }) => {
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('/login')
    await expect(page).toHaveURL('/login')
  })
})
