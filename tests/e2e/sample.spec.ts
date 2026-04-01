import { test, expect } from '@playwright/test'

test.describe('Sample E2E', () => {
  test('should load the page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/법률 검색/)
  })
})
