const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting frontend evaluation...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const issues = [];
    const screenshots = [];
    
    // Test at different viewports
    const viewports = [
      { width: 375, height: 812, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      console.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      await page.setViewport(viewport);
      
      try {
        await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        // Check for layout issues
        const layoutIssues = await page.evaluate((viewportName) => {
          const issues = [];
          
          // Check for horizontal scroll
          if (document.body.scrollWidth > window.innerWidth) {
            issues.push(`[${viewportName}] Horizontal overflow detected`);
          }
          
          // Check images loading
          const images = document.querySelectorAll('img');
          images.forEach((img, index) => {
            if (!img.complete || img.naturalHeight === 0) {
              issues.push(`[${viewportName}] Image failed to load: ${img.src || 'unknown'}`);
            }
          });
          
          // Check for basic responsive issues
          const elements = document.querySelectorAll('*');
          let elementsOffScreen = 0;
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 10) {
              elementsOffScreen++;
            }
          });
          
          if (elementsOffScreen > 5) {
            issues.push(`[${viewportName}] Multiple elements extending beyond viewport`);
          }
          
          // Check button styles
          const buttons = document.querySelectorAll('button');
          buttons.forEach((btn, index) => {
            const styles = window.getComputedStyle(btn);
            if (styles.cursor !== 'pointer' && !btn.disabled) {
              issues.push(`[${viewportName}] Button ${index + 1} missing cursor pointer`);
            }
            
            // Check if buttons have proper touch targets on mobile
            if (window.innerWidth <= 480) {
              const rect = btn.getBoundingClientRect();
              if (rect.height < 44 || rect.width < 44) {
                issues.push(`[${viewportName}] Button ${index + 1} too small for touch (${Math.round(rect.width)}x${Math.round(rect.height)})`);
              }
            }
          });
          
          // Check form elements
          const inputs = document.querySelectorAll('input');
          inputs.forEach((input, index) => {
            const styles = window.getComputedStyle(input);
            if (styles.fontSize && parseFloat(styles.fontSize) < 16 && window.innerWidth <= 480) {
              issues.push(`[${viewportName}] Input ${index + 1} font size too small for mobile`);
            }
          });
          
          return issues;
        }, viewport.name);
        
        issues.push(...layoutIssues);
        
        // Take screenshot
        const screenshotPath = `evaluation-${viewport.name.toLowerCase()}.png`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        screenshots.push(screenshotPath);
        
      } catch (error) {
        issues.push(`[${viewport.name}] Error loading page: ${error.message}`);
      }
    }
    
    // Test interactive elements on desktop
    console.log('Testing interactive elements...');
    await page.setViewport({ width: 1440, height: 900 });
    
    try {
      await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      const interactionIssues = await page.evaluate(() => {
        const issues = [];
        
        // Test email input
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
          emailInput.focus();
          if (document.activeElement !== emailInput) {
            issues.push('Email input not focusable');
          }
          
          // Test input validation
          emailInput.value = 'invalid-email';
          if (emailInput.checkValidity()) {
            issues.push('Email validation not working');
          }
          
          emailInput.value = 'test@example.com';
          if (!emailInput.checkValidity()) {
            issues.push('Valid email rejected');
          }
        } else {
          issues.push('Email input not found');
        }
        
        // Check console errors
        return issues;
      });
      
      issues.push(...interactionIssues);
      
    } catch (error) {
      issues.push(`Error testing interactions: ${error.message}`);
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues,
      screenshots: screenshots,
      summary: {
        critical: issues.filter(i => 
          i.includes('failed to load') || 
          i.includes('Error loading') ||
          i.includes('overflow')
        ).length,
        high: issues.filter(i => 
          i.includes('extending beyond') || 
          i.includes('too small for touch') ||
          i.includes('not focusable')
        ).length,
        medium: issues.filter(i => 
          i.includes('cursor') || 
          i.includes('font size') ||
          i.includes('validation')
        ).length,
        low: 0
      }
    };
    
    // Calculate low priority issues
    report.summary.low = report.totalIssues - (report.summary.critical + report.summary.high + report.summary.medium);
    
    fs.writeFileSync('frontend-evaluation-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n=== EVALUATION COMPLETE ===');
    console.log(`Total issues found: ${issues.length}`);
    console.log(`Critical: ${report.summary.critical}`);
    console.log(`High: ${report.summary.high}`);
    console.log(`Medium: ${report.summary.medium}`);
    console.log(`Low: ${report.summary.low}`);
    console.log('\nDetailed report saved to frontend-evaluation-report.json');
    
    if (issues.length > 0) {
      console.log('\n=== ISSUES FOUND ===');
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }
    
  } catch (error) {
    console.error('Evaluation failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();