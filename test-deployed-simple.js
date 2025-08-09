const { chromium } = require('playwright');

async function testDeployedSimple() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🌐 Testing: https://3vantage.github.io/aquascene-waitlist/');
    
    await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for page to settle
    await page.waitForTimeout(5000);
    
    console.log('📸 Taking mobile screenshots...');
    
    // Full page screenshot
    await page.screenshot({ 
      path: 'deployed-mobile-full.png', 
      fullPage: true 
    });
    
    // Scroll to middle of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'deployed-mobile-middle.png'
    });
    
    // Try to find and screenshot the form
    try {
      const formVisible = await page.locator('form').isVisible();
      if (formVisible) {
        await page.locator('form').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: 'deployed-mobile-form-area.png'
        });
        console.log('✅ Form area screenshot taken');
      }
    } catch (e) {
      console.log('⚠️  Could not capture form area specifically');
    }
    
    console.log('✅ Screenshots saved!');
    console.log('   - deployed-mobile-full.png');
    console.log('   - deployed-mobile-middle.png');
    console.log('   - deployed-mobile-form-area.png');
    
    // Keep browser open for 5 seconds for visual inspection
    console.log('\n👀 Keeping browser open for visual inspection...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testDeployedSimple().catch(console.error);