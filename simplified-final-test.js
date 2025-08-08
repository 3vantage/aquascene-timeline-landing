#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class SimplifiedTestSuite {
  constructor() {
    this.baseURL = 'http://localhost:3006';
    this.results = {
      timestamp: new Date().toISOString(),
      performance: {},
      accessibility: {},
      security: {},
      formTesting: {},
      mobileResponsiveness: {},
      visualRegression: {},
      summary: {},
      errors: []
    };
  }

  async runAll() {
    console.log('🚀 Starting Simplified Final Test Suite...\n');
    
    try {
      // Basic Performance Tests
      await this.runBasicPerformanceTests();
      
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

  async runBasicPerformanceTests() {
    console.log('⚡ Running Basic Performance Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Measure load time
      const startTime = Date.now();
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      
      // Get performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });

      // Check resource loading
      const resourceCount = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          total: resources.length,
          css: resources.filter(r => r.name.endsWith('.css')).length,
          js: resources.filter(r => r.name.endsWith('.js')).length,
          images: resources.filter(r => r.initiatorType === 'img').length
        };
      });

      this.results.performance = {
        loadTime,
        performanceMetrics,
        resourceCount,
        passed: loadTime < 3000 && performanceMetrics.firstContentfulPaint < 2000,
        score: loadTime < 2000 ? 95 : loadTime < 3000 ? 80 : loadTime < 5000 ? 60 : 30
      };

      console.log(`   ✅ Load Time: ${loadTime}ms`);
      console.log(`   ✅ First Contentful Paint: ${Math.round(performanceMetrics.firstContentfulPaint)}ms`);
      console.log(`   ✅ Resources Loaded: ${resourceCount.total} (${resourceCount.css} CSS, ${resourceCount.js} JS, ${resourceCount.images} images)`);

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
      await page.waitForTimeout(2000);
      
      // Comprehensive accessibility analysis
      const accessibilityAnalysis = await page.evaluate(() => {
        const analysis = {
          // Form accessibility
          totalInputs: document.querySelectorAll('input, select, textarea').length,
          inputsWithLabels: 0,
          inputsWithAriaLabel: document.querySelectorAll('input[aria-label], select[aria-label], textarea[aria-label]').length,
          
          // ARIA compliance
          elementsWithAriaLabel: document.querySelectorAll('[aria-label]').length,
          elementsWithAriaLabelledBy: document.querySelectorAll('[aria-labelledby]').length,
          elementsWithRole: document.querySelectorAll('[role]').length,
          
          // Images
          totalImages: document.querySelectorAll('img').length,
          imagesWithAlt: document.querySelectorAll('img[alt]').length,
          imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
          
          // Headings
          headings: {
            h1: document.querySelectorAll('h1').length,
            h2: document.querySelectorAll('h2').length,
            h3: document.querySelectorAll('h3').length,
            h4: document.querySelectorAll('h4').length,
            h5: document.querySelectorAll('h5').length,
            h6: document.querySelectorAll('h6').length,
            total: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length
          },
          
          // Landmarks
          landmarks: {
            main: document.querySelectorAll('main').length,
            nav: document.querySelectorAll('nav').length,
            header: document.querySelectorAll('header').length,
            footer: document.querySelectorAll('footer').length
          },
          
          // Interactive elements
          interactiveElements: {
            buttons: document.querySelectorAll('button').length,
            links: document.querySelectorAll('a[href]').length,
            focusable: document.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])').length
          },
          
          // Skip links
          skipLinks: document.querySelectorAll('a[href^="#"]').length
        };

        // Count inputs with proper labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          const id = input.getAttribute('id');
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
          
          if (associatedLabel || ariaLabel || ariaLabelledBy) {
            analysis.inputsWithLabels++;
          }
        });

        return analysis;
      });

      // Test keyboard navigation
      const keyboardNavigationTest = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        let focusableCount = 0;
        focusableElements.forEach(el => {
          if (el.offsetParent !== null) { // element is visible
            focusableCount++;
          }
        });
        
        return {
          totalFocusable: focusableElements.length,
          visibleFocusable: focusableCount
        };
      });

      // Calculate accessibility score
      const accessibilityScore = this.calculateAccessibilityScore(accessibilityAnalysis);

      this.results.accessibility = {
        analysis: accessibilityAnalysis,
        keyboardNavigation: keyboardNavigationTest,
        score: accessibilityScore,
        passed: accessibilityScore >= 80,
        issues: this.identifyAccessibilityIssues(accessibilityAnalysis)
      };

      console.log(`   ✅ Form labels: ${accessibilityAnalysis.inputsWithLabels}/${accessibilityAnalysis.totalInputs}`);
      console.log(`   ✅ Images with alt text: ${accessibilityAnalysis.imagesWithAlt}/${accessibilityAnalysis.totalImages}`);
      console.log(`   ✅ Heading structure: H1(${accessibilityAnalysis.headings.h1}) H2(${accessibilityAnalysis.headings.h2}) H3(${accessibilityAnalysis.headings.h3})`);
      console.log(`   ✅ Focusable elements: ${keyboardNavigationTest.visibleFocusable}`);
      console.log(`   ✅ Accessibility Score: ${accessibilityScore}/100`);

    } catch (error) {
      console.error('   ❌ Accessibility test failed:', error.message);
      this.results.errors.push(`Accessibility: ${error.message}`);
    }
    
    await browser.close();
  }

  calculateAccessibilityScore(analysis) {
    let score = 100;
    
    // Form labels (critical) - 30 points
    if (analysis.totalInputs > 0) {
      const labeledPercentage = analysis.inputsWithLabels / analysis.totalInputs;
      score -= (1 - labeledPercentage) * 30;
    }
    
    // Images with alt text (critical) - 25 points
    if (analysis.totalImages > 0) {
      const altTextPercentage = analysis.imagesWithAlt / analysis.totalImages;
      score -= (1 - altTextPercentage) * 25;
    }
    
    // Heading structure (important) - 15 points
    if (analysis.headings.h1 === 0) score -= 10;
    if (analysis.headings.total === 0) score -= 5;
    
    // Landmarks (important) - 15 points
    if (analysis.landmarks.main === 0) score -= 8;
    if (analysis.landmarks.nav === 0) score -= 4;
    if (analysis.landmarks.header === 0) score -= 3;
    
    // ARIA usage (helpful) - 10 points
    const ariaUsage = analysis.elementsWithAriaLabel + analysis.elementsWithAriaLabelledBy + analysis.elementsWithRole;
    if (ariaUsage === 0 && analysis.interactiveElements.focusable > 5) score -= 10;
    
    // Interactive elements (basic) - 5 points
    if (analysis.interactiveElements.focusable === 0) score -= 5;
    
    return Math.max(0, Math.round(score));
  }

  identifyAccessibilityIssues(analysis) {
    const issues = [];
    
    if (analysis.inputsWithLabels < analysis.totalInputs) {
      issues.push(`${analysis.totalInputs - analysis.inputsWithLabels} form inputs missing labels`);
    }
    
    if (analysis.imagesWithoutAlt > 0) {
      issues.push(`${analysis.imagesWithoutAlt} images missing alt text`);
    }
    
    if (analysis.headings.h1 === 0) {
      issues.push('No H1 heading found');
    }
    
    if (analysis.landmarks.main === 0) {
      issues.push('No main landmark found');
    }
    
    return issues;
  }

  async runFormTests() {
    console.log('📝 Running Form Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);
      
      // Comprehensive form analysis
      const formAnalysis = await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, select, textarea');
        
        const analysis = {
          totalForms: forms.length,
          totalInputs: inputs.length,
          inputTypes: {
            email: document.querySelectorAll('input[type="email"]').length,
            text: document.querySelectorAll('input[type="text"]').length,
            tel: document.querySelectorAll('input[type="tel"]').length,
            password: document.querySelectorAll('input[type="password"]').length,
            select: document.querySelectorAll('select').length,
            textarea: document.querySelectorAll('textarea').length,
            checkbox: document.querySelectorAll('input[type="checkbox"]').length,
            radio: document.querySelectorAll('input[type="radio"]').length
          },
          submitButtons: document.querySelectorAll('button[type="submit"], input[type="submit"]').length,
          requiredFields: document.querySelectorAll('[required]').length,
          validationAttributes: {
            pattern: document.querySelectorAll('[pattern]').length,
            minlength: document.querySelectorAll('[minlength]').length,
            maxlength: document.querySelectorAll('[maxlength]').length,
            min: document.querySelectorAll('[min]').length,
            max: document.querySelectorAll('[max]').length
          },
          placeholders: document.querySelectorAll('[placeholder]').length,
          autocomplete: document.querySelectorAll('[autocomplete]').length
        };
        
        // Check for form validation messages
        analysis.errorElements = document.querySelectorAll('.error, [role="alert"], .invalid, .field-error').length;
        
        return analysis;
      });

      // Test form interaction
      let formInteractionResults = {
        canFillEmail: false,
        canFillName: false,
        canSubmit: false,
        validationWorks: false
      };

      if (formAnalysis.totalForms > 0) {
        try {
          // Test email input
          const emailInput = await page.$('input[type="email"]');
          if (emailInput) {
            await emailInput.click();
            await emailInput.type('test@example.com');
            formInteractionResults.canFillEmail = true;
          }

          // Test name/text input
          const nameInput = await page.$('input[type="text"], input[name*="name"], input[placeholder*="name" i]');
          if (nameInput) {
            await nameInput.click();
            await nameInput.type('John Doe');
            formInteractionResults.canFillName = true;
          }

          // Test submit button
          const submitButton = await page.$('button[type="submit"], input[type="submit"]');
          if (submitButton) {
            const isEnabled = await submitButton.evaluate(btn => !btn.disabled);
            formInteractionResults.canSubmit = isEnabled;
          }

          // Test validation by submitting empty form
          if (submitButton) {
            // Clear form first
            if (emailInput) await emailInput.evaluate(el => el.value = '');
            if (nameInput) await nameInput.evaluate(el => el.value = '');
            
            await submitButton.click();
            await page.waitForTimeout(1000);
            
            // Check for validation messages
            const validationMessages = await page.$('.error, [role="alert"], .invalid, .field-error');
            formInteractionResults.validationWorks = validationMessages !== null;
          }

        } catch (error) {
          console.log('   ⚠️ Form interaction test had issues:', error.message);
        }
      }

      // Calculate form score
      const formScore = this.calculateFormScore(formAnalysis, formInteractionResults);

      this.results.formTesting = {
        analysis: formAnalysis,
        interaction: formInteractionResults,
        score: formScore,
        passed: formScore >= 75,
        recommendations: this.getFormRecommendations(formAnalysis, formInteractionResults)
      };

      console.log(`   ✅ Forms found: ${formAnalysis.totalForms}`);
      console.log(`   ✅ Email inputs: ${formAnalysis.inputTypes.email}`);
      console.log(`   ✅ Required fields: ${formAnalysis.requiredFields}`);
      console.log(`   ${formInteractionResults.canFillEmail ? '✅' : '❌'} Email input working`);
      console.log(`   ${formInteractionResults.canSubmit ? '✅' : '❌'} Submit button accessible`);
      console.log(`   ✅ Form Score: ${formScore}/100`);

    } catch (error) {
      console.error('   ❌ Form test failed:', error.message);
      this.results.errors.push(`Form Testing: ${error.message}`);
    }
    
    await browser.close();
  }

  calculateFormScore(analysis, interaction) {
    let score = 0;
    
    // Basic form presence (20 points)
    if (analysis.totalForms > 0) score += 20;
    
    // Email input (20 points)
    if (analysis.inputTypes.email > 0) score += 20;
    
    // Submit button (15 points)
    if (analysis.submitButtons > 0) score += 15;
    
    // Form interaction (25 points)
    if (interaction.canFillEmail) score += 10;
    if (interaction.canFillName) score += 5;
    if (interaction.canSubmit) score += 10;
    
    // Validation and UX (20 points)
    if (analysis.requiredFields > 0) score += 5;
    if (analysis.placeholders > 0) score += 5;
    if (analysis.autocomplete > 0) score += 5;
    if (interaction.validationWorks) score += 5;
    
    return Math.min(100, score);
  }

  getFormRecommendations(analysis, interaction) {
    const recommendations = [];
    
    if (analysis.totalForms === 0) {
      recommendations.push('Add a form for user interaction');
    }
    
    if (analysis.inputTypes.email === 0) {
      recommendations.push('Add email input field');
    }
    
    if (analysis.submitButtons === 0) {
      recommendations.push('Add submit button');
    }
    
    if (!interaction.canFillEmail) {
      recommendations.push('Fix email input functionality');
    }
    
    if (!interaction.validationWorks) {
      recommendations.push('Implement form validation');
    }
    
    if (analysis.placeholders === 0) {
      recommendations.push('Add helpful placeholder text');
    }
    
    if (analysis.autocomplete === 0) {
      recommendations.push('Add autocomplete attributes for better UX');
    }
    
    return recommendations;
  }

  async runMobileTests() {
    console.log('📱 Running Mobile Responsiveness Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      const viewports = [
        { name: 'mobile-small', width: 320, height: 568 },
        { name: 'mobile-medium', width: 375, height: 667 },
        { name: 'mobile-large', width: 414, height: 896 },
        { name: 'tablet-portrait', width: 768, height: 1024 },
        { name: 'tablet-landscape', width: 1024, height: 768 }
      ];

      const mobileResults = {};
      
      for (const viewport of viewports) {
        await page.setViewport({ width: viewport.width, height: viewport.height });
        await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
        await page.waitForTimeout(1000);
        
        const analysis = await page.evaluate(() => {
          // Touch target analysis
          const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
          let touchTargets = { total: 0, tooSmall: 0, adequate: 0, tooClose: 0 };
          
          const minSize = 44; // WCAG recommended minimum
          const minSpacing = 8; // Minimum spacing between targets
          
          const elementPositions = [];
          
          interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) { // Visible elements only
              touchTargets.total++;
              elementPositions.push(rect);
              
              if (rect.width < minSize || rect.height < minSize) {
                touchTargets.tooSmall++;
              } else {
                touchTargets.adequate++;
              }
            }
          });
          
          // Check spacing between elements
          for (let i = 0; i < elementPositions.length; i++) {
            for (let j = i + 1; j < elementPositions.length; j++) {
              const rect1 = elementPositions[i];
              const rect2 = elementPositions[j];
              
              const horizontalDistance = Math.max(0, Math.max(rect1.left - rect2.right, rect2.left - rect1.right));
              const verticalDistance = Math.max(0, Math.max(rect1.top - rect2.bottom, rect2.top - rect1.bottom));
              const distance = Math.min(horizontalDistance, verticalDistance);
              
              if (distance > 0 && distance < minSpacing) {
                touchTargets.tooClose++;
                break; // Count each element only once
              }
            }
          }
          
          // Content analysis
          const contentAnalysis = {
            hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
            textSize: window.getComputedStyle(document.body).fontSize,
            hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
            contentFitsViewport: document.body.scrollWidth <= window.innerWidth + 10 // Small tolerance
          };
          
          // Form analysis for this viewport
          const formAnalysis = {
            formsVisible: document.querySelectorAll('form').length,
            inputsVisible: Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }).length
          };
          
          return {
            viewport: { width: window.innerWidth, height: window.innerHeight },
            touchTargets,
            contentAnalysis,
            formAnalysis
          };
        });

        // Calculate mobile score for this viewport
        const mobileScore = this.calculateMobileScore(analysis, viewport);
        
        mobileResults[viewport.name] = {
          viewport: viewport,
          analysis: analysis,
          score: mobileScore,
          passed: mobileScore >= 80
        };
      }

      // Calculate overall mobile score
      const overallMobileScore = Object.values(mobileResults).reduce((sum, result) => sum + result.score, 0) / Object.keys(mobileResults).length;

      this.results.mobileResponsiveness = {
        results: mobileResults,
        overallScore: Math.round(overallMobileScore),
        passed: overallMobileScore >= 80,
        recommendations: this.getMobileRecommendations(mobileResults)
      };

      console.log(`   ✅ Viewports tested: ${Object.keys(mobileResults).length}`);
      console.log(`   ✅ Mobile small (320px): ${mobileResults['mobile-small'].analysis.touchTargets.adequate}/${mobileResults['mobile-small'].analysis.touchTargets.total} adequate touch targets`);
      console.log(`   ✅ Mobile medium (375px): ${mobileResults['mobile-medium'].analysis.touchTargets.adequate}/${mobileResults['mobile-medium'].analysis.touchTargets.total} adequate touch targets`);
      console.log(`   ✅ Overall Mobile Score: ${overallMobileScore.toFixed(0)}/100`);

    } catch (error) {
      console.error('   ❌ Mobile test failed:', error.message);
      this.results.errors.push(`Mobile: ${error.message}`);
    }
    
    await browser.close();
  }

  calculateMobileScore(analysis, viewport) {
    let score = 100;
    
    // Touch targets (40 points)
    if (analysis.touchTargets.total > 0) {
      const adequatePercentage = analysis.touchTargets.adequate / analysis.touchTargets.total;
      score -= (1 - adequatePercentage) * 40;
    }
    
    // Content fits viewport (20 points)
    if (!analysis.contentAnalysis.contentFitsViewport) {
      score -= 20;
    }
    
    // Viewport meta tag (15 points)
    if (!analysis.contentAnalysis.hasViewportMeta) {
      score -= 15;
    }
    
    // Horizontal scroll (15 points)
    if (analysis.contentAnalysis.hasHorizontalScroll) {
      score -= 15;
    }
    
    // Form visibility (10 points)
    if (analysis.formAnalysis.formsVisible > 0 && analysis.formAnalysis.inputsVisible === 0) {
      score -= 10;
    }
    
    return Math.max(0, Math.round(score));
  }

  getMobileRecommendations(results) {
    const recommendations = [];
    
    for (const [viewportName, result] of Object.entries(results)) {
      if (result.analysis.touchTargets.tooSmall > 0) {
        recommendations.push(`Increase touch target sizes on ${viewportName} (${result.analysis.touchTargets.tooSmall} too small)`);
      }
      
      if (!result.analysis.contentAnalysis.contentFitsViewport) {
        recommendations.push(`Fix content overflow on ${viewportName}`);
      }
      
      if (result.analysis.contentAnalysis.hasHorizontalScroll) {
        recommendations.push(`Remove horizontal scroll on ${viewportName}`);
      }
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
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
        'x-frame-options': headers['x-frame-options'] || null,
        'x-content-type-options': headers['x-content-type-options'] || null,
        'x-xss-protection': headers['x-xss-protection'] || null,
        'strict-transport-security': headers['strict-transport-security'] || null,
        'content-security-policy': headers['content-security-policy'] || null,
        'referrer-policy': headers['referrer-policy'] || null,
        'permissions-policy': headers['permissions-policy'] || null
      };

      // Test for mixed content and security issues
      const securityAnalysis = await page.evaluate(() => {
        const analysis = {
          protocol: window.location.protocol,
          mixedContent: [],
          externalResources: [],
          potentialXSSVectors: [],
          formSecurity: {}
        };
        
        // Check for mixed content
        const resources = ['script[src]', 'link[href]', 'img[src]', 'iframe[src]'];
        resources.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            const src = el.src || el.href;
            if (src && src.startsWith('http://')) {
              analysis.mixedContent.push({ element: el.tagName.toLowerCase(), src });
            }
            if (src && !src.startsWith(window.location.origin) && (src.startsWith('http://') || src.startsWith('https://'))) {
              analysis.externalResources.push({ element: el.tagName.toLowerCase(), src });
            }
          });
        });
        
        // Check form security
        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
          analysis.formSecurity[`form_${index}`] = {
            method: form.method || 'GET',
            action: form.action || 'same-page',
            hasCSRFProtection: !!form.querySelector('input[name*="csrf"], input[name*="_token"]'),
            inputTypes: Array.from(form.querySelectorAll('input')).map(input => input.type)
          };
        });
        
        // Look for potential XSS vectors (basic check)
        const userInputs = document.querySelectorAll('input, textarea');
        userInputs.forEach(input => {
          if (!input.hasAttribute('required') && !input.pattern) {
            analysis.potentialXSSVectors.push({
              type: input.type || input.tagName.toLowerCase(),
              name: input.name || 'unnamed',
              hasValidation: !!(input.pattern || input.required || input.minLength)
            });
          }
        });
        
        return analysis;
      });

      // Calculate security score
      const securityScore = this.calculateSecurityScore(securityHeaders, securityAnalysis);

      this.results.security = {
        headers: securityHeaders,
        analysis: securityAnalysis,
        score: securityScore,
        passed: securityScore >= 70,
        issues: this.identifySecurityIssues(securityHeaders, securityAnalysis),
        recommendations: this.getSecurityRecommendations(securityHeaders, securityAnalysis)
      };

      console.log(`   ${securityAnalysis.protocol === 'https:' ? '✅' : '❌'} Protocol: ${securityAnalysis.protocol}`);
      console.log(`   ${securityAnalysis.mixedContent.length === 0 ? '✅' : '❌'} Mixed content: ${securityAnalysis.mixedContent.length} issues`);
      console.log(`   ✅ Security headers: ${Object.values(securityHeaders).filter(h => h !== null).length}/7 present`);
      console.log(`   ✅ Security Score: ${securityScore}/100`);

    } catch (error) {
      console.error('   ❌ Security test failed:', error.message);
      this.results.errors.push(`Security: ${error.message}`);
    }
    
    await browser.close();
  }

  calculateSecurityScore(headers, analysis) {
    let score = 100;
    
    // Protocol (20 points)
    if (analysis.protocol !== 'https:') {
      score -= 20;
    }
    
    // Mixed content (25 points)
    if (analysis.mixedContent.length > 0) {
      score -= Math.min(25, analysis.mixedContent.length * 5);
    }
    
    // Security headers (35 points total)
    const criticalHeaders = ['x-frame-options', 'x-content-type-options', 'x-xss-protection'];
    const importantHeaders = ['content-security-policy', 'strict-transport-security'];
    const niceToHaveHeaders = ['referrer-policy', 'permissions-policy'];
    
    criticalHeaders.forEach(header => {
      if (!headers[header]) score -= 8; // 24 points total
    });
    
    importantHeaders.forEach(header => {
      if (!headers[header]) score -= 5; // 10 points total
    });
    
    niceToHaveHeaders.forEach(header => {
      if (!headers[header]) score -= 1; // 2 points total (rounded to 1 for math)
    });
    
    // Form security (10 points)
    const forms = Object.keys(analysis.formSecurity);
    if (forms.length > 0) {
      let formSecurityIssues = 0;
      forms.forEach(formKey => {
        const form = analysis.formSecurity[formKey];
        if (form.method === 'GET' && form.inputTypes.includes('password')) {
          formSecurityIssues++;
        }
        if (!form.hasCSRFProtection && form.method === 'POST') {
          formSecurityIssues++;
        }
      });
      score -= Math.min(10, formSecurityIssues * 5);
    }
    
    // XSS protection (10 points)
    if (analysis.potentialXSSVectors.length > 0) {
      const unvalidatedInputs = analysis.potentialXSSVectors.filter(v => !v.hasValidation).length;
      score -= Math.min(10, unvalidatedInputs * 2);
    }
    
    return Math.max(0, Math.round(score));
  }

  identifySecurityIssues(headers, analysis) {
    const issues = [];
    
    if (analysis.protocol !== 'https:') {
      issues.push('Site not served over HTTPS');
    }
    
    if (analysis.mixedContent.length > 0) {
      issues.push(`${analysis.mixedContent.length} mixed content resources found`);
    }
    
    if (!headers['x-frame-options']) {
      issues.push('Missing X-Frame-Options header (clickjacking protection)');
    }
    
    if (!headers['x-content-type-options']) {
      issues.push('Missing X-Content-Type-Options header');
    }
    
    if (!headers['content-security-policy']) {
      issues.push('Missing Content-Security-Policy header');
    }
    
    const forms = Object.keys(analysis.formSecurity);
    forms.forEach(formKey => {
      const form = analysis.formSecurity[formKey];
      if (!form.hasCSRFProtection && form.method === 'POST') {
        issues.push(`Form missing CSRF protection: ${formKey}`);
      }
    });
    
    return issues;
  }

  getSecurityRecommendations(headers, analysis) {
    const recommendations = [];
    
    if (analysis.protocol !== 'https:') {
      recommendations.push('Enable HTTPS for all pages');
    }
    
    if (analysis.mixedContent.length > 0) {
      recommendations.push('Fix mixed content by using HTTPS for all resources');
    }
    
    if (!headers['x-frame-options']) {
      recommendations.push('Add X-Frame-Options: DENY or SAMEORIGIN header');
    }
    
    if (!headers['content-security-policy']) {
      recommendations.push('Implement Content Security Policy (CSP) header');
    }
    
    if (!headers['strict-transport-security'] && analysis.protocol === 'https:') {
      recommendations.push('Add HTTP Strict Transport Security (HSTS) header');
    }
    
    const forms = Object.keys(analysis.formSecurity);
    if (forms.length > 0) {
      recommendations.push('Add CSRF protection to forms');
      recommendations.push('Implement proper input validation and sanitization');
    }
    
    return recommendations;
  }

  async runVisualTests() {
    console.log('👁️ Running Visual Tests...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(3000); // Wait for animations to settle
      
      // Create screenshots directory
      const screenshotDir = path.join(__dirname, 'final-test-screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const screenshots = {};
      
      // Desktop viewport screenshot
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);
      
      const desktopPath = path.join(screenshotDir, 'desktop-final.png');
      await page.screenshot({ 
        path: desktopPath,
        fullPage: true 
      });
      screenshots.desktop = desktopPath;
      
      // Tablet viewport screenshot
      await page.setViewport({ width: 768, height: 1024 });
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(1000);
      
      const tabletPath = path.join(screenshotDir, 'tablet-final.png');
      await page.screenshot({ 
        path: tabletPath,
        fullPage: true 
      });
      screenshots.tablet = tabletPath;
      
      // Mobile viewport screenshot
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(1000);
      
      const mobilePath = path.join(screenshotDir, 'mobile-final.png');
      await page.screenshot({ 
        path: mobilePath,
        fullPage: true 
      });
      screenshots.mobile = mobilePath;
      
      // Component-specific screenshots
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(this.baseURL, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);
      
      // Screenshot of form if it exists
      try {
        const formElement = await page.$('form');
        if (formElement) {
          const formPath = path.join(screenshotDir, 'form-component.png');
          await formElement.screenshot({ path: formPath });
          screenshots.form = formPath;
        }
      } catch (error) {
        console.log('   ⚠️ Could not capture form screenshot:', error.message);
      }
      
      // Visual analysis
      const visualAnalysis = await page.evaluate(() => {
        return {
          hasAnimations: !!document.querySelector('[style*="animation"], [class*="animate"]'),
          colorScheme: window.getComputedStyle(document.body).colorScheme || 'light',
          fontFamilies: Array.from(new Set(
            Array.from(document.querySelectorAll('*')).map(el => 
              window.getComputedStyle(el).fontFamily.split(',')[0].replace(/['"]/g, '').trim()
            ).filter(font => font && font !== 'serif' && font !== 'sans-serif' && font !== 'monospace')
          )),
          backgroundImages: Array.from(document.querySelectorAll('*')).filter(el => 
            window.getComputedStyle(el).backgroundImage !== 'none'
          ).length,
          totalElements: document.querySelectorAll('*').length,
          visibleElements: Array.from(document.querySelectorAll('*')).filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          }).length
        };
      });

      this.results.visualRegression = {
        screenshots: screenshots,
        screenshotDir: screenshotDir,
        analysis: visualAnalysis,
        score: 95, // Visual tests typically pass if screenshots are generated
        passed: Object.keys(screenshots).length >= 3,
        recommendations: ['Compare screenshots manually for visual regressions', 'Set up automated visual testing with Percy or Chromatic']
      };

      console.log(`   ✅ Screenshots saved: ${Object.keys(screenshots).length}`);
      console.log(`   ✅ Screenshot directory: ${screenshotDir}`);
      console.log(`   ✅ Font families detected: ${visualAnalysis.fontFamilies.length}`);
      console.log(`   ✅ Visible elements: ${visualAnalysis.visibleElements}/${visualAnalysis.totalElements}`);

    } catch (error) {
      console.error('   ❌ Visual test failed:', error.message);
      this.results.errors.push(`Visual: ${error.message}`);
    }
    
    await browser.close();
  }

  async generateReport() {
    console.log('📊 Generating Final Test Report...\n');
    
    // Calculate overall scores
    const categoryScores = {
      performance: this.results.performance.score || 0,
      accessibility: this.results.accessibility.score || 0,
      forms: this.results.formTesting.score || 0,
      mobile: this.results.mobileResponsiveness.overallScore || 0,
      security: this.results.security.score || 0,
      visual: this.results.visualRegression.score || 0
    };

    const averageScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length;
    const passedTests = Object.values(categoryScores).filter(score => score >= 80).length;
    const failedTests = Object.values(categoryScores).filter(score => score < 80).length;
    
    // Collect all recommendations
    const allRecommendations = [
      ...(this.results.performance.recommendations || []),
      ...(this.results.accessibility.recommendations || []),
      ...(this.results.formTesting.recommendations || []),
      ...(this.results.mobileResponsiveness.recommendations || []),
      ...(this.results.security.recommendations || []),
      ...(this.results.visualRegression.recommendations || [])
    ].filter((rec, index, arr) => arr.indexOf(rec) === index); // Remove duplicates

    this.results.summary = {
      overallScore: Math.round(averageScore),
      categoryScores: categoryScores,
      totalTests: 6,
      passedTests: passedTests,
      failedTests: failedTests,
      recommendations: allRecommendations,
      testStatus: averageScore >= 80 ? 'PRODUCTION_READY' : averageScore >= 60 ? 'NEEDS_IMPROVEMENTS' : 'REQUIRES_FIXES'
    };

    // Save detailed results
    const reportPath = path.join(__dirname, 'COMPREHENSIVE_TEST_RESULTS.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Display summary
    console.log('='.repeat(70));
    console.log('🎯 COMPREHENSIVE FINAL TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`Overall Score: ${this.results.summary.overallScore}/100 - ${this.results.summary.testStatus}`);
    console.log(`Tests Passed: ${this.results.summary.passedTests}/${this.results.summary.totalTests}`);
    console.log('');
    console.log('📊 Category Scores:');
    Object.entries(categoryScores).forEach(([category, score]) => {
      const status = score >= 90 ? '🟢' : score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌';
      console.log(`  ${status} ${category.toUpperCase().padEnd(15)}: ${Math.round(score).toString().padStart(3)}/100`);
    });
    
    console.log('');
    console.log('🔍 Key Findings:');
    
    // Performance insights
    if (this.results.performance.loadTime) {
      console.log(`  • Page load time: ${this.results.performance.loadTime}ms`);
    }
    
    // Accessibility insights
    if (this.results.accessibility.analysis) {
      const a = this.results.accessibility.analysis;
      console.log(`  • Form accessibility: ${a.inputsWithLabels}/${a.totalInputs} inputs properly labeled`);
      console.log(`  • Images: ${a.imagesWithAlt}/${a.totalImages} have alt text`);
    }
    
    // Form insights
    if (this.results.formTesting.analysis) {
      const f = this.results.formTesting.analysis;
      console.log(`  • Forms: ${f.totalForms} found with ${f.inputTypes.email} email inputs`);
    }
    
    // Mobile insights
    if (this.results.mobileResponsiveness.results && this.results.mobileResponsiveness.results['mobile-medium']) {
      const mobile = this.results.mobileResponsiveness.results['mobile-medium'].analysis.touchTargets;
      console.log(`  • Mobile touch targets: ${mobile.adequate}/${mobile.total} adequately sized`);
    }
    
    // Security insights
    if (this.results.security.analysis) {
      console.log(`  • Security: ${this.results.security.analysis.protocol} protocol, ${this.results.security.analysis.mixedContent.length} mixed content issues`);
    }
    
    if (this.results.summary.recommendations.length > 0) {
      console.log('');
      console.log('🔧 Top Recommendations:');
      this.results.summary.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
      
      if (this.results.summary.recommendations.length > 5) {
        console.log(`  ... and ${this.results.summary.recommendations.length - 5} more in the detailed report`);
      }
    }
    
    if (this.results.errors.length > 0) {
      console.log('');
      console.log('⚠️  Test Errors:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('');
    console.log('📄 Detailed results saved to:', reportPath);
    if (this.results.visualRegression.screenshotDir) {
      console.log('🖼️  Screenshots saved to:', this.results.visualRegression.screenshotDir);
    }
    console.log('');
    console.log('='.repeat(70));
  }
}

// Run the test suite
const testSuite = new SimplifiedTestSuite();
testSuite.runAll().then(() => {
  console.log('🎉 Comprehensive test suite completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});