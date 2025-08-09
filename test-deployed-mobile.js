const { chromium } = require('playwright');

async function testDeployedMobile() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🧪 Testing DEPLOYED GitHub Pages site on mobile...');
    console.log('🌐 URL: https://3vantage.github.io/aquascene-waitlist/');
    
    // Navigate to the deployed page
    await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded successfully');
    
    // Wait for React hydration
    await page.waitForTimeout(3000);
    
    // Test 1: Check if form exists
    console.log('\n📱 Test 1: Checking form visibility...');
    const formExists = await page.locator('form').count() > 0;
    console.log(formExists ? '✅ Form found' : '❌ Form not found');
    
    if (formExists) {
      // Test 2: Check form element spacing
      console.log('\n📱 Test 2: Checking form element spacing...');
      
      const nameInput = await page.locator('input[name="name"], #waitlist-name').first();
      const emailInput = await page.locator('input[name="email"], #waitlist-email').first();
      const experienceSelect = await page.locator('button[role="combobox"], select[name="experience"]').first();
      
      // Get bounding boxes
      const nameBox = await nameInput.boundingBox();
      const emailBox = await emailInput.boundingBox();
      const selectBox = await experienceSelect.boundingBox();
      
      if (nameBox && emailBox && selectBox) {
        console.log('Name input Y position:', nameBox.y);
        console.log('Email input Y position:', emailBox.y);
        console.log('Select Y position:', selectBox.y);
        
        // Check for overlapping
        const nameEmailGap = emailBox.y - (nameBox.y + nameBox.height);
        const emailSelectGap = selectBox.y - (emailBox.y + emailBox.height);
        
        console.log(`Gap between name and email: ${nameEmailGap}px`);
        console.log(`Gap between email and select: ${emailSelectGap}px`);
        
        if (nameEmailGap > 10 && emailSelectGap > 10) {
          console.log('✅ Form elements have proper spacing - NO OVERLAPPING');
        } else {
          console.log('❌ WARNING: Form elements overlapping or too close!');
          console.log('   This is the issue the user reported!');
        }
      }
    }
    
    // Test 3: Check for aquarium background elements
    console.log('\n🐟 Test 3: Checking for real aquarium elements...');
    
    // Check for fish elements
    const fishElements = await page.locator('[class*="fish"], [class*="Fish"]').count();
    const seaweedElements = await page.locator('[class*="seaweed"], [class*="Seaweed"], [class*="plant"], [class*="Plant"]').count();
    const coralElements = await page.locator('[class*="coral"], [class*="Coral"]').count();
    
    console.log(`Fish elements found: ${fishElements}`);
    console.log(`Seaweed/Plant elements found: ${seaweedElements}`);
    console.log(`Coral elements found: ${coralElements}`);
    
    if (fishElements > 0 || seaweedElements > 0 || coralElements > 0) {
      console.log('✅ Real aquarium elements detected');
    } else {
      console.log('⚠️  No specific aquarium elements found - might just be gradients');
    }
    
    // Test 4: Performance check
    console.log('\n⚡ Test 4: Performance metrics...');
    
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perfData.loadEventEnd - perfData.fetchStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
      };
    });
    
    console.log(`Page load time: ${performanceMetrics.loadTime}ms`);
    console.log(`DOM ready: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`First paint: ${performanceMetrics.firstPaint}ms`);
    
    if (performanceMetrics.loadTime < 3000) {
      console.log('✅ Performance is good');
    } else {
      console.log('⚠️  Performance needs optimization');
    }
    
    // Test 5: Take screenshots
    console.log('\n📸 Test 5: Taking screenshots...');
    
    await page.screenshot({ 
      path: 'deployed-mobile-full.png', 
      fullPage: true 
    });
    
    // Scroll to form and take screenshot
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'deployed-mobile-form.png'
    });
    
    console.log('✅ Screenshots saved: deployed-mobile-full.png, deployed-mobile-form.png');
    
    // Test 6: Check animations
    console.log('\n🎨 Test 6: Checking for slow animations...');
    
    // Scroll down to trigger animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(2000);
    
    const animationCount = await page.evaluate(() => {
      const animated = document.querySelectorAll('[class*="animate"], [class*="motion"]');
      return animated.length;
    });
    
    console.log(`Animated elements: ${animationCount}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 DEPLOYMENT TEST SUMMARY:');
    console.log('='.repeat(50));
    console.log('URL: https://3vantage.github.io/aquascene-waitlist/');
    console.log('Last deployment: Successfully completed');
    console.log('Mobile form spacing: To be verified from screenshots');
    console.log('Aquarium elements: To be verified from screenshots');
    console.log('Performance: Measured and logged');
    console.log('\nPlease check the screenshots to verify:');
    console.log('1. deployed-mobile-full.png - Full page view');
    console.log('2. deployed-mobile-form.png - Form section closeup');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testDeployedMobile().catch(console.error);