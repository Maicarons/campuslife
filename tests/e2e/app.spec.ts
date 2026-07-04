import { test, expect } from '@playwright/test'

test.describe('CampusLife App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CampusLife/)
  })

  test('should render the sidebar with all modules', async ({ page }) => {
    await page.goto('/')
    // Wait for sidebar to be visible
    await page.waitForSelector('.app-sidebar', { timeout: 5000 })
    
    const sidebar = page.locator('.app-sidebar')
    await expect(sidebar).toBeVisible()
    
    // Check that menu items are rendered
    const menuItems = page.locator('.menu-item')
    const count = await menuItems.count()
    expect(count).toBeGreaterThanOrEqual(6)
  })

  test('should navigate to AI Assistant page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.app-sidebar')
    
    // Click on AI Assistant menu item
    await page.click('text=AI 助手')
    await page.waitForTimeout(500)
    
    // Check that the assistant view is loaded
    await expect(page.locator('.assistant-view, .chat-panel, .main-content')).toBeVisible()
  })

  test('should navigate to Academics page', async ({ page }) => {
    await page.goto('/academics')
    await page.waitForSelector('.academics-view', { timeout: 5000 })
    await expect(page.locator('.academics-view')).toBeVisible()
  })

  test('should navigate to Campus Info page', async ({ page }) => {
    await page.goto('/campus')
    await page.waitForSelector('.campus-view', { timeout: 5000 })
    await expect(page.locator('.campus-view')).toBeVisible()
  })

  test('should navigate to Finance page', async ({ page }) => {
    await page.goto('/finance')
    await page.waitForSelector('.finance-view', { timeout: 5000 })
    await expect(page.locator('.finance-view')).toBeVisible()
  })

  test('should navigate to Lost & Found page', async ({ page }) => {
    await page.goto('/lost-found')
    await page.waitForSelector('.lost-found-view', { timeout: 5000 })
    await expect(page.locator('.lost-found-view')).toBeVisible()
  })

  test('should navigate to Marketplace page', async ({ page }) => {
    await page.goto('/marketplace')
    await page.waitForSelector('.marketplace-view', { timeout: 5000 })
    await expect(page.locator('.marketplace-view')).toBeVisible()
  })

  test('should navigate to Q&A page', async ({ page }) => {
    await page.goto('/qa')
    await page.waitForSelector('.qa-view', { timeout: 5000 })
    await expect(page.locator('.qa-view')).toBeVisible()
  })

  test('should navigate to Social page', async ({ page }) => {
    await page.goto('/social')
    await page.waitForSelector('.social-view', { timeout: 5000 })
    await expect(page.locator('.social-view')).toBeVisible()
  })

  test('should navigate to Health page', async ({ page }) => {
    await page.goto('/health')
    await page.waitForSelector('.health-view', { timeout: 5000 })
    await expect(page.locator('.health-view')).toBeVisible()
  })

  test('should navigate to Volunteer page', async ({ page }) => {
    await page.goto('/volunteer')
    await page.waitForSelector('.volunteer-view', { timeout: 5000 })
    await expect(page.locator('.volunteer-view')).toBeVisible()
  })

  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.waitForSelector('.not-found, .el-result', { timeout: 5000 })
    // Should show some kind of not found indication
    const content = await page.textContent('body')
    expect(content).toMatch(/404|找不到|Not Found/i)
  })

  test('should navigate between pages via sidebar', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.app-sidebar')
    
    // Navigate to Finance
    await page.click('text=财务管理')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/finance')
    
    // Navigate to Health
    await page.click('text=健康管理')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/health')
    
    // Navigate back to AI Assistant
    await page.click('text=AI 助手')
    await page.waitForTimeout(500)
    expect(page.url()).toContain('/assistant')
  })

  test('should have working sidebar collapse button', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.app-sidebar')
    
    // Get initial sidebar width
    const sidebar = page.locator('.app-sidebar')
    const initialWidth = await sidebar.evaluate(el => el.offsetWidth)
    
    // Click collapse button
    const collapseBtn = page.locator('.sidebar-footer button')
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click()
      await page.waitForTimeout(500)
      
      // Sidebar should be narrower
      const collapsedWidth = await sidebar.evaluate(el => el.offsetWidth)
      expect(collapsedWidth).toBeLessThan(initialWidth)
    }
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForSelector('.auth-view', { timeout: 5000 })
    
    // Should have login form
    await expect(page.locator('.auth-view')).toBeVisible()
    const content = await page.textContent('.auth-view')
    expect(content).toContain('CampusLife')
  })
})
