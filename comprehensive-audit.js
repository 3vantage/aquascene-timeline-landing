/**
 * Comprehensive Frontend Audit Script
 * Analyzes performance, accessibility, design issues, and mobile responsiveness
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function comprehensiveAudit() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const audit = {
    timestamp: new Date().toISOString(),
    url: 'http://localhost:3005',
    performance: {},
    accessibility: {},
    design: {},
    mobile: {},
    ux: {},
    technical: {},
    recommendations: []
  };

  try {
    console.log('🔍 Starting comprehensive audit...');
    
    // Performance timing
    const startTime = Date.now();
    await page.goto('http://localhost:3005');
    const loadTime = Date.now() - startTime;
    
    audit.performance.loadTime = loadTime;
    console.log(`⏱️  Initial load time: ${loadTime}ms`);
    
    // Wait for content to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'audit-screenshots/desktop-initial.png',
      fullPage: true 
    });
    
    // Performance metrics
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
        fullyLoaded: nav.loadEventEnd - nav.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    audit.performance = { ...audit.performance, ...metrics };
    
    // Layout and visual stability
    let cumulativeLayoutShift = 0;
    page.on('console', msg => {
      if (msg.text().includes('Layout shift')) {
        cumulativeLayoutShift += parseFloat(msg.text().match(/\d+\.\d+/)?.[0] || 0);
      }
    });
    
    // Check for accessibility issues
    console.log('♿ Checking accessibility...');
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Missing alt tags
      const images = document.querySelectorAll('img');
      images.forEach((img, i) => {
        if (!img.alt) {
          issues.push(`Image ${i + 1} missing alt text`);
        }
      });
      
      // Missing form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input, i) => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          issues.push(`Form input ${i + 1} missing label`);
        }
      });
      
      // Check color contrast (basic check)
      const elements = document.querySelectorAll('*');
      let lowContrastCount = 0;
      Array.from(elements).slice(0, 50).forEach(el => {
        const style = getComputedStyle(el);
        if (style.color && style.backgroundColor) {
          // Basic contrast check (simplified)
          if (style.color === style.backgroundColor) {
            lowContrastCount++;
          }
        }
      });
      
      if (lowContrastCount > 5) {
        issues.push('Potential color contrast issues detected');
      }
      
      // Check for missing focus indicators
      const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
      let noFocusCount = 0;
      focusable.forEach(el => {
        const style = getComputedStyle(el, ':focus');
        if (!style.outline && !style.boxShadow && !style.border) {
          noFocusCount++;
        }
      });
      
      if (noFocusCount > focusable.length * 0.5) {
        issues.push('Many elements missing focus indicators');
      }
      
      return issues;
    });
    
    audit.accessibility.issues = accessibilityIssues;
    
    // Design and UX analysis
    console.log('🎨 Analyzing design and UX...');
    const designIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check font sizes
      const elements = document.querySelectorAll('p, span, div, a, button');
      let smallTextCount = 0;
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize < 14) {
          smallTextCount++;
        }
      });
      
      if (smallTextCount > elements.length * 0.2) {
        issues.push('Many elements have text smaller than 14px');
      }
      
      // Check for consistent spacing
      const sections = document.querySelectorAll('section, div[class*="section"]');
      const margins = [];
      sections.forEach(section => {
        const style = getComputedStyle(section);
        margins.push(parseFloat(style.marginTop), parseFloat(style.marginBottom));
      });
      
      const uniqueMargins = [...new Set(margins)];
      if (uniqueMargins.length > 8) {
        issues.push('Inconsistent spacing between sections');
      }
      
      // Check button sizes (touch targets)
      const buttons = document.querySelectorAll('button, a[role="button"], input[type="submit"]');
      let smallButtonCount = 0;
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          smallButtonCount++;
        }
      });
      
      if (smallButtonCount > 0) {
        issues.push(`${smallButtonCount} buttons smaller than recommended 44px touch target`);
      }
      
      return issues;
    });
    
    audit.design.issues = designIssues;
    
    // Mobile responsiveness testing
    console.log('📱 Testing mobile responsiveness...');
    const mobile = await browser.newPage();
    await mobile.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await mobile.goto('http://localhost:3005');
    await mobile.waitForLoadState('networkidle');
    
    await mobile.screenshot({ 
      path: 'audit-screenshots/mobile-initial.png',
      fullPage: true 
    });
    
    const mobileIssues = await mobile.evaluate(() => {
      const issues = [];
      
      // Check for horizontal scroll
      if (document.body.scrollWidth > window.innerWidth) {
        issues.push('Horizontal scrollbar present on mobile');
      }
      
      // Check if text is readable (not too small)
      const textElements = document.querySelectorAll('p, span, div, a');
      let unreadableCount = 0;
      textElements.forEach(el => {
        const style = getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize < 16) {
          unreadableCount++;
        }
      });
      
      if (unreadableCount > textElements.length * 0.3) {
        issues.push('Text may be too small on mobile devices');
      }
      
      // Check for overlapping elements
      const elements = document.querySelectorAll('*');
      let overlapCount = 0;
      for (let i = 0; i < Math.min(elements.length, 50); i++) {
        const rect1 = elements[i].getBoundingClientRect();
        for (let j = i + 1; j < Math.min(elements.length, 50); j++) {
          const rect2 = elements[j].getBoundingClientRect();
          if (rect1.left < rect2.right && rect2.left < rect1.right &&
              rect1.top < rect2.bottom && rect2.top < rect1.bottom &&
              rect1.width > 0 && rect1.height > 0 && rect2.width > 0 && rect2.height > 0) {
            overlapCount++;
            break;
          }
        }
      }
      
      if (overlapCount > 5) {
        issues.push('Potential element overlapping on mobile');
      }
      
      return issues;
    });
    
    audit.mobile.issues = mobileIssues;
    
    // Test form interactions
    console.log('🔧 Testing form interactions...');
    try {
      // Scroll to waitlist form
      await page.locator('#waitlist').scrollIntoViewIfNeeded();
      
      // Test form fields
      const nameField = page.locator('input[placeholder*="name" i]').first();
      const emailField = page.locator('input[type="email"]').first();
      
      if (await nameField.isVisible()) {
        await nameField.click();
        await nameField.fill('Test User');
        await page.waitForTimeout(500);
        
        await emailField.click();
        await emailField.fill('test@example.com');
        await page.waitForTimeout(500);
        
        // Check if form validation is working
        const submitButton = page.locator('button[type="submit"]').first();
        const isEnabled = await submitButton.isEnabled();
        audit.ux.formValidation = isEnabled;
        
        // Take screenshot of form interaction
        await page.screenshot({ 
          path: 'audit-screenshots/form-interaction.png',
          fullPage: true 
        });
      }
    } catch (error) {
      audit.ux.formError = error.message;
    }
    
    // Performance during interactions
    console.log('⚡ Testing interaction performance...');
    const interactionStart = Date.now();
    
    try {
      // Test hover effects and animations
      const buttons = await page.locator('button').all();
      for (let i = 0; i < Math.min(buttons.length, 3); i++) {
        await buttons[i].hover();
        await page.waitForTimeout(200);
      }
      
      // Test scroll performance
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      await page.waitForTimeout(500);
      
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
    } catch (error) {
      audit.performance.interactionError = error.message;
    }
    
    const interactionTime = Date.now() - interactionStart;
    audit.performance.interactionTime = interactionTime;
    
    // Technical analysis
    console.log('🔍 Technical analysis...');
    const technicalAnalysis = await page.evaluate(() => {
      return {
        totalElements: document.querySelectorAll('*').length,
        totalImages: document.querySelectorAll('img').length,
        totalScripts: document.querySelectorAll('script').length,
        totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        viewportMeta: document.querySelector('meta[name="viewport"]')?.content || 'missing',
        hasServiceWorker: 'serviceWorker' in navigator,
        consoleErrors: window.consoleErrors || 0
      };
    });
    
    audit.technical = technicalAnalysis;
    
    // Generate recommendations
    console.log('💡 Generating recommendations...');
    
    if (audit.performance.loadTime > 3000) {
      audit.recommendations.push({
        type: 'performance',
        priority: 'high',
        issue: 'Slow initial load time',
        suggestion: 'Optimize images, reduce bundle size, implement lazy loading'
      });
    }
    
    if (audit.accessibility.issues.length > 0) {
      audit.recommendations.push({
        type: 'accessibility',
        priority: 'high',
        issue: 'Accessibility violations found',
        suggestion: 'Fix missing alt tags, form labels, and focus indicators'
      });
    }
    
    if (audit.design.issues.length > 2) {
      audit.recommendations.push({
        type: 'design',
        priority: 'medium',
        issue: 'Design consistency issues',
        suggestion: 'Establish design system with consistent spacing, typography, and touch targets'
      });
    }
    
    if (audit.mobile.issues.length > 0) {
      audit.recommendations.push({
        type: 'mobile',
        priority: 'high',
        issue: 'Mobile responsiveness problems',
        suggestion: 'Fix horizontal scroll, improve text readability, prevent element overlapping'
      });
    }
    
    // Save audit results
    if (!fs.existsSync('audit-screenshots')) {
      fs.mkdirSync('audit-screenshots');
    }
    
    fs.writeFileSync('audit-results.json', JSON.stringify(audit, null, 2));
    console.log('📊 Audit complete! Results saved to audit-results.json');
    
    await mobile.close();
    
  } catch (error) {
    console.error('❌ Audit failed:', error);
    audit.error = error.message;
  } finally {
    await browser.close();
  }
  
  return audit;
}

// Run audit if called directly
if (require.main === module) {
  comprehensiveAudit().then(results => {
    console.log('\n📈 AUDIT SUMMARY:');
    console.log(`Load Time: ${results.performance?.loadTime || 'N/A'}ms`);
    console.log(`Accessibility Issues: ${results.accessibility?.issues?.length || 0}`);
    console.log(`Design Issues: ${results.design?.issues?.length || 0}`);
    console.log(`Mobile Issues: ${results.mobile?.issues?.length || 0}`);
    console.log(`Recommendations: ${results.recommendations?.length || 0}`);
    
    if (results.recommendations) {
      console.log('\n🎯 TOP RECOMMENDATIONS:');
      results.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.suggestion}`);
      });
    }
  }).catch(console.error);
}

module.exports = { comprehensiveAudit };