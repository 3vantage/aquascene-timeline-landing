'use client';

import { abTesting, ABTestConfig } from '../ab-testing';

// Headline A/B Test Configuration
export const headlineTestConfig: ABTestConfig = {
  name: 'hero_headline_test',
  description: 'Testing different headline variations for maximum impact and conversion',
  hypothesis: 'More specific, benefit-focused headlines will increase engagement and conversion rates',
  successMetric: 'page engagement and waitlist conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100,
  startDate: new Date('2025-08-08'),
  endDate: new Date('2025-09-08'),
  variants: [
    {
      name: 'control',
      weight: 20,
      config: {
        mainHeadline: 'Design Your Dream Aquascape in 3D',
        subHeadline: 'Join the waitlist for early access to the most advanced aquascaping tool',
        emphasis: 'Plan before you plant. Save money, avoid mistakes.',
        tone: 'professional'
      }
    },
    {
      name: 'problem_solution',
      weight: 20,
      config: {
        mainHeadline: 'Stop Making Expensive Aquascaping Mistakes',
        subHeadline: 'Design perfect aquascapes in 3D before you spend a single euro',
        emphasis: 'Used by 2,500+ aquascapers across Europe',
        tone: 'problem_focused'
      }
    },
    {
      name: 'outcome_focused',
      weight: 20,
      config: {
        mainHeadline: 'Create Professional Aquascapes Every Time',
        subHeadline: 'The 3D design tool that guarantees stunning results',
        emphasis: '98% success rate • Save €500+ on your next build',
        tone: 'result_oriented'
      }
    },
    {
      name: 'community_social',
      weight: 20,
      config: {
        mainHeadline: 'Join Europe\'s Fastest-Growing Aquascaping Community',
        subHeadline: 'Get access to pro-level design tools used by 2,500+ aquascapers',
        emphasis: 'Featured in AquaScaping Weekly • 4.9★ rating',
        tone: 'social_proof'
      }
    },
    {
      name: 'scarcity_urgent',
      weight: 20,
      config: {
        mainHeadline: 'Early Access Ending Soon',
        subHeadline: 'Be among the first 500 to access revolutionary aquascaping tools',
        emphasis: 'Only 47 spots remaining • Join before it\'s too late',
        tone: 'urgent'
      }
    }
  ]
};

// Social Proof Placement A/B Test
export const socialProofPlacementTestConfig: ABTestConfig = {
  name: 'social_proof_placement_test',
  description: 'Testing optimal placement of social proof elements for maximum impact',
  hypothesis: 'Social proof above the fold will increase trust and conversion rates',
  successMetric: 'waitlist conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100,
  startDate: new Date('2025-08-08'),
  endDate: new Date('2025-09-08'),
  variants: [
    {
      name: 'above_fold',
      weight: 33,
      config: {
        placement: 'above_fold',
        showLiveCounter: true,
        showRecentActivity: true,
        showTrustBadges: true,
        position: 'hero'
      }
    },
    {
      name: 'below_fold',
      weight: 33,
      config: {
        placement: 'below_fold',
        showLiveCounter: false,
        showRecentActivity: true,
        showTrustBadges: true,
        position: 'after_features'
      }
    },
    {
      name: 'both_locations',
      weight: 34,
      config: {
        placement: 'both',
        showLiveCounter: true,
        showRecentActivity: true,
        showTrustBadges: true,
        position: 'hero_and_form'
      }
    }
  ]
};

// CTA Button Color A/B Test
export const ctaColorTestConfig: ABTestConfig = {
  name: 'cta_button_color_test',
  description: 'Testing different CTA button colors for optimal conversion',
  hypothesis: 'Coral color will outperform teal for call-to-action buttons',
  successMetric: 'waitlist conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100,
  startDate: new Date('2025-08-08'),
  endDate: new Date('2025-09-08'),
  variants: [
    {
      name: 'teal_primary',
      weight: 50,
      config: {
        primaryColor: '#00B4A6',
        hoverColor: '#0a7f75',
        shadowColor: 'rgba(0, 180, 166, 0.4)',
        style: 'teal'
      }
    },
    {
      name: 'coral_primary',
      weight: 50,
      config: {
        primaryColor: '#FF6B47',
        hoverColor: '#ba3c1a',
        shadowColor: 'rgba(255, 107, 71, 0.4)',
        style: 'coral'
      }
    }
  ]
};

// Urgency Messaging A/B Test
export const urgencyMessagingTestConfig: ABTestConfig = {
  name: 'urgency_messaging_test',
  description: 'Testing different urgency messaging approaches',
  hypothesis: 'Specific numbers and deadlines will create more effective urgency than vague messaging',
  successMetric: 'waitlist conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100,
  startDate: new Date('2025-08-08'),
  endDate: new Date('2025-09-08'),
  variants: [
    {
      name: 'no_urgency',
      weight: 25,
      config: {
        showCountdown: false,
        showScarcity: false,
        urgencyLevel: 'none',
        messaging: 'Join the waitlist for early access'
      }
    },
    {
      name: 'time_urgency',
      weight: 25,
      config: {
        showCountdown: true,
        showScarcity: false,
        urgencyLevel: 'time',
        messaging: 'Early access ends in 7 days'
      }
    },
    {
      name: 'scarcity_urgency',
      weight: 25,
      config: {
        showCountdown: false,
        showScarcity: true,
        urgencyLevel: 'scarcity',
        messaging: 'Only 47 spots remaining'
      }
    },
    {
      name: 'combined_urgency',
      weight: 25,
      config: {
        showCountdown: true,
        showScarcity: true,
        urgencyLevel: 'high',
        messaging: 'Limited time + limited spots'
      }
    }
  ]
};

// Initialize all tests
export const initializeConversionTests = (): void => {
  try {
    abTesting.registerTest(headlineTestConfig);
    abTesting.registerTest(socialProofPlacementTestConfig);
    abTesting.registerTest(ctaColorTestConfig);
    abTesting.registerTest(urgencyMessagingTestConfig);
    console.log('✅ All conversion optimization A/B tests initialized');
  } catch (error) {
    console.error('❌ Failed to initialize conversion tests:', error);
  }
};

// Helper functions to get test configurations
export const getHeadlineConfig = (userId?: string) => {
  const testResult = abTesting.getVariant('hero_headline_test', userId);
  return {
    ...testResult,
    mainHeadline: testResult.config.mainHeadline || 'Design Your Dream Aquascape in 3D',
    subHeadline: testResult.config.subHeadline || 'Join the waitlist for early access to the most advanced aquascaping tool',
    emphasis: testResult.config.emphasis || 'Plan before you plant. Save money, avoid mistakes.',
    tone: testResult.config.tone || 'professional'
  };
};

export const getSocialProofConfig = (userId?: string) => {
  const testResult = abTesting.getVariant('social_proof_placement_test', userId);
  return {
    ...testResult,
    placement: testResult.config.placement || 'below_fold',
    showLiveCounter: testResult.config.showLiveCounter ?? true,
    showRecentActivity: testResult.config.showRecentActivity ?? true,
    showTrustBadges: testResult.config.showTrustBadges ?? true,
    position: testResult.config.position || 'after_features'
  };
};

export const getCTAColorConfig = (userId?: string) => {
  const testResult = abTesting.getVariant('cta_button_color_test', userId);
  return {
    ...testResult,
    primaryColor: testResult.config.primaryColor || '#00B4A6',
    hoverColor: testResult.config.hoverColor || '#0a7f75',
    shadowColor: testResult.config.shadowColor || 'rgba(0, 180, 166, 0.4)',
    style: testResult.config.style || 'teal'
  };
};

export const getUrgencyConfig = (userId?: string) => {
  const testResult = abTesting.getVariant('urgency_messaging_test', userId);
  return {
    ...testResult,
    showCountdown: testResult.config.showCountdown ?? false,
    showScarcity: testResult.config.showScarcity ?? false,
    urgencyLevel: testResult.config.urgencyLevel || 'none',
    messaging: testResult.config.messaging || 'Join the waitlist for early access'
  };
};

// Record conversions for all tests
export const recordConversionForAllTests = (userId?: string): void => {
  abTesting.recordConversion('hero_headline_test', userId);
  abTesting.recordConversion('social_proof_placement_test', userId);
  abTesting.recordConversion('cta_button_color_test', userId);
  abTesting.recordConversion('urgency_messaging_test', userId);
};

export default {
  headline: { config: headlineTestConfig, getConfig: getHeadlineConfig },
  socialProof: { config: socialProofPlacementTestConfig, getConfig: getSocialProofConfig },
  ctaColor: { config: ctaColorTestConfig, getConfig: getCTAColorConfig },
  urgency: { config: urgencyMessagingTestConfig, getConfig: getUrgencyConfig },
  initialize: initializeConversionTests,
  recordConversion: recordConversionForAllTests
};