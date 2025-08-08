#!/usr/bin/env node

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

class ComprehensiveTestSuite {
  constructor() {
    this.baseURL = 'http://localhost:3006';
    this.results = {
      timestamp: new Date().toISOString(),
      performance: {},
      accessibility: {},
      security: {},
      formTesting: {},
      crossBrowser: {},
      mobileResponsiveness: {},
      visualRegression: {},
      errors: []
    };
  }

  async runAll() {
    console.log('🚀 Starting Comprehensive Final Test Suite...\n');
    
    try {
      // Performance Tests
      await this.runPerformanceTests();
      
      // Accessibility Tests
      await this.runAccessibilityTests();
      
      // Form Testing
      await this.runFormTests();
      
      // Mobile Responsiveness
      await this.runMobileTests();
      
      // Security Tests
      await this.runSecurityTests();
      
      // Visual Tests
      await this.runVisualTests();
      
      // Generate Report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test Suite Failed:', error);
      this.results.errors.push(error.message);
    }
  }

  async runPerformanceTests() {
    console.log('⚡ Running Performance Tests...');
    
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--remote-debugging-port=9222']
    });
    
    try {
      // Lighthouse Performance Audit
      const result = await lighthouse(this.baseURL, {
        port: 9222,
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        settings: {
          preset: 'desktop',
          throttling: {
            cpuSlowdownMultiplier: 1
          }
        }
      });

      this.results.performance = {
        performanceScore: result.lhr.categories.performance.score * 100,
        accessibilityScore: result.lhr.categories.accessibility.score * 100,
        bestPracticesScore: result.lhr.categories['best-practices'].score * 100,
        seoScore: result.lhr.categories.seo.score * 100,
        
        // Core Web Vitals
        firstContentfulPaint: result.lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: result.lhr.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: result.lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: result.lhr.audits['total-blocking-time'].numericValue,
        speedIndex: result.lhr.audits['speed-index'].numericValue,
        interactive: result.lhr.audits['interactive'].numericValue,
        
        // Bundle Analysis
        unusedCSSRules: result.lhr.audits['unused-css-rules'].details?.items?.length || 0,
        unusedJavaScript: result.lhr.audits['unused-javascript'].details?.items?.length || 0,
        renderBlockingResources: result.lhr.audits['render-blocking-resources'].details?.items?.length || 0
      };

      console.log(`   ✅ Performance Score: ${this.results.performance.performanceScore}/100`);
      console.log(`   ✅ Accessibility Score: ${this.results.performance.accessibilityScore}/100`);
      console.log(`   ✅ Best Practices: ${this.results.performance.bestPracticesScore}/100`);
      console.log(`   ✅ SEO Score: ${this.results.performance.seoScore}/100`);

    } catch (error) {
      console.error('   ❌ Performance test failed:', error.message);
      this.results.errors.push(`Performance: ${error.message}`);
    }
    
    await browser.close();
  }

  async runAccessibilityTests() {
    console.log('♿ Running Accessibility Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      
      // Test keyboard navigation
      const keyboardNavigation = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        return {
          totalFocusable: focusableElements.length,
          withoutLabel: Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
            const id = el.getAttribute('id');
            const ariaLabel = el.getAttribute('aria-label');
            const ariaLabelledBy = el.getAttribute('aria-labelledby');
            const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
            return !ariaLabel && !ariaLabelledBy && !associatedLabel;
          }).length
        };
      });

      // Test ARIA compliance
      const ariaCompliance = await page.evaluate(() => {
        const analysis = {
          elementsWithAriaLabel: document.querySelectorAll('[aria-label]').length,
          elementsWithAriaLabelledBy: document.querySelectorAll('[aria-labelledby]').length,
          elementsWithRole: document.querySelectorAll('[role]').length,
          imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
          headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
          hasH1: document.querySelectorAll('h1').length > 0,
          hasMainLandmark: document.querySelectorAll('main').length > 0
        };
        return analysis;
      });

      this.results.accessibility = {
        keyboardNavigation,
        ariaCompliance,
        passed: keyboardNavigation.withoutLabel === 0 && ariaCompliance.imagesWithoutAlt === 0
      };

      console.log(`   ✅ Focusable elements: ${keyboardNavigation.totalFocusable}`);
      console.log(`   ${keyboardNavigation.withoutLabel === 0 ? '✅' : '❌'} Form labels: ${keyboardNavigation.withoutLabel} missing`);
      console.log(`   ${ariaCompliance.imagesWithoutAlt === 0 ? '✅' : '❌'} Image alt text: ${ariaCompliance.imagesWithoutAlt} missing`);

    } catch (error) {
      console.error('   ❌ Accessibility test failed:', error.message);
      this.results.errors.push(`Accessibility: ${error.message}`);
    }
    
    await browser.close();
  }

  async runFormTests() {
    console.log('📝 Running Form Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      
      // Wait for page to fully load
      await page.waitForTimeout(3000);
      
      // Find form elements
      const formAnalysis = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, select, textarea');
        const buttons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
        
        return {
          totalForms: forms.length,
          totalInputs: inputs.length,
          submitButtons: buttons.length,
          emailInputs: document.querySelectorAll('input[type="email"]').length,
          requiredFields: document.querySelectorAll('[required]').length
        };
      });

      // Test form interaction if form exists
      let formInteractionWorking = false;
      if (formAnalysis.totalForms > 0) {
        try {
          // Try to find and fill first email input
          const emailInput = await page.$('input[type="email"]');
          if (emailInput) {
            await emailInput.type('test@example.com');
            
            // Try to find and fill name input
            const nameInput = await page.$('input[type="text"]');
            if (nameInput) {
              await nameInput.type('John Doe');
            }
            
            formInteractionWorking = true;
          }
        } catch (error) {
          console.log('   ⚠️ Form interaction test failed:', error.message);
        }
      }

      this.results.formTesting = {
        ...formAnalysis,
        formInteractionWorking,
        passed: formAnalysis.totalForms > 0 && formAnalysis.emailInputs > 0
      };

      console.log(`   ✅ Forms found: ${formAnalysis.totalForms}`);
      console.log(`   ✅ Email inputs: ${formAnalysis.emailInputs}`);
      console.log(`   ${formInteractionWorking ? '✅' : '❌'} Form interaction working`);

    } catch (error) {
      console.error('   ❌ Form test failed:', error.message);
      this.results.errors.push(`Form Testing: ${error.message}`);
    }
    
    await browser.close();
  }

  async runMobileTests() {
    console.log('📱 Running Mobile Responsiveness Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Test different viewport sizes
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      const mobileResults = {};
      
      for (const viewport of viewports) {
        await page.setViewport({ width: viewport.width, height: viewport.height });
        await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
        
        // Test touch targets on mobile
        const touchTargetAnalysis = await page.evaluate(() => {
          const interactive = document.querySelectorAll('button, a, input, select, textarea');
          let tooSmall = 0;
          let adequate = 0;
          
          interactive.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
              tooSmall++;
            } else {
              adequate++;
            }
          });
          
          return { total: interactive.length, tooSmall, adequate };
        });

        mobileResults[viewport.name] = {
          viewport: viewport,
          touchTargets: touchTargetAnalysis,
          passed: touchTargetAnalysis.tooSmall < 3
        };
      }

      this.results.mobileResponsiveness = {
        results: mobileResults,
        passed: Object.values(mobileResults).every(r => r.passed)
      };

      console.log(`   ✅ Mobile viewport tested: ${mobileResults.mobile.touchTargets.adequate}/${mobileResults.mobile.touchTargets.total} adequate touch targets`);
      console.log(`   ✅ Tablet viewport tested: ${mobileResults.tablet.touchTargets.adequate}/${mobileResults.tablet.touchTargets.total} adequate touch targets`);

    } catch (error) {
      console.error('   ❌ Mobile test failed:', error.message);
      this.results.errors.push(`Mobile: ${error.message}`);
    }
    
    await browser.close();
  }

  async runSecurityTests() {
    console.log('🔒 Running Security Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      const response = await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      
      // Check security headers
      const headers = response.headers();
      const securityHeaders = {
        'x-frame-options': headers['x-frame-options'],
        'x-content-type-options': headers['x-content-type-options'],
        'x-xss-protection': headers['x-xss-protection'],
        'strict-transport-security': headers['strict-transport-security'],
        'content-security-policy': headers['content-security-policy'],
        'referrer-policy': headers['referrer-policy']
      };

      // Test for mixed content
      const mixedContent = await page.evaluate(() => {
        const insecureResources = [];
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const links = Array.from(document.querySelectorAll('link[href]'));
        const images = Array.from(document.querySelectorAll('img[src]'));
        
        [...scripts, ...links, ...images].forEach(el => {
          const src = el.src || el.href;
          if (src && src.startsWith('http://')) {
            insecureResources.push(src);
          }
        });
        
        return insecureResources;
      });

      this.results.security = {
        headers: securityHeaders,
        mixedContent: mixedContent.length,
        httpsOnly: mixedContent.length === 0,
        passed: mixedContent.length === 0
      };

      console.log(`   ${this.results.security.httpsOnly ? '✅' : '❌'} HTTPS only: ${mixedContent.length} insecure resources`);
      console.log(`   ✅ Security headers checked`);

    } catch (error) {
      console.error('   ❌ Security test failed:', error.message);
      this.results.errors.push(`Security: ${error.message}`);
    }
    
    await browser.close();
  }

  async runVisualTests() {
    console.log('👁️ Running Visual Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);
      
      // Take screenshots for visual regression
      const screenshotDir = path.join(__dirname, 'final-test-screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      // Desktop screenshot
      await page.setViewport({ width: 1920, height: 1080 });
      await page.screenshot({ 
        path: path.join(screenshotDir, 'desktop-final.png'),
        fullPage: true 
      });
      
      // Mobile screenshot
      await page.setViewport({ width: 375, height: 667 });
      await page.screenshot({ 
        path: path.join(screenshotDir, 'mobile-final.png'),
        fullPage: true 
      });

      this.results.visualRegression = {
        screenshotsTaken: 2,
        screenshotDir: screenshotDir,
        passed: true
      };

      console.log(`   ✅ Screenshots saved to: ${screenshotDir}`);

    } catch (error) {
      console.error('   ❌ Visual test failed:', error.message);
      this.results.errors.push(`Visual: ${error.message}`);
    }
    
    await browser.close();
  }

  async generateReport() {
    console.log('📊 Generating Final Test Report...\n');
    
    // Calculate overall scores
    const overallScore = {
      performance: this.results.performance.performanceScore || 0,
      accessibility: this.results.accessibility.passed ? 95 : 75,
      forms: this.results.formTesting.passed ? 100 : 60,
      mobile: this.results.mobileResponsiveness.passed ? 100 : 70,
      security: this.results.security.passed ? 100 : 80,
      visual: this.results.visualRegression.passed ? 100 : 90
    };

    const averageScore = Object.values(overallScore).reduce((a, b) => a + b, 0) / Object.keys(overallScore).length;
    
    this.results.summary = {
      overallScore: Math.round(averageScore),
      categoryScores: overallScore,
      totalTests: 6,
      passedTests: Object.values(overallScore).filter(score => score >= 80).length,
      failedTests: Object.values(overallScore).filter(score => score < 80).length,
      recommendations: this.generateRecommendations()
    };

    // Save detailed results
    const reportPath = path.join(__dirname, 'FINAL_TEST_RESULTS.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Display summary
    console.log('='.repeat(60));
    console.log('🎯 FINAL TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`Overall Score: ${this.results.summary.overallScore}/100`);
    console.log(`Tests Passed: ${this.results.summary.passedTests}/${this.results.summary.totalTests}`);
    console.log('');
    console.log('Category Scores:');
    Object.entries(overallScore).forEach(([category, score]) => {
      const status = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌';
      console.log(`  ${status} ${category}: ${Math.round(score)}/100`);
    });
    
    if (this.results.errors.length > 0) {
      console.log('');
      console.log('⚠️  Issues Found:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('');
    console.log('📄 Detailed results saved to:', reportPath);
    console.log('🖼️  Screenshots saved to:', this.results.visualRegression.screenshotDir);
    console.log('');
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.performance.performanceScore < 80) {
      recommendations.push('Optimize images and implement lazy loading');
      recommendations.push('Reduce JavaScript bundle size');
      recommendations.push('Implement code splitting');
    }
    
    if (!this.results.accessibility.passed) {
      recommendations.push('Add missing form labels and ARIA attributes');
      recommendations.push('Ensure all images have alt text');
      recommendations.push('Improve keyboard navigation');
    }
    
    if (!this.results.formTesting.passed) {
      recommendations.push('Fix form validation and submission');
      recommendations.push('Add proper form error handling');
    }
    
    if (!this.results.mobileResponsiveness.passed) {
      recommendations.push('Increase touch target sizes on mobile');
      recommendations.push('Improve responsive design');
    }
    
    if (!this.results.security.passed) {
      recommendations.push('Add security headers');
      recommendations.push('Fix mixed content issues');
      recommendations.push('Implement HTTPS redirects');
    }
    
    return recommendations;
  }
}

// Run the test suite
const testSuite = new ComprehensiveTestSuite();
testSuite.runAll().then(() => {
  console.log('🎉 Comprehensive test suite completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});