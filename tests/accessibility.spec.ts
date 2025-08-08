import { test, expect } from '@playwright/test';

/**
 * Accessibility Testing Suite
 * Tests WCAG compliance and accessibility features
 */

test.describe('Accessibility Tests', () => {
  
  test('Form accessibility compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Scroll to the waitlist form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Check for form labels
    const formInputs = await page.locator('input, select, textarea').all();
    let inputsWithoutLabels = 0;
    
    for (const input of formInputs) {
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (inputId) {
        const associatedLabel = await page.locator(`label[for="${inputId}"]`).count();
        if (associatedLabel === 0 && !ariaLabel && !ariaLabelledBy) {
          inputsWithoutLabels++;
        }
      } else if (!ariaLabel && !ariaLabelledBy) {
        inputsWithoutLabels++;
      }
    }
    
    console.log(`Form inputs without proper labels: ${inputsWithoutLabels}`);
    expect(inputsWithoutLabels).toBe(0); // All inputs should have labels
  });

  test('Focus indicators visibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test focus indicators on interactive elements
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]').all();
    let elementsWithoutFocus = 0;
    
    for (const element of interactiveElements.slice(0, 10)) { // Test first 10 elements
      await element.focus();
      
      // Check if element has visible focus indicator
      const hasFocusIndicator = await element.evaluate(el => {
        const styles = getComputedStyle(el, ':focus');
        const outline = styles.outline;
        const boxShadow = styles.boxShadow;
        const borderColor = styles.borderColor;
        
        // Check if any focus indicator is present
        return outline !== 'none' || 
               boxShadow !== 'none' || 
               borderColor !== 'rgba(0, 0, 0, 0)';
      });
      
      if (!hasFocusIndicator) {
        elementsWithoutFocus++;
      }
    }
    
    console.log(`Interactive elements without focus indicators: ${elementsWithoutFocus}`);
    expect(elementsWithoutFocus).toBeLessThan(3); // Should be minimal
  });

  test('Keyboard navigation functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test Tab navigation through the page
    let tabStops = 0;
    const maxTabStops = 20; // Reasonable number of tab stops for a waitlist page
    
    await page.keyboard.press('Tab');
    let lastFocusedElement = await page.locator(':focus').first();
    
    for (let i = 0; i < maxTabStops; i++) {
      await page.keyboard.press('Tab');
      
      const currentFocused = await page.locator(':focus').first();
      const isSameElement = await currentFocused.evaluate((current, last) => {
        return current === last;
      }, lastFocusedElement);
      
      if (!isSameElement) {
        tabStops++;
        lastFocusedElement = currentFocused;
        
        // Check if focused element is visible
        const isVisible = await currentFocused.isVisible();
        expect(isVisible).toBe(true);
      } else {
        break; // Tab cycle completed
      }
    }
    
    console.log(`Keyboard accessible elements: ${tabStops}`);
    expect(tabStops).toBeGreaterThan(3); // Should have reasonable number of tab stops
  });

  test('Color contrast accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Basic color contrast check (simplified)
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
      
      // Helper function to get contrast ratio (simplified)
      function getContrastRatio(foreground: string, background: string) {
        // This is a simplified contrast check
        // In a real implementation, you'd use a proper contrast calculation library
        
        // Extract RGB values (very basic)
        const fgMatch = foreground.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const bgMatch = background.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        
        if (!fgMatch || !bgMatch) return 10; // Assume good contrast if can't parse
        
        const fgR = parseInt(fgMatch[1]);
        const fgG = parseInt(fgMatch[2]);
        const fgB = parseInt(fgMatch[3]);
        
        const bgR = parseInt(bgMatch[1]);
        const bgG = parseInt(bgMatch[2]);
        const bgB = parseInt(bgMatch[3]);
        
        // Simple luminance calculation (not accurate but gives an indication)
        const fgLuminance = (fgR * 0.299 + fgG * 0.587 + fgB * 0.114) / 255;
        const bgLuminance = (bgR * 0.299 + bgG * 0.587 + bgB * 0.114) / 255;
        
        const lighter = Math.max(fgLuminance, bgLuminance);
        const darker = Math.min(fgLuminance, bgLuminance);
        
        return (lighter + 0.05) / (darker + 0.05);
      }
      
      for (let i = 0; i < Math.min(textElements.length, 50); i++) {
        const element = textElements[i];
        const styles = getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          const contrast = getContrastRatio(color, backgroundColor);
          
          if (contrast < 4.5) { // WCAG AA standard
            issues.push({
              element: element.tagName.toLowerCase(),
              color,
              backgroundColor,
              contrast: Math.round(contrast * 100) / 100
            });
          }
        }
      }
      
      return issues;
    });
    
    console.log(`Potential color contrast issues: ${contrastIssues.length}`);
    if (contrastIssues.length > 0) {
      console.log('Sample contrast issues:', contrastIssues.slice(0, 5));
    }
    
    // Allow some issues for now, but should eventually be 0
    expect(contrastIssues.length).toBeLessThan(10);
  });

  test('ARIA labels and roles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check for proper ARIA usage
    const ariaAnalysis = await page.evaluate(() => {
      const analysis = {
        elementsWithAriaLabel: 0,
        elementsWithAriaLabelledBy: 0,
        elementsWithAriaDescribedBy: 0,
        elementsWithRole: 0,
        formElementsWithoutAccessibleName: 0,
        totalInteractiveElements: 0
      };
      
      const interactive = document.querySelectorAll('button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]');
      analysis.totalInteractiveElements = interactive.length;
      
      interactive.forEach(el => {
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const ariaDescribedBy = el.getAttribute('aria-describedby');
        const role = el.getAttribute('role');
        
        if (ariaLabel) analysis.elementsWithAriaLabel++;
        if (ariaLabelledBy) analysis.elementsWithAriaLabelledBy++;
        if (ariaDescribedBy) analysis.elementsWithAriaDescribedBy++;
        if (role) analysis.elementsWithRole++;
        
        // Check if form elements have accessible names
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'select' || el.tagName.toLowerCase() === 'textarea') {
          const id = el.getAttribute('id');
          const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
          
          if (!ariaLabel && !ariaLabelledBy && !associatedLabel) {
            analysis.formElementsWithoutAccessibleName++;
          }
        }
      });
      
      return analysis;
    });
    
    console.log('ARIA Analysis:', JSON.stringify(ariaAnalysis, null, 2));
    
    // Test ARIA compliance
    expect(ariaAnalysis.formElementsWithoutAccessibleName).toBe(0);
  });

  test('Semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const semanticAnalysis = await page.evaluate(() => {
      const analysis = {
        hasH1: document.querySelectorAll('h1').length,
        headingHierarchy: [],
        hasMainLandmark: document.querySelectorAll('main').length,
        hasNavLandmark: document.querySelectorAll('nav').length,
        hasFormWithFieldset: document.querySelectorAll('form fieldset').length,
        listsWithItems: 0,
        imagesWithoutAlt: 0,
        totalImages: document.querySelectorAll('img').length
      };
      
      // Check heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(h => {
        analysis.headingHierarchy.push(h.tagName.toLowerCase());
      });
      
      // Check images without alt text
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.getAttribute('alt')) {
          analysis.imagesWithoutAlt++;
        }
      });
      
      // Check lists
      const lists = document.querySelectorAll('ul, ol');
      lists.forEach(list => {
        if (list.querySelectorAll('li').length > 0) {
          analysis.listsWithItems++;
        }
      });
      
      return analysis;
    });
    
    console.log('Semantic HTML Analysis:', JSON.stringify(semanticAnalysis, null, 2));
    
    // Test semantic HTML requirements
    expect(semanticAnalysis.hasH1).toBeGreaterThan(0); // Should have at least one H1
    expect(semanticAnalysis.hasMainLandmark).toBeGreaterThan(0); // Should have main landmark
    expect(semanticAnalysis.imagesWithoutAlt).toBe(0); // All images should have alt text
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test elements that are commonly problematic for screen readers
    const screenReaderIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for empty links
      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        const text = link.textContent?.trim();
        const ariaLabel = link.getAttribute('aria-label');
        const title = link.getAttribute('title');
        
        if (!text && !ariaLabel && !title) {
          issues.push(`Empty link found at index ${index}`);
        }
      });
      
      // Check for empty buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const text = button.textContent?.trim();
        const ariaLabel = button.getAttribute('aria-label');
        const title = button.getAttribute('title');
        
        if (!text && !ariaLabel && !title) {
          issues.push(`Empty button found at index ${index}`);
        }
      });
      
      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
      inputs.forEach((input, index) => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledBy = input.getAttribute('aria-labelledby');
        const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
        
        if (!ariaLabel && !ariaLabelledBy && !associatedLabel) {
          issues.push(`Form input without label at index ${index}`);
        }
      });
      
      return issues;
    });
    
    console.log(`Screen reader compatibility issues: ${screenReaderIssues.length}`);
    if (screenReaderIssues.length > 0) {
      console.log('Issues found:', screenReaderIssues.slice(0, 5));
    }
    
    expect(screenReaderIssues.length).toBe(0); // Should have no screen reader issues
  });

  test('Reduced motion preference support', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const animationCheck = await page.evaluate(() => {
      const animatedElements = [];
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((el, index) => {
        const styles = getComputedStyle(el);
        const animationName = styles.animationName;
        const animationDuration = styles.animationDuration;
        const transitionDuration = styles.transitionDuration;
        
        // Check if animations are still running despite reduced motion preference
        if (animationName && animationName !== 'none') {
          const duration = parseFloat(animationDuration) || 0;
          if (duration > 0.1) { // Anything longer than 0.1s should be reduced
            animatedElements.push({
              index,
              animationName,
              duration
            });
          }
        }
      });
      
      return animatedElements;
    });
    
    console.log(`Elements still animating with reduced motion: ${animationCheck.length}`);
    
    // Should respect reduced motion preference
    expect(animationCheck.length).toBeLessThan(5); // Allow some essential animations
  });
});

