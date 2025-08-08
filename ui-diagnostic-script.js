const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzeUI() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🔍 Loading the waitlist application...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, 'ui-analysis-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    console.log('📸 Taking initial full-page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '1-full-page-initial.png'),
      fullPage: true
    });

    // Analyze contrast and text issues
    console.log('🔍 Analyzing contrast and visibility issues...');
    const textAnalysis = await page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach((el, index) => {
        if (el.textContent && el.textContent.trim()) {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          const fontSize = styles.fontSize;
          const position = styles.position;
          const zIndex = styles.zIndex;
          
          // Check for potential contrast issues
          if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            issues.push({
              element: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''),
              text: el.textContent.trim().substring(0, 50),
              color: color,
              backgroundColor: backgroundColor,
              fontSize: fontSize,
              position: position,
              zIndex: zIndex,
              rect: el.getBoundingClientRect()
            });
          }
        }
      });
      
      return issues;
    });

    // Look specifically for form elements
    console.log('📋 Analyzing form elements...');
    await page.waitForSelector('form', { timeout: 5000 }).catch(() => console.log('No form found immediately'));
    
    // Scroll to find the waitlist form
    await page.evaluate(() => {
      const waitlistSection = document.querySelector('[class*="waitlist"], [id*="waitlist"], section:has(input), form');
      if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for smooth scroll

    console.log('📸 Taking screenshot focused on form area...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '2-form-focus.png'),
      fullPage: false
    });

    // Analyze form elements specifically
    const formAnalysis = await page.evaluate(() => {
      const formIssues = [];
      const inputs = document.querySelectorAll('input, textarea, select, button, label');
      
      inputs.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        formIssues.push({
          tag: el.tagName,
          type: el.type || 'N/A',
          placeholder: el.placeholder || 'N/A',
          value: el.value || 'N/A',
          text: el.textContent ? el.textContent.trim().substring(0, 30) : 'N/A',
          styles: {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            border: styles.border,
            fontSize: styles.fontSize,
            padding: styles.padding,
            margin: styles.margin,
            opacity: styles.opacity,
            visibility: styles.visibility,
            display: styles.display,
            position: styles.position,
            zIndex: styles.zIndex
          },
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          },
          className: el.className
        });
      });
      
      return formIssues;
    });

    // Take mobile screenshot
    console.log('📱 Testing mobile view...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '3-mobile-view.png'),
      fullPage: true
    });

    // Generate analysis report
    const report = {
      timestamp: new Date().toISOString(),
      textAnalysis: textAnalysis.slice(0, 20), // Limit to first 20 elements to avoid huge output
      formAnalysis: formAnalysis,
      screenshots: [
        '1-full-page-initial.png',
        '2-form-focus.png',
        '3-mobile-view.png'
      ]
    };

    fs.writeFileSync(
      path.join(screenshotsDir, 'ui-analysis-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('✅ UI Analysis complete!');
    console.log('📁 Screenshots saved to:', screenshotsDir);
    console.log('📊 Found', formAnalysis.length, 'form elements to analyze');
    console.log('🔍 Found', textAnalysis.length, 'text elements with styling');

    return report;
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeUI().then((report) => {
  if (report) {
    console.log('\n🎯 Key Findings:');
    console.log('Form Elements Found:', report.formAnalysis.length);
    report.formAnalysis.forEach((item, index) => {
      if (index < 5) { // Show first 5
        console.log(`- ${item.tag}${item.type !== 'N/A' ? '[' + item.type + ']' : ''}: ${item.className}`);
      }
    });
  }
}).catch(console.error);