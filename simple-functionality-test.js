#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testFunctionality() {
  console.log('🧪 Running Simple Functionality Test...\n');
  
  const browser = await puppeteer.launch({ headless: false }); // Non-headless for debugging
  const page = await browser.newPage();
  
  try {
    // Navigate to the site
    console.log('📍 Navigating to http://localhost:3006');
    await page.goto('http://localhost:3006', { waitUntil: 'networkidle2' });
    
    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📄 Page title:', await page.title());
    
    // Check for basic elements
    const bodyContent = await page.evaluate(() => {
      return {
        hasMainContent: !!document.querySelector('main'),
        hasForm: !!document.querySelector('form'),
        hasEmailInput: !!document.querySelector('input[type="email"]'),
        hasButton: !!document.querySelector('button'),
        totalElements: document.querySelectorAll('*').length,
        bodyText: document.body.innerText.slice(0, 200) // First 200 chars
      };
    });
    
    console.log('🔍 Page Analysis:');
    console.log(`  • Has main content: ${bodyContent.hasMainContent}`);
    console.log(`  • Has form: ${bodyContent.hasForm}`);
    console.log(`  • Has email input: ${bodyContent.hasEmailInput}`);
    console.log(`  • Has button: ${bodyContent.hasButton}`);
    console.log(`  • Total elements: ${bodyContent.totalElements}`);
    console.log(`  • Page text preview: "${bodyContent.bodyText}"`);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'functionality-test-screenshot.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved to: functionality-test-screenshot.png');
    
    // Performance timing
    const timing = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
        loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
        totalLoadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
      };
    });
    
    console.log('⚡ Performance:');
    console.log(`  • DOM Content Loaded: ${timing.domContentLoaded}ms`);
    console.log(`  • Load Complete: ${timing.loadComplete}ms`);
    console.log(`  • Total Load Time: ${timing.totalLoadTime}ms`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  // Keep browser open for 10 seconds for manual inspection
  console.log('\\n⏰ Keeping browser open for 10 seconds for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  await browser.close();
  console.log('\\n✅ Test completed!');
}

testFunctionality();