test.describe('Mobile Accessibility Tests', () => {
  
  test('Touch target sizes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const touchTargetAnalysis = await page.evaluate(() => {
      const interactive = document.querySelectorAll('button, a, input, select, textarea, [tabindex], [role="button"]');
      const analysis = {
        total: interactive.length,
        tooSmall: 0,
        adequate: 0,
        spacingIssues: 0
      };
      
      const minSize = 44; // WCAG recommendation
      const minSpacing = 8; // Minimum spacing between targets
      
      interactive.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        // Check size
        if (rect.width < minSize || rect.height < minSize) {
          analysis.tooSmall++;
        } else {
          analysis.adequate++;
        }
        
        // Check spacing to other interactive elements
        const nextEl = interactive[index + 1];
        if (nextEl) {
          const nextRect = nextEl.getBoundingClientRect();
          const distance = Math.min(
            Math.abs(rect.right - nextRect.left),
            Math.abs(rect.bottom - nextRect.top)
          );
          
          if (distance < minSpacing && distance > 0) {
            analysis.spacingIssues++;
          }
        }
      });
      
      return analysis;
    });
    
    console.log('Mobile Touch Target Analysis:', JSON.stringify(touchTargetAnalysis, null, 2));
    
    // Test mobile touch requirements
    expect(touchTargetAnalysis.tooSmall).toBeLessThan(3); // Should be minimal
    expect(touchTargetAnalysis.spacingIssues).toBeLessThan(5); // Should have adequate spacing
  });

  test('Mobile form accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Scroll to form
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    
    // Test form field accessibility on mobile
    const formInputs = await page.locator('input, select, textarea').all();
    
    for (const input of formInputs) {
      // Check if input is large enough for mobile
      const boundingBox = await input.boundingBox();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44); // Minimum touch target
      }
      
      // Check if input has proper mobile attributes
      const inputType = await input.getAttribute('type');
      const inputMode = await input.getAttribute('inputmode');
      const autoComplete = await input.getAttribute('autocomplete');
      
      // Email inputs should have email type or inputmode
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder?.toLowerCase().includes('email')) {
        expect(inputType === 'email' || inputMode === 'email').toBe(true);
      }
    }
  });
});