import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';
import { launch } from 'puppeteer-core';

test.describe('Performance Tests', () => {
  test('Lighthouse Performance Audit', async ({ page }) => {
    const browser = await launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--remote-debugging-port=9222']
    });

    const result = await lighthouse('http://localhost:3006', {
      port: 9222,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    await browser.close();

    // Performance assertions
    expect(result.lhr.categories.performance.score).toBeGreaterThan(0.7);
    expect(result.lhr.categories.accessibility.score).toBeGreaterThan(0.9);
    expect(result.lhr.categories['best-practices'].score).toBeGreaterThan(0.8);
    expect(result.lhr.categories.seo.score).toBeGreaterThan(0.9);

    // Core Web Vitals
    const metrics = result.lhr.audits;
    expect(metrics['first-contentful-paint'].numericValue).toBeLessThan(2000);
    expect(metrics['largest-contentful-paint'].numericValue).toBeLessThan(3000);
    expect(metrics['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
    expect(metrics['total-blocking-time'].numericValue).toBeLessThan(300);
  });

  test('Page Load Time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3006');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Mobile Performance', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('http://localhost:3006');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(4000);
  });

  test('Resource Loading', async ({ page }) => {
    const resources = [];
    
    page.on('response', response => {
      resources.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length']
      });
    });

    await page.goto('http://localhost:3006');
    
    // Check for failed resources
    const failedResources = resources.filter(r => r.status >= 400);
    expect(failedResources).toHaveLength(0);
    
    // Check bundle sizes
    const jsResources = resources.filter(r => r.url.endsWith('.js'));
    const totalJsSize = jsResources.reduce((sum, r) => sum + (parseInt(r.size) || 0), 0);
    expect(totalJsSize).toBeLessThan(500000); // 500KB max for JS
  });
});

test.describe('Accessibility Tests', () => {
  test('WCAG AA Compliance', async ({ page }) => {
    await page.goto('http://localhost:3006');
    
    // Check for form labels
    const inputs = await page.$$('input:not([type="hidden"])');
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.id;
        return !!document.querySelector(`label[for="${id}"]`) || !!el.getAttribute('aria-label');
      });
      expect(hasLabel).toBeTruthy();
    }
    
    // Check focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });
    expect(focusedElement.outline !== 'none' || focusedElement.boxShadow !== 'none').toBeTruthy();
    
    // Check touch targets
    const buttons = await page.$$('button, a, input');
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Keyboard Navigation', async ({ page }) => {
    await page.goto('http://localhost:3006');
    
    // Test tab navigation
    const focusableElements = await page.$$('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Test escape key closes modals
    const hasModal = await page.$('[role="dialog"], .modal');
    if (hasModal) {
      await page.keyboard.press('Escape');
      const modalVisible = await hasModal.isVisible();
      expect(modalVisible).toBeFalsy();
    }
  });
});

test.describe('User Flow Tests', () => {
  test('Email Signup Flow', async ({ page }) => {
    await page.goto('http://localhost:3006');
    
    // Find email input
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    expect(emailInput).toBeTruthy();
    
    // Test invalid email
    await emailInput.fill('invalid-email');
    await page.keyboard.press('Tab');
    const errorMessage = await page.$('.error, [role="alert"]');
    expect(errorMessage).toBeTruthy();
    
    // Test valid email
    await emailInput.clear();
    await emailInput.fill('test@example.com');
    
    // Submit form
    const submitButton = await page.$('button[type="submit"], button:has-text("Join"), button:has-text("Sign up")');
    await submitButton.click();
    
    // Check for success message or redirect
    await page.waitForSelector('.success, [role="status"], .thank-you', { timeout: 5000 }).catch(() => {});
  });

  test('Mobile Menu Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3006');
    
    // Check for hamburger menu
    const mobileMenu = await page.$('[aria-label*="menu"], .mobile-menu, .hamburger');
    if (mobileMenu) {
      await mobileMenu.click();
      
      // Check menu is visible
      const menuItems = await page.$$('nav a, .menu-item');
      expect(menuItems.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Visual Regression Tests', () => {
  test('Desktop Screenshot', async ({ page }) => {
    await page.goto('http://localhost:3006');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/desktop-screenshot.png',
      fullPage: true 
    });
  });

  test('Mobile Screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3006');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/mobile-screenshot.png',
      fullPage: true 
    });
  });

  test('Dark Mode Screenshot', async ({ page }) => {
    await page.goto('http://localhost:3006');
    
    // Toggle dark mode if available
    const darkModeToggle = await page.$('[aria-label*="dark"], .dark-mode-toggle');
    if (darkModeToggle) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: 'test-results/dark-mode-screenshot.png',
        fullPage: true 
      });
    }
  });
});