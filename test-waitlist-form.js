const { test, expect, chromium } = require('@playwright/test');

async function testWaitlistForm() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting waitlist form test...');
    
    // Navigate to the page
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);
    
    console.log('📄 Page loaded successfully');
    
    // Find and fill the form
    const nameInput = await page.locator('input[name="name"]').first();
    const emailInput = await page.locator('input[name="email"]').first();
    
    // Ensure form elements are visible
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    
    console.log('✅ Form elements are visible');
    
    // Fill out the form
    await nameInput.fill('John Doe');
    await page.waitForTimeout(500);
    
    await emailInput.fill('john.doe@example.com');
    await page.waitForTimeout(500);
    
    // Select experience level (it's a button, not a select)
    const experienceSelect = await page.locator('button[aria-labelledby="select-experience-label"]');
    await experienceSelect.click();
    await page.waitForTimeout(1000);
    
    // Try to find and click the intermediate option in the dropdown
    try {
      const intermediateOption = await page.locator('text=Intermediate').first();
      await intermediateOption.click();
      await page.waitForTimeout(500);
      console.log('✅ Experience level selected');
    } catch (e) {
      console.log('⚠️ Could not select experience level - dropdown might not have opened');
    }
    
    // Check at least one interest
    const interestCheckbox = await page.locator('input[type="checkbox"]').first();
    await interestCheckbox.check();
    await page.waitForTimeout(500);
    
    // Check GDPR consent
    const gdprCheckbox = await page.locator('input[id="gdprConsent"]');
    await gdprCheckbox.check();
    await page.waitForTimeout(500);
    
    console.log('📝 Form filled successfully');
    
    // Submit the form
    const submitButton = await page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    // Check if the button is enabled
    const isEnabled = await submitButton.isEnabled();
    console.log('🎯 Submit button enabled:', isEnabled);
    
    if (isEnabled) {
      await submitButton.click();
      console.log('🚀 Form submitted');
      
      // Wait for either success or error state
      try {
        // Wait for success message or error
        await page.waitForSelector('.text-white', { timeout: 10000 });
        
        // Check for success indicators
        const successElement = await page.locator('text=Welcome, Fellow Aquascaper').first();
        const errorElement = await page.locator('text=Something went wrong').first();
        
        if (await successElement.isVisible()) {
          console.log('🎉 SUCCESS: Form submission completed successfully!');
          
          // Check for position number
          const positionElement = await page.locator('text=You\'re #').first();
          if (await positionElement.isVisible()) {
            console.log('✅ Position number displayed');
          }
        } else if (await errorElement.isVisible()) {
          console.log('❌ ERROR: Form submission failed');
          
          // Check for retry button
          const retryButton = await page.locator('text=Try Again').first();
          if (await retryButton.isVisible()) {
            console.log('🔄 Retry button is available');
          }
        } else {
          console.log('⚠️  Unknown state after submission');
        }
        
      } catch (error) {
        console.log('⏰ Timeout waiting for response - this might indicate a problem');
      }
      
    } else {
      console.log('❌ Submit button is disabled - form validation might be failing');
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'waitlist-form-test.png', fullPage: true });
    console.log('📸 Screenshot saved as waitlist-form-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'waitlist-form-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Run the test
testWaitlistForm();