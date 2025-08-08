const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testUIFixes() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🔍 Testing UI fixes...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(__dirname, 'ui-fix-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }

    console.log('📸 Taking updated full-page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '1-full-page-after-fixes.png'),
      fullPage: true
    });

    // Scroll to form and focus on each field to test the animations
    await page.evaluate(() => {
      const waitlistSection = document.querySelector('[class*="waitlist"], [id*="waitlist"], section:has(input), form');
      if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📸 Taking form focus screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '2-form-after-fixes.png'),
      fullPage: false
    });

    // Test form interactions - focus on name field
    console.log('🔍 Testing name field focus...');
    await page.click('input[placeholder*="full name"]').catch(() => console.log('Name input not found'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, '3-name-field-focused.png'),
      fullPage: false
    });

    // Test email field
    console.log('🔍 Testing email field focus...');
    await page.click('input[type="email"]').catch(() => console.log('Email input not found'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, '4-email-field-focused.png'),
      fullPage: false
    });

    // Test select dropdown
    console.log('🔍 Testing experience select...');
    await page.click('button:has-text("Select your experience")').catch(() => 
      page.click('[role="button"]:has-text("Select")').catch(() => console.log('Select not found'))
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, '5-select-dropdown-open.png'),
      fullPage: false
    });

    // Mobile test
    console.log('📱 Testing mobile view...');
    await page.setViewport({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '6-mobile-after-fixes.png'),
      fullPage: true
    });

    console.log('✅ UI fix testing complete!');
    console.log('📁 Screenshots saved to:', screenshotsDir);

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testUIFixes().catch(console.error);