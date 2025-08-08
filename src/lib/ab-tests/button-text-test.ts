'use client';

import { abTesting, ABTestConfig } from '../ab-testing';

// Button Text A/B Test Configuration
export const buttonTextTestConfig: ABTestConfig = {
  name: 'waitlist_button_text',
  description: 'Testing different call-to-action button texts for waitlist signup',
  hypothesis: 'More specific and benefit-focused button text will increase conversion rates',
  successMetric: 'waitlist_join conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100, // 100% of users in this test
  startDate: new Date('2025-08-08'), // Start immediately
  endDate: new Date('2025-09-08'), // Run for 1 month
  variants: [
    {
      name: 'control',
      weight: 25,
      config: {
        buttonText: 'Reserve My Spot',
        buttonSubtext: undefined,
        buttonIcon: '✨'
      }
    },
    {
      name: 'urgency',
      weight: 25,
      config: {
        buttonText: 'Join Waitlist Now',
        buttonSubtext: 'Limited Early Access',
        buttonIcon: '🚀'
      }
    },
    {
      name: 'benefit_focused',
      weight: 25,
      config: {
        buttonText: 'Get Free Design Tools',
        buttonSubtext: 'Plus 15% off Green Aqua',
        buttonIcon: '🎁'
      }
    },
    {
      name: 'personal',
      weight: 25,
      config: {
        buttonText: 'Start My Aquascape Journey',
        buttonSubtext: 'Join 1000+ aquascapers',
        buttonIcon: '🌿'
      }
    }
  ]
};

// Initialize the A/B test
export const initializeButtonTextTest = (): void => {
  try {
    abTesting.registerTest(buttonTextTestConfig);
    console.log('✅ Button text A/B test initialized');
  } catch (error) {
    console.error('❌ Failed to initialize button text A/B test:', error);
  }
};

// Helper function to get button configuration
export const getButtonConfig = (userId?: string) => {
  const testResult = abTesting.getVariant('waitlist_button_text', userId);
  
  return {
    ...testResult,
    buttonText: testResult.config.buttonText || 'Reserve My Spot',
    buttonSubtext: testResult.config.buttonSubtext,
    buttonIcon: testResult.config.buttonIcon || '✨'
  };
};

// Record conversion when user joins waitlist
export const recordButtonConversion = (userId?: string): void => {
  abTesting.recordConversion('waitlist_button_text', userId);
};

// Export for use in components
export default {
  config: buttonTextTestConfig,
  initialize: initializeButtonTextTest,
  getButtonConfig,
  recordConversion: recordButtonConversion,
};