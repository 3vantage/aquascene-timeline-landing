const { chromium } = require('playwright');

async function testNewDesign() {
  const browser = await chromium.launch({ headless: false });
  
  // Test desktop view
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();
  
  // Test mobile view
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
  });
  const mobilePage = await mobileContext.newPage();
  
  try {
    console.log('🎨 Testing NEW DESIGN with real photography...\n');
    
    // Load desktop version
    console.log('📱 Loading desktop version...');
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000);
    
    // Take desktop screenshots
    await desktopPage.screenshot({ 
      path: 'new-design-desktop-hero.png',
      fullPage: false 
    });
    
    await desktopPage.evaluate(() => window.scrollTo(0, window.innerHeight));
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ 
      path: 'new-design-desktop-styles.png'
    });
    
    await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ 
      path: 'new-design-desktop-gallery.png'
    });
    
    // Load mobile version
    console.log('📱 Loading mobile version...');
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000);
    
    // Take mobile screenshots
    await mobilePage.screenshot({ 
      path: 'new-design-mobile-hero.png',
      fullPage: false 
    });
    
    await mobilePage.evaluate(() => window.scrollTo(0, window.innerHeight));
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ 
      path: 'new-design-mobile-styles.png'
    });
    
    // Test the CTA form on mobile
    await mobilePage.evaluate(() => {
      const cta = document.querySelector('section:last-of-type');
      if (cta) cta.scrollIntoView();
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ 
      path: 'new-design-mobile-cta.png'
    });
    
    console.log('\n✅ Screenshots saved:');
    console.log('   Desktop:');
    console.log('   - new-design-desktop-hero.png');
    console.log('   - new-design-desktop-styles.png');
    console.log('   - new-design-desktop-gallery.png');
    console.log('   Mobile:');
    console.log('   - new-design-mobile-hero.png');
    console.log('   - new-design-mobile-styles.png');
    console.log('   - new-design-mobile-cta.png');
    
    console.log('\n🎯 Key improvements:');
    console.log('   ✓ Real aquascaping photography (not animated backgrounds)');
    console.log('   ✓ Magazine-style layout like Ride Engine');
    console.log('   ✓ Proper content sections with real data');
    console.log('   ✓ Clean, professional design');
    console.log('   ✓ Mobile-responsive grid layouts');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testNewDesign().catch(console.error);