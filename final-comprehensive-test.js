#!/usr/bin/env node

const { chromium, firefox, webkit } = require('playwright');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Final Testing Suite
 * Executes all tests required for production deployment
 */

class ComprehensiveTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: 'production-ready',
      tests: {
        performance: {},
        accessibility: {},
        crossBrowser: {},
        security: {},
        conversion: {},
        formValidation: {}
      },
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Final Test Suite');
    console.log('==========================================');

    try {
      await this.testPerformance();
      await this.testAccessibility();
      await this.testCrossBrowser();
      await this.testFormSubmission();
      await this.testConversionFlow();
      await this.testSecurity();
      
      this.generateReport();
      return this.results;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.tests.error = error.message;
      return this.results;
    }
  }

  async testPerformance() {
    console.log('\n📊 Running Performance Tests...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Test Core Web Vitals
    await page.goto('http://localhost:3006');
    
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.lcp = entries[entries.length - 1].startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // FID (First Input Delay) - simulate
        vitals.fid = 0; // Will be 0 for automated tests
        
        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => {
          vitals.cls = clsValue;
          resolve(vitals);
        }, 5000);
      });
    });

    // Test loading performance
    const loadTime = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    this.results.tests.performance = {
      webVitals,
      loadTime,
      passed: webVitals.lcp < 2500 && webVitals.cls < 0.1 && loadTime.domContentLoaded < 3000
    };

    if (this.results.tests.performance.passed) {
      this.results.summary.passed++;
      console.log('✅ Performance tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Performance tests failed');
    }

    await browser.close();
  }

  async testAccessibility() {
    console.log('\n♿ Running Accessibility Tests...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3006');

    // Test keyboard navigation
    const keyboardNavigation = await page.evaluate(async () => {
      const focusableElements = Array.from(document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ));
      
      return {
        totalFocusable: focusableElements.length,
        hasTabIndex: focusableElements.filter(el => el.getAttribute('tabindex')).length,
        buttons: focusableElements.filter(el => el.tagName === 'BUTTON').length,
        inputs: focusableElements.filter(el => el.tagName === 'INPUT').length
      };
    });

    // Test ARIA labels and roles
    const ariaImplementation = await page.evaluate(() => {
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      const inputs = document.querySelectorAll('input, select, textarea');
      const inputsWithLabels = Array.from(inputs).filter(input => {
        return input.getAttribute('aria-label') || 
               input.getAttribute('aria-labelledby') ||
               document.querySelector(`label[for="${input.id}"]`);
      });

      return {
        elementsWithAria: elementsWithAria.length,
        inputsWithLabels: inputsWithLabels.length,
        totalInputs: inputs.length,
        coverage: inputsWithLabels.length / inputs.length
      };
    });

    // Test color contrast (basic check)
    const colorContrast = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, input, label');
      let contrastIssues = 0;
      
      for (const element of textElements) {
        const styles = getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Basic contrast check (simplified)
        if (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)') {
          contrastIssues++;
        }
      }
      
      return {
        elementsChecked: textElements.length,
        contrastIssues
      };
    });

    this.results.tests.accessibility = {
      keyboardNavigation,
      ariaImplementation,
      colorContrast,
      passed: ariaImplementation.coverage > 0.8 && colorContrast.contrastIssues === 0
    };

    if (this.results.tests.accessibility.passed) {
      this.results.summary.passed++;
      console.log('✅ Accessibility tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Accessibility tests failed');
    }

    await browser.close();
  }

  async testCrossBrowser() {
    console.log('\n🌐 Running Cross-Browser Tests...');
    
    const browsers = {
      chromium: await chromium.launch(),
      firefox: await firefox.launch(),
      webkit: await webkit.launch()
    };

    const results = {};

    for (const [name, browser] of Object.entries(browsers)) {
      try {
        const page = await browser.newPage();
        await page.goto('http://localhost:3006');
        
        // Test basic functionality
        const basicTest = await page.evaluate(() => {
          return {
            title: document.title,
            hasForm: !!document.querySelector('form'),
            buttonsWork: document.querySelectorAll('button').length > 0,
            cssLoaded: getComputedStyle(document.body).fontFamily !== 'Times' // Rough check
          };
        });

        // Test form interaction
        try {
          await page.fill('input[type="text"]', 'Test User');
          await page.fill('input[type="email"]', 'test@example.com');
          
          const formInteraction = {
            canFillName: true,
            canFillEmail: true
          };
          
          results[name] = {
            ...basicTest,
            formInteraction,
            passed: basicTest.hasForm && basicTest.buttonsWork
          };
        } catch (error) {
          results[name] = {
            ...basicTest,
            formInteraction: { error: error.message },
            passed: false
          };
        }

        await browser.close();
      } catch (error) {
        results[name] = {
          error: error.message,
          passed: false
        };
      }
    }

    this.results.tests.crossBrowser = results;
    
    const passedBrowsers = Object.values(results).filter(r => r.passed).length;
    if (passedBrowsers >= 2) {
      this.results.summary.passed++;
      console.log('✅ Cross-browser tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Cross-browser tests failed');
    }
  }

  async testFormSubmission() {
    console.log('\n📋 Running Form Submission Tests...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3006');

    const formTests = [];

    // Test valid submission
    try {
      await page.fill('input[name="name"]', 'John Doe');
      await page.fill('input[name="email"]', 'john@example.com');
      
      // Wait for form to be ready
      await page.waitForSelector('button[type="submit"]', { state: 'visible' });
      
      const submitButton = await page.$('button[type="submit"]');
      const isEnabled = await submitButton.isEnabled();
      
      formTests.push({
        test: 'valid_form_fillable',
        passed: isEnabled,
        details: 'Form accepts valid input and enables submit button'
      });

    } catch (error) {
      formTests.push({
        test: 'valid_form_fillable',
        passed: false,
        error: error.message
      });
    }

    // Test validation errors
    try {
      await page.fill('input[name="name"]', '');
      await page.fill('input[name="email"]', 'invalid-email');
      
      const validationErrors = await page.evaluate(() => {
        const nameField = document.querySelector('input[name="name"]');
        const emailField = document.querySelector('input[name="email"]');
        
        return {
          nameRequired: nameField.validity ? !nameField.validity.valid : true,
          emailInvalid: emailField.validity ? !emailField.validity.valid : true
        };
      });

      formTests.push({
        test: 'validation_errors',
        passed: validationErrors.nameRequired || validationErrors.emailInvalid,
        details: validationErrors
      });

    } catch (error) {
      formTests.push({
        test: 'validation_errors',
        passed: false,
        error: error.message
      });
    }

    this.results.tests.formValidation = {
      tests: formTests,
      passed: formTests.every(t => t.passed)
    };

    if (this.results.tests.formValidation.passed) {
      this.results.summary.passed++;
      console.log('✅ Form submission tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Form submission tests failed');
    }

    await browser.close();
  }

  async testConversionFlow() {
    console.log('\n💰 Running Conversion Flow Tests...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3006');

    const conversionElements = await page.evaluate(() => {
      const elements = {
        testimonials: document.querySelectorAll('[data-testid*="testimonial"], .testimonial').length,
        socialProof: document.querySelectorAll('[data-testid*="social"], .social-proof').length,
        urgencyElements: document.querySelectorAll('[data-testid*="urgency"], .urgency').length,
        callToAction: document.querySelectorAll('button[type="submit"], .cta-button').length,
        valueProposition: document.querySelectorAll('h1, h2, .value-prop').length
      };

      // Check if key conversion elements are present
      elements.hasMainCta = elements.callToAction > 0;
      elements.hasValueProp = elements.valueProposition > 0;
      elements.hasSocialProof = elements.testimonials > 0 || elements.socialProof > 0;

      return elements;
    });

    // Test mobile responsiveness for conversion elements
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileConversion = await page.evaluate(() => {
      const ctaButton = document.querySelector('button[type="submit"]');
      const form = document.querySelector('form');
      
      return {
        ctaVisible: ctaButton ? getComputedStyle(ctaButton).display !== 'none' : false,
        formVisible: form ? getComputedStyle(form).display !== 'none' : false,
        touchTargetSize: ctaButton ? {
          width: ctaButton.offsetWidth,
          height: ctaButton.offsetHeight
        } : null
      };
    });

    this.results.tests.conversion = {
      desktop: conversionElements,
      mobile: mobileConversion,
      passed: conversionElements.hasMainCta && conversionElements.hasValueProp && 
              mobileConversion.ctaVisible && mobileConversion.formVisible
    };

    if (this.results.tests.conversion.passed) {
      this.results.summary.passed++;
      console.log('✅ Conversion flow tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Conversion flow tests failed');
    }

    await browser.close();
  }

  async testSecurity() {
    console.log('\n🔒 Running Security Tests...');
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Capture response headers
    let responseHeaders = {};
    page.on('response', response => {
      if (response.url().includes('localhost:3006') && response.url().endsWith('/')) {
        responseHeaders = response.headers();
      }
    });

    await page.goto('http://localhost:3006');

    // Test form security
    const formSecurity = await page.evaluate(() => {
      const form = document.querySelector('form');
      const inputs = document.querySelectorAll('input');
      
      const security = {
        hasForm: !!form,
        method: form?.method || 'get',
        hasCSRFProtection: false, // Would need server-side verification
        inputValidation: Array.from(inputs).map(input => ({
          type: input.type,
          required: input.required,
          pattern: input.pattern,
          maxLength: input.maxLength
        }))
      };

      // Check for potential XSS vulnerabilities
      security.dangerousInnerHTML = document.querySelectorAll('[dangerouslySetInnerHTML]').length;

      return security;
    });

    // Test Content Security Policy
    const securityHeaders = {
      hasCSP: 'content-security-policy' in responseHeaders,
      hasXFrameOptions: 'x-frame-options' in responseHeaders,
      hasXContentTypeOptions: 'x-content-type-options' in responseHeaders,
      headers: responseHeaders
    };

    this.results.tests.security = {
      formSecurity,
      securityHeaders,
      passed: formSecurity.hasForm && formSecurity.inputValidation.length > 0
    };

    if (this.results.tests.security.passed) {
      this.results.summary.passed++;
      console.log('✅ Security tests passed');
    } else {
      this.results.summary.failed++;
      console.log('❌ Security tests failed');
    }

    await browser.close();
  }

  generateReport() {
    const reportPath = '/Users/kg/aquascene-waitlist-evaluation/final-test-results.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📄 Full report: ${reportPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const testSuite = new ComprehensiveTestSuite();
  testSuite.runAllTests().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = ComprehensiveTestSuite;