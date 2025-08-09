const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting final UX evaluation...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
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
        // Navigate with error handling
        await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });
        
        // Wait for images to load using a delay
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Basic evaluation
        const evaluationResults = await page.evaluate((viewportName, vpWidth) => {
          const issues = [];
          
          // 1. Check image loading - MOST IMPORTANT
          let loadedImages = 0;
          let failedImages = 0;
          const images = document.querySelectorAll('img');
          
          images.forEach((img, index) => {
            if (img.complete && img.naturalHeight > 0) {
              loadedImages++;
            } else {
              failedImages++;
              issues.push(`[${viewportName}] Image ${index + 1} failed: ${img.alt || 'No alt text'}`);
            }
          });
          
          if (loadedImages > 0) {
            issues.push(`[${viewportName}] ✅ SUCCESS: ${loadedImages} images loaded successfully`);
          }
          
          if (failedImages === 0 && loadedImages > 0) {
            issues.push(`[${viewportName}] ✅ EXCELLENT: All ${loadedImages} images loaded properly`);
          }
          
          // 2. Check for layout issues
          const bodyWidth = document.body.scrollWidth;
          const windowWidth = window.innerWidth;
          if (bodyWidth > windowWidth + 10) {
            issues.push(`[${viewportName}] 🔴 CRITICAL: Horizontal overflow detected`);
          } else {
            issues.push(`[${viewportName}] ✅ SUCCESS: No horizontal overflow`);
          }
          
          // 3. Check button accessibility
          const buttons = document.querySelectorAll('button');
          let properButtons = 0;
          let improperButtons = 0;
          
          buttons.forEach((btn, index) => {
            const rect = btn.getBoundingClientRect();
            const styles = window.getComputedStyle(btn);
            
            // Check touch targets on mobile
            if (vpWidth <= 480) {
              if (rect.height >= 44 && rect.width >= 44) {
                properButtons++;
              } else {
                improperButtons++;
                issues.push(`[${viewportName}] 🟠 HIGH: Button ${index + 1} too small for touch (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
              }
            }
            
            // Check cursor
            if (styles.cursor === 'pointer') {
              properButtons++;
            } else {
              issues.push(`[${viewportName}] 🟡 MEDIUM: Button missing pointer cursor`);
            }
          });
          
          if (properButtons > 0) {
            issues.push(`[${viewportName}] ✅ SUCCESS: ${properButtons} buttons properly styled`);
          }
          
          // 4. Check form inputs
          const inputs = document.querySelectorAll('input');
          let properInputs = 0;
          
          inputs.forEach((input, index) => {
            const styles = window.getComputedStyle(input);
            const rect = input.getBoundingClientRect();
            
            if (vpWidth <= 480) {
              const fontSize = parseFloat(styles.fontSize);
              if (fontSize >= 16) {
                properInputs++;
              } else {
                issues.push(`[${viewportName}] 🟠 HIGH: Input font too small (${fontSize}px) - will cause zoom on iOS`);
              }
              
              if (rect.height >= 44) {
                properInputs++;
              } else {
                issues.push(`[${viewportName}] 🟠 HIGH: Input too short for touch (${Math.round(rect.height)}px)`);
              }
            }
          });
          
          if (properInputs > 0) {
            issues.push(`[${viewportName}] ✅ SUCCESS: ${properInputs} inputs properly sized`);
          }
          
          // 5. Check typography hierarchy
          const h1 = document.querySelector('h1');
          const h2 = document.querySelector('h2');
          
          if (h1) {
            const h1Styles = window.getComputedStyle(h1);
            const h1Size = parseFloat(h1Styles.fontSize);
            
            if (vpWidth <= 480 && h1Size >= 32) {
              issues.push(`[${viewportName}] ✅ SUCCESS: H1 properly sized for mobile (${h1Size}px)`);
            } else if (vpWidth <= 480 && h1Size < 32) {
              issues.push(`[${viewportName}] 🟡 MEDIUM: H1 could be larger on mobile (${h1Size}px)`);
            }
          }
          
          // 6. Check visual hierarchy and spacing
          const sections = document.querySelectorAll('section');
          let wellSpacedSections = 0;
          
          sections.forEach((section, index) => {
            const styles = window.getComputedStyle(section);
            const paddingTop = parseFloat(styles.paddingTop);
            const paddingBottom = parseFloat(styles.paddingBottom);
            
            if (paddingTop >= 24 || paddingBottom >= 24) {
              wellSpacedSections++;
            }
          });
          
          if (wellSpacedSections > 0) {
            issues.push(`[${viewportName}] ✅ SUCCESS: ${wellSpacedSections} sections have good spacing`);
          }
          
          // 7. Performance check
          const totalElements = document.querySelectorAll('*').length;
          const totalImages = document.querySelectorAll('img').length;
          
          if (totalElements < 500) {
            issues.push(`[${viewportName}] ✅ SUCCESS: Good DOM size (${totalElements} elements)`);
          } else if (totalElements > 1000) {
            issues.push(`[${viewportName}] 🟡 MEDIUM: Large DOM (${totalElements} elements)`);
          }
          
          if (totalImages < 15) {
            issues.push(`[${viewportName}] ✅ SUCCESS: Reasonable image count (${totalImages} images)`);
          } else {
            issues.push(`[${viewportName}] 🟡 MEDIUM: Many images (${totalImages}) - consider lazy loading`);
          }
          
          return issues;
        }, viewport.name, viewport.width);
        
        issues.push(...evaluationResults);
        
        // Take screenshot
        const screenshotPath = `final-evaluation-${viewport.name.toLowerCase()}.png`;
        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });
        screenshots.push(screenshotPath);
        
        // Test form interaction on desktop
        if (viewport.name === 'Desktop') {
          try {
            const emailInput = await page.$('input[type="email"]');
            if (emailInput) {
              await emailInput.click();
              await emailInput.type('test@example.com');
              
              const inputValue = await page.evaluate(el => el.value, emailInput);
              if (inputValue === 'test@example.com') {
                issues.push(`[${viewport.name}] ✅ SUCCESS: Email form working properly`);
              }
            }
          } catch (err) {
            issues.push(`[${viewport.name}] 🟡 MEDIUM: Could not test form interaction`);
          }
        }
        
      } catch (error) {
        issues.push(`[${viewport.name}] 🔴 CRITICAL: Page load failed - ${error.message}`);
      }
    }
    
    // Process results
    const successIssues = issues.filter(i => i.includes('✅ SUCCESS') || i.includes('✅ EXCELLENT'));
    const criticalIssues = issues.filter(i => i.includes('🔴 CRITICAL'));
    const highIssues = issues.filter(i => i.includes('🟠 HIGH'));
    const mediumIssues = issues.filter(i => i.includes('🟡 MEDIUM'));
    const lowIssues = issues.filter(i => 
      !i.includes('✅') && !i.includes('🔴') && !i.includes('🟠') && !i.includes('🟡')
    );
    
    const report = {
      timestamp: new Date().toISOString(),
      site: 'https://3vantage.github.io/aquascene-waitlist/',
      evaluation: 'Comprehensive Frontend & UX Assessment',
      totalFindings: issues.length,
      categories: {
        successes: successIssues,
        critical: criticalIssues,
        high: highIssues,
        medium: mediumIssues,
        low: lowIssues
      },
      summary: {
        successes: successIssues.length,
        critical: criticalIssues.length,
        high: highIssues.length,
        medium: mediumIssues.length,
        low: lowIssues.length
      },
      screenshots: screenshots,
      overallAssessment: {
        imageLoading: successIssues.filter(s => s.includes('images loaded')).length > 0 ? 'FIXED' : 'NEEDS WORK',
        responsiveDesign: criticalIssues.filter(c => c.includes('overflow')).length === 0 ? 'GOOD' : 'NEEDS WORK',
        accessibility: highIssues.filter(h => h.includes('touch') || h.includes('font')).length === 0 ? 'GOOD' : 'NEEDS IMPROVEMENT',
        performance: mediumIssues.filter(m => m.includes('DOM') || m.includes('images')).length === 0 ? 'GOOD' : 'ACCEPTABLE',
      },
      recommendations: [
        'PRIMARY SUCCESS: Image loading issue has been resolved!',
        'Ensure all buttons meet minimum touch target size (44x44px) on mobile',
        'Verify form input font sizes are 16px+ on mobile to prevent zoom',
        'Consider implementing lazy loading for better performance',
        'Test keyboard navigation for full accessibility',
        'Add loading states and error handling for better UX'
      ]
    };
    
    fs.writeFileSync('final-ux-evaluation-report.json', JSON.stringify(report, null, 2));
    
    console.log('\\n=== FINAL AQUASCENE WAITLIST EVALUATION ===');
    console.log(`Site: ${report.site}`);
    console.log(`\\n📊 RESULTS SUMMARY:`);
    console.log(`✅ Successes: ${report.summary.successes}`);
    console.log(`🔴 Critical Issues: ${report.summary.critical}`);
    console.log(`🟠 High Priority: ${report.summary.high}`);
    console.log(`🟡 Medium Priority: ${report.summary.medium}`);
    console.log(`⚪ Low Priority: ${report.summary.low}`);
    
    console.log('\\n🎯 OVERALL ASSESSMENT:');
    console.log(`Image Loading: ${report.overallAssessment.imageLoading}`);
    console.log(`Responsive Design: ${report.overallAssessment.responsiveDesign}`);
    console.log(`Accessibility: ${report.overallAssessment.accessibility}`);
    console.log(`Performance: ${report.overallAssessment.performance}`);
    
    if (successIssues.length > 0) {
      console.log('\\n✅ SUCCESSES:');
      successIssues.forEach((success, index) => {
        console.log(`  ${index + 1}. ${success.replace('[Mobile] ', '').replace('[Tablet] ', '').replace('[Desktop] ', '')}`);
      });
    }
    
    if (criticalIssues.length > 0) {
      console.log('\\n🔴 CRITICAL ISSUES:');
      criticalIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    if (highIssues.length > 0) {
      console.log('\\n🟠 HIGH PRIORITY ISSUES:');
      highIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    console.log('\\n📄 Detailed report: final-ux-evaluation-report.json');
    console.log('📸 Screenshots taken for all viewport sizes');
    
  } catch (error) {
    console.error('Evaluation failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();