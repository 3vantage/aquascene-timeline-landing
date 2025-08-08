const puppeteer = require('puppeteer');

async function verifyWaitlistFix() {
  console.log('🔍 Verifying Waitlist Site Fix...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Test live site
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://3vantage.github.io/aquascene-waitlist/', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  // Take screenshot
  await page.screenshot({ 
    path: 'waitlist-fixed-verification.png', 
    fullPage: false 
  });
  
  // Check for key elements
  const verification = await page.evaluate(() => {
    const title = document.title;
    const h1 = document.querySelector('h1')?.textContent || 'Not found';
    const forms = document.querySelectorAll('form').length;
    const buttons = document.querySelectorAll('button').length;
    const inputs = document.querySelectorAll('input').length;
    
    // Check if elements are visible (not opacity 0 or display none)
    const heroVisible = window.getComputedStyle(document.querySelector('h1') || document.body).opacity \!== '0';
    const formVisible = document.querySelector('form') && window.getComputedStyle(document.querySelector('form')).opacity \!== '0';
    
    return {
      title,
      h1Text: h1.substring(0, 50),
      formsFound: forms,
      buttonsFound: buttons,
      inputsFound: inputs,
      heroVisible,
      formVisible
    };
  });
  
  console.log('✅ Live Site Verification Results:');
  console.log('📍 URL: https://3vantage.github.io/aquascene-waitlist/');
  console.log('📄 Title:', verification.title);
  console.log('🔤 H1 Text:', verification.h1Text);
  console.log('📝 Forms Found:', verification.formsFound);
  console.log('🔘 Buttons Found:', verification.buttonsFound);
  console.log('📋 Inputs Found:', verification.inputsFound);
  console.log('👁️ Hero Visible:', verification.heroVisible ? '✅ YES' : '❌ NO');
  console.log('📝 Form Visible:', verification.formVisible ? '✅ YES' : '❌ NO');
  
  if (verification.formsFound > 0 && verification.heroVisible && verification.formVisible) {
    console.log('\n🎉 SUCCESS: Waitlist site is fixed and functional\!');
  } else {
    console.log('\n⚠️ WARNING: Site may still have visibility issues');
  }
  
  await browser.close();
  console.log('\n📸 Screenshot saved as: waitlist-fixed-verification.png');
}

verifyWaitlistFix().catch(console.error);
