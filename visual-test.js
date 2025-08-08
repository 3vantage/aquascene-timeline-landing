const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureWebsite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to standard desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('📸 Navigating to website...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  // Capture initial state
  console.log('📸 Capturing initial state...');
  await page.screenshot({ 
    path: path.join(screenshotsDir, '1-initial-load.png'),
    fullPage: true 
  });
  
  // Try to find and click play button
  console.log('📸 Looking for play button...');
  const playButton = await page.locator('button:has-text("Play Timeline")').first();
  if (await playButton.isVisible()) {
    await playButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, '2-after-play-click.png'),
      fullPage: true 
    });
  }
  
  // Scroll to see what's below
  console.log('📸 Scrolling down...');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: path.join(screenshotsDir, '3-scrolled-down.png'),
    fullPage: false 
  });
  
  // Check for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console error:', msg.text());
    }
  });
  
  // Get page content for debugging
  const content = await page.content();
  fs.writeFileSync(path.join(screenshotsDir, 'page-content.html'), content);
  
  console.log('✅ Screenshots saved to:', screenshotsDir);
  
  await browser.close();
}

captureWebsite().catch(console.error);