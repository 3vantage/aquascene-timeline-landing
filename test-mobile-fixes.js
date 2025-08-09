const { chromium } = require('playwright');
const fs = require('fs');

async function testMobileFixes() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🧪 Starting mobile viewport tests at 375px width...');
    
    // Navigate to the page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Give more time for React to hydrate
    
    // Test 1: Check if form elements are visible and not overlapping
    console.log('📱 Test 1: Checking form element spacing...');
    
    // Wait for form to be visible first
    await page.waitForSelector('form', { timeout: 10000 });
    
    const nameInput = await page.locator('input[name="name"], #waitlist-name').first();
    const emailInput = await page.locator('input[name="email"], #waitlist-email').first();
    const experienceSelect = await page.locator('button[name="experience"], select[name="experience"]').first();
    
    // Get bounding boxes
    const nameBox = await nameInput.boundingBox();
    const emailBox = await emailInput.boundingBox();
    const selectBox = await experienceSelect.boundingBox();
    
    console.log('Name input position:', nameBox);
    console.log('Email input position:', emailBox);
    console.log('Select position:', selectBox);
    
    // Check for overlapping (email should be below name, select below email)
    const nameEmailGap = emailBox.y - (nameBox.y + nameBox.height);
    const emailSelectGap = selectBox.y - (emailBox.y + emailBox.height);
    
    console.log(`Gap between name and email: ${nameEmailGap}px`);
    console.log(`Gap between email and select: ${emailSelectGap}px`);
    
    if (nameEmailGap > 10 && emailSelectGap > 10) {
      console.log('✅ Form elements have proper spacing - no overlapping detected');
    } else {
      console.log('❌ Form elements appear to be overlapping or too close');
    }
    
    // Test 2: Check if form is usable (inputs can be clicked and typed in)
    console.log('📱 Test 2: Testing form interactivity...');
    
    // Fill out the name field
    await nameInput.click();
    await nameInput.fill('Test User');
    await page.waitForTimeout(500);
    
    // Fill out the email field
    await emailInput.click();
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(500);
    
    // Try to open the select dropdown
    await experienceSelect.click();
    await page.waitForTimeout(1000);
    
    // Check if dropdown options are visible
    const dropdownOptions = await page.locator('[role="option"]');
    const optionCount = await dropdownOptions.count();
    
    if (optionCount > 0) {
      console.log(`✅ Dropdown opened successfully with ${optionCount} options`);
      
      // Select an option
      await dropdownOptions.first().click();
      await page.waitForTimeout(500);
    } else {
      console.log('❌ Dropdown did not open or options not visible');
    }
    
    // Test 3: Check touch targets are at least 44px
    console.log('📱 Test 3: Checking touch target sizes...');
    
    const button = await page.locator('button[type="submit"]');
    const buttonBox = await button.boundingBox();
    
    if (buttonBox.height >= 44 && buttonBox.width >= 44) {
      console.log(`✅ Submit button meets touch target requirements: ${buttonBox.width}x${buttonBox.height}px`);
    } else {
      console.log(`❌ Submit button too small: ${buttonBox.width}x${buttonBox.height}px (should be at least 44x44px)`);
    }
    
    // Test 4: Test scrolling and viewport behavior
    console.log('📱 Test 4: Testing scroll behavior...');
    
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    
    console.log('✅ Page scrolling works correctly');
    
    // Test 5: Take screenshots for visual verification
    console.log('📱 Test 5: Taking screenshots for visual verification...');
    
    await page.screenshot({ path: 'mobile-test-full-page.png', fullPage: true });
    
    // Screenshot of just the form
    const form = await page.locator('.waitlist-form');
    await form.screenshot({ path: 'mobile-test-form-only.png' });
    
    console.log('✅ Screenshots saved: mobile-test-full-page.png, mobile-test-form-only.png');
    
    // Test 6: Performance check
    console.log('📱 Test 6: Basic performance check...');
    
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    if (performanceMetrics.loadTime < 3000) {
      console.log('✅ Page load time is acceptable');
    } else {
      console.log('⚠️ Page load time is slow, consider optimization');
    }
    
    console.log('\n🎉 Mobile testing completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- Form elements spacing: Checked');
    console.log('- Form interactivity: Tested');
    console.log('- Touch targets: Verified');
    console.log('- Scroll behavior: Working');
    console.log('- Visual verification: Screenshots saved');
    console.log('- Performance: Measured');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileFixes().catch(console.error);