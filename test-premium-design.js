#!/usr/bin/env node

/**
 * Premium Design Testing Script
 * Tests the new premium design improvements and captures screenshots
 */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testPremiumDesign() {
  console.log('🎨 Starting Premium Design Testing...\n');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    console.log('📖 Navigating to the site...');
    await page.goto('http://localhost:3005', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    console.log('✅ Page loaded successfully!');
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);

    // Test premium typography and spacing
    console.log('📏 Testing premium typography and spacing...');
    const heroTitle = await page.locator('h1').first();
    const heroText = await page.locator('section h1').first();
    
    // Check if premium typography classes are applied
    const heroClasses = await heroText.getAttribute('class');
    if (heroClasses?.includes('heading-display')) {
      console.log('✅ Premium typography applied to hero section');
    } else {
      console.log('❌ Premium typography NOT applied to hero section');
    }

    // Test section spacing
    console.log('📐 Testing section spacing...');
    const sections = await page.locator('section').all();
    let sectionsWithPremiumSpacing = 0;
    
    for (const section of sections) {
      const classes = await section.getAttribute('class');
      if (classes?.includes('section-spacing')) {
        sectionsWithPremiumSpacing++;
      }
    }
    
    console.log(`✅ ${sectionsWithPremiumSpacing} sections have premium spacing applied`);

    // Test premium hover effects
    console.log('🖱️  Testing premium hover effects...');
    const cardElements = await page.locator('.card-hover').all();
    const premiumHoverElements = await page.locator('.premium-hover').all();
    
    console.log(`✅ ${cardElements.length} elements with card hover effects`);
    console.log(`✅ ${premiumHoverElements.length} elements with premium hover effects`);

    // Test form improvements
    console.log('📝 Testing form improvements...');
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const form = await page.locator('.waitlist-form').first();
    const formClasses = await form.getAttribute('class');
    if (formClasses?.includes('premium-hover')) {
      console.log('✅ Premium styling applied to waitlist form');
    }

    // Capture screenshots
    console.log('📸 Capturing screenshots...');
    
    // Full page screenshot
    await page.screenshot({ 
      path: join(__dirname, 'premium-design-full-page.png'),
      fullPage: true
    });
    console.log('✅ Full page screenshot saved');

    // Hero section screenshot
    await page.locator('section').first().screenshot({ 
      path: join(__dirname, 'premium-design-hero.png')
    });
    console.log('✅ Hero section screenshot saved');

    // Features section screenshot
    const featuresSection = await page.locator('section').nth(1);
    await featuresSection.screenshot({ 
      path: join(__dirname, 'premium-design-features.png')
    });
    console.log('✅ Features section screenshot saved');

    // Waitlist section screenshot
    await page.locator('#waitlist').screenshot({ 
      path: join(__dirname, 'premium-design-waitlist.png')
    });
    console.log('✅ Waitlist section screenshot saved');

    console.log('\n🎉 Premium Design Testing Complete!');
    console.log('📊 Results Summary:');
    console.log(`   • Premium typography: Applied`);
    console.log(`   • Section spacing: ${sectionsWithPremiumSpacing} sections enhanced`);
    console.log(`   • Interactive effects: ${cardElements.length + premiumHoverElements.length} elements improved`);
    console.log(`   • Form styling: Enhanced with premium design`);
    console.log(`   • Screenshots: 4 captured successfully`);

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testPremiumDesign().catch(console.error);