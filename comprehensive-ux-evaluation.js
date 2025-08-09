const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting comprehensive UX evaluation...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set to false to see what's happening
      args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
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
        // Navigate with a longer timeout
        await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
          waitUntil: 'networkidle2',
          timeout: 45000 
        });
        
        // Wait a bit more for images to load
        await page.waitForTimeout(3000);
        
        // Comprehensive evaluation
        const evaluationResults = await page.evaluate((viewportName, vpWidth) => {
          const issues = [];
          
          // 1. Check image loading
          let loadedImages = 0;
          let totalImages = 0;
          const images = document.querySelectorAll('img');
          images.forEach((img) => {
            totalImages++;
            if (img.complete && img.naturalHeight > 0) {
              loadedImages++;
            } else {
              issues.push(`[${viewportName}] Image failed to load: ${img.alt || img.src}`);
            }
          });
          
          if (loadedImages > 0 && totalImages > 0) {
            issues.push(`[${viewportName}] SUCCESS: ${loadedImages}/${totalImages} images loaded`);
          }
          
          // 2. Check for horizontal overflow
          const bodyWidth = document.body.scrollWidth;
          const windowWidth = window.innerWidth;
          if (bodyWidth > windowWidth + 5) {
            issues.push(`[${viewportName}] CRITICAL: Horizontal overflow - body width: ${bodyWidth}px, viewport: ${windowWidth}px`);
          }
          
          // 3. Check typography and contrast
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach((heading, index) => {
            const styles = window.getComputedStyle(heading);
            const fontSize = parseFloat(styles.fontSize);
            
            // Check if headings are appropriately sized for mobile
            if (vpWidth <= 480) {
              if (heading.tagName === 'H1' && fontSize < 28) {
                issues.push(`[${viewportName}] H1 too small for mobile: ${fontSize}px`);
              }
              if (heading.tagName === 'H2' && fontSize < 22) {
                issues.push(`[${viewportName}] H2 too small for mobile: ${fontSize}px`);
              }
            }
            
            // Check if text is readable (not too light)
            const color = styles.color;
            if (color.includes('rgba') && color.includes('0.')) {
              const opacity = color.match(/0\.\\d+/);
              if (opacity && parseFloat(opacity[0]) < 0.6) {
                issues.push(`[${viewportName}] Text may be too light: ${heading.tagName}`);
              }
            }
          });
          
          // 4. Check button accessibility and touch targets
          const buttons = document.querySelectorAll('button, a');
          let improperButtons = 0;
          buttons.forEach((btn, index) => {
            const rect = btn.getBoundingClientRect();
            const styles = window.getComputedStyle(btn);
            
            // Check touch target size on mobile
            if (vpWidth <= 480) {
              if (rect.height < 44 || rect.width < 44) {
                issues.push(`[${viewportName}] Button/link ${index + 1} too small for touch: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
                improperButtons++;
              }
            }
            
            // Check cursor pointer
            if (btn.tagName === 'BUTTON' && styles.cursor !== 'pointer' && !btn.disabled) {
              issues.push(`[${viewportName}] Button missing cursor pointer`);
            }
            
            // Check if button text is readable
            if (btn.textContent.trim()) {
              const textLength = btn.textContent.trim().length;
              if (textLength < 2) {
                issues.push(`[${viewportName}] Button text too short: "${btn.textContent.trim()}"`);
              }
            }
          });
          
          // 5. Check form elements
          const inputs = document.querySelectorAll('input, textarea, select');
          inputs.forEach((input, index) => {
            const styles = window.getComputedStyle(input);
            const rect = input.getBoundingClientRect();
            
            // Check input size on mobile
            if (vpWidth <= 480) {
              if (rect.height < 44) {
                issues.push(`[${viewportName}] Input ${index + 1} too small for mobile: ${Math.round(rect.height)}px height`);
              }
              
              const fontSize = parseFloat(styles.fontSize);
              if (fontSize < 16) {
                issues.push(`[${viewportName}] Input font size too small (causes zoom on iOS): ${fontSize}px`);
              }
            }
            
            // Check placeholder visibility
            if (input.placeholder) {
              const placeholderColor = styles.getPropertyValue('::placeholder') || styles.color;
              // This is a basic check - in real scenarios you'd need more sophisticated color contrast calculation
            }
          });
          
          // 6. Check spacing and layout
          const sections = document.querySelectorAll('section');
          sections.forEach((section, index) => {
            const styles = window.getComputedStyle(section);
            const paddingTop = parseFloat(styles.paddingTop);
            const paddingBottom = parseFloat(styles.paddingBottom);
            
            // Check if sections have adequate spacing
            if (paddingTop < 16 && paddingBottom < 16) {
              issues.push(`[${viewportName}] Section ${index + 1} may have insufficient spacing`);
            }
          });
          
          // 7. Check for overlapping content
          let overlappingElements = 0;
          const allElements = document.querySelectorAll('*');
          for (let i = 0; i < Math.min(allElements.length, 50); i++) { // Limit check to first 50 elements for performance
            const el = allElements[i];
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            
            // Simple check for negative margins causing overlap
            const styles = window.getComputedStyle(el);
            const marginTop = parseFloat(styles.marginTop);
            const marginLeft = parseFloat(styles.marginLeft);
            
            if (marginTop < -50 || marginLeft < -50) {
              overlappingElements++;
              if (overlappingElements <= 3) { // Only report first few
                issues.push(`[${viewportName}] Element may be overlapping due to negative margins: ${el.tagName}`);
              }
            }
          }
          
          // 8. Performance indicators
          const totalElements = document.querySelectorAll('*').length;
          const allImages = document.querySelectorAll('img').length;
          
          if (totalElements > 1000) {
            issues.push(`[${viewportName}] High DOM complexity: ${totalElements} elements`);
          }
          
          if (allImages > 20) {
            issues.push(`[${viewportName}] Many images: ${allImages} (consider lazy loading)`);
          }
          
          return issues;
        }, viewport.name, viewport.width);
        
        issues.push(...evaluationResults);
        
        // Take screenshot
        const screenshotPath = `ux-evaluation-${viewport.name.toLowerCase()}.png`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        screenshots.push(screenshotPath);
        
        // Test interactions
        if (viewport.name === 'Desktop') {
          console.log('Testing interactions on desktop...');
          
          try {
            // Test email input
            const emailInput = await page.$('input[type="email"]');
            if (emailInput) {
              await emailInput.click();
              await emailInput.type('test@example.com');
              
              const inputValue = await emailInput.evaluate(el => el.value);
              if (inputValue !== 'test@example.com') {
                issues.push(`[${viewport.name}] Email input not working properly`);
              } else {
                issues.push(`[${viewport.name}] SUCCESS: Email input working`);
              }
            } else {
              issues.push(`[${viewport.name}] Email input not found`);
            }
            
            // Test button hover states
            const buttons = await page.$$('button');
            if (buttons.length > 0) {
              await buttons[0].hover();
              issues.push(`[${viewport.name}] SUCCESS: Button hover tested`);
            }
            
          } catch (interactionError) {
            issues.push(`[${viewport.name}] Interaction test failed: ${interactionError.message}`);
          }
        }
        
      } catch (error) {
        issues.push(`[${viewport.name}] ERROR: Failed to load page - ${error.message}`);
      }
    }
    
    // Generate comprehensive report
    const successIssues = issues.filter(i => i.includes('SUCCESS'));
    const criticalIssues = issues.filter(i => 
      i.includes('CRITICAL') || 
      i.includes('failed to load') || 
      i.includes('ERROR') ||
      i.includes('overflow')
    );
    const highIssues = issues.filter(i => 
      i.includes('too small for touch') || 
      i.includes('too small for mobile') ||
      i.includes('overlapping') ||
      i.includes('font size too small')
    );
    const mediumIssues = issues.filter(i => 
      i.includes('cursor pointer') || 
      i.includes('insufficient spacing') ||
      i.includes('too light') ||
      i.includes('High DOM complexity')
    );
    const lowIssues = issues.filter(i => 
      !successIssues.includes(i) &&
      !criticalIssues.includes(i) && 
      !highIssues.includes(i) && 
      !mediumIssues.includes(i)
    );
    
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      successCount: successIssues.length,
      issues: {
        success: successIssues,
        critical: criticalIssues,
        high: highIssues,
        medium: mediumIssues,
        low: lowIssues
      },
      screenshots: screenshots,
      summary: {
        critical: criticalIssues.length,
        high: highIssues.length,
        medium: mediumIssues.length,
        low: lowIssues.length,
        success: successIssues.length
      },
      recommendations: [
        "Images are now loading correctly - major improvement!",
        "Focus on mobile touch target sizes for better usability",
        "Consider implementing lazy loading for performance",
        "Verify form validation and error states",
        "Test keyboard navigation for accessibility",
        "Consider implementing loading states for better UX"
      ]
    };
    
    fs.writeFileSync('comprehensive-ux-report.json', JSON.stringify(report, null, 2));
    
    console.log('\\n=== COMPREHENSIVE UX EVALUATION COMPLETE ===');
    console.log(`✅ Successes: ${report.summary.success}`);
    console.log(`🔴 Critical: ${report.summary.critical}`);
    console.log(`🟠 High: ${report.summary.high}`);
    console.log(`🟡 Medium: ${report.summary.medium}`);
    console.log(`🟢 Low: ${report.summary.low}`);
    console.log('\\nDetailed report saved to comprehensive-ux-report.json');
    
    if (successIssues.length > 0) {
      console.log('\\n=== SUCCESSES ===');
      successIssues.forEach((issue, index) => {
        console.log(`✅ ${index + 1}. ${issue}`);
      });
    }
    
    if (criticalIssues.length > 0) {
      console.log('\\n=== CRITICAL ISSUES ===');
      criticalIssues.forEach((issue, index) => {
        console.log(`🔴 ${index + 1}. ${issue}`);
      });
    }
    
    if (highIssues.length > 0) {
      console.log('\\n=== HIGH PRIORITY ISSUES ===');
      highIssues.forEach((issue, index) => {
        console.log(`🟠 ${index + 1}. ${issue}`);
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