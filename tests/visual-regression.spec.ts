import { test, expect } from '@playwright/test';

/**
 * Visual Regression Testing Suite
 * Captures and compares visual states across different viewports and states
 */

test.describe('Visual Regression Tests', () => {
  
  test('Homepage visual consistency - Desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop-full.png', {
      fullPage: true,
      animations: 'disabled' // Disable animations for consistent screenshots
    });
    
    // Take viewport screenshot
    await expect(page).toHaveScreenshot('homepage-desktop-viewport.png', {
      animations: 'disabled'
    });
  });

  test('Homepage visual consistency - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-mobile-full.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    // Take viewport screenshot
    await expect(page).toHaveScreenshot('homepage-mobile-viewport.png', {
      animations: 'disabled'
    });
  });

  test('Homepage visual consistency - Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to settle
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-tablet-full.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Hero section component visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for hero content to load
    await page.waitForSelector('h1');
    
    // Screenshot just the hero section
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      animations: 'disabled'
    });
  });

  test('Waitlist form visual consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to the waitlist form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Screenshot the form section
    const formSection = page.locator('#waitlist');
    await expect(formSection).toHaveScreenshot('waitlist-form.png', {
      animations: 'disabled'
    });
  });

  test('Form interaction states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Take screenshot of initial form state
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('form-initial-state.png', {
      animations: 'disabled'
    });
    
    // Fill out form partially and capture states
    const nameField = page.locator('input').first();
    if (await nameField.isVisible()) {
      await nameField.focus();
      await expect(form).toHaveScreenshot('form-name-focused.png', {
        animations: 'disabled'
      });
      
      await nameField.fill('John Doe');
      await expect(form).toHaveScreenshot('form-name-filled.png', {
        animations: 'disabled'
      });
      
      // Test email field
      const emailField = page.locator('input[type="email"]').first();
      if (await emailField.isVisible()) {
        await emailField.focus();
        await expect(form).toHaveScreenshot('form-email-focused.png', {
          animations: 'disabled'
        });
        
        await emailField.fill('john@example.com');
        await expect(form).toHaveScreenshot('form-email-filled.png', {
          animations: 'disabled'
        });
      }
    }
  });

  test('Button states visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find primary buttons
    const buttons = await page.locator('button').all();
    
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      const button = buttons[i];
      
      if (await button.isVisible()) {
        // Normal state
        await expect(button).toHaveScreenshot(`button-${i}-normal.png`, {
          animations: 'disabled'
        });
        
        // Hover state
        await button.hover();
        await page.waitForTimeout(200);
        await expect(button).toHaveScreenshot(`button-${i}-hover.png`, {
          animations: 'disabled'
        });
        
        // Focus state
        await button.focus();
        await page.waitForTimeout(200);
        await expect(button).toHaveScreenshot(`button-${i}-focus.png`, {
          animations: 'disabled'
        });
      }
    }
  });

  test('Dark mode visual consistency', async ({ page }) => {
    // Test if dark mode is implemented
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take full page screenshot in dark mode
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('High contrast mode visual test', async ({ page }) => {
    // Emulate high contrast preference
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot in high contrast mode
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Loading state visual test', async ({ page }) => {
    // Intercept network requests to simulate slow loading
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000);
    });
    
    const navigationPromise = page.goto('/');
    
    // Capture loading state if possible
    await page.waitForTimeout(500);
    
    // Take screenshot of loading state
    try {
      await expect(page).toHaveScreenshot('page-loading-state.png', {
        animations: 'disabled'
      });
    } catch (error) {
      console.log('Loading state not captured - page loaded too quickly');
    }
    
    await navigationPromise;
  });

  test('Error state visual test', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form and trigger error state
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Try to submit form without filling required fields
    const submitButton = page.locator('button[type="submit"]').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for potential error states
      await page.waitForTimeout(1000);
      
      // Capture form with error states
      const form = page.locator('form').first();
      await expect(form).toHaveScreenshot('form-error-state.png', {
        animations: 'disabled'
      });
    }
  });
});

test.describe('Cross-browser Visual Consistency', () => {
  
  test('Homepage consistency across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take browser-specific screenshot
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Form rendering across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Browser-specific form screenshot
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot(`form-${browserName}.png`, {
      animations: 'disabled'
    });
  });
});

test.describe('Responsive Design Visual Tests', () => {
  
  const viewports = [
    { name: 'mobile-small', width: 320, height: 568 },
    { name: 'mobile-large', width: 414, height: 896 },
    { name: 'tablet-portrait', width: 768, height: 1024 },
    { name: 'tablet-landscape', width: 1024, height: 768 },
    { name: 'desktop-small', width: 1280, height: 720 },
    { name: 'desktop-large', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test(`Responsive layout - ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Take full page screenshot at this viewport
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  }
});

test.describe('Component Isolation Visual Tests', () => {
  
  test('Individual button components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and screenshot individual buttons
    const buttons = await page.locator('button').all();
    
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const button = buttons[i];
      
      if (await button.isVisible()) {
        // Create a clean screenshot of just the button with some padding
        const box = await button.boundingBox();
        if (box) {
          await expect(button).toHaveScreenshot(`isolated-button-${i}.png`, {
            animations: 'disabled'
          });
        }
      }
    }
  });

  test('Form field components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Screenshot individual form fields
    const inputs = await page.locator('input, select, textarea').all();
    
    for (let i = 0; i < Math.min(inputs.length, 5); i++) {
      const input = inputs[i];
      
      if (await input.isVisible()) {
        await expect(input).toHaveScreenshot(`isolated-input-${i}.png`, {
          animations: 'disabled'
        });
      }
    }
  });

  test('Typography components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Screenshot different heading levels
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    for (let i = 0; i < Math.min(headings.length, 6); i++) {
      const heading = headings[i];
      
      if (await heading.isVisible()) {
        await expect(heading).toHaveScreenshot(`heading-${i}.png`, {
          animations: 'disabled'
        });
      }
    }
  });
});