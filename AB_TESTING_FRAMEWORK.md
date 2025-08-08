# A/B Testing Framework Documentation

## Overview
This document outlines the comprehensive A/B testing framework implemented for the aquascaping waitlist application, including test configuration, variant management, statistical analysis, and integration with Google Analytics.

## Framework Architecture

### Core Components
- **ABTestingFramework Class**: Main testing engine
- **Test Configuration**: JSON-based test definitions
- **Variant Assignment**: Deterministic user bucketing
- **Statistical Analysis**: Conversion rate testing and significance calculation
- **Analytics Integration**: Automatic event tracking
- **React Hook**: Easy component integration

## Setting Up A/B Tests

### 1. Test Configuration
**File:** `src/lib/ab-testing.ts`

```typescript
export interface ABTestConfig {
  name: string;                    // Unique test identifier
  variants: ABTestVariant[];       // Test variants
  trafficAllocation: number;       // Percentage of users (0-100)
  startDate?: Date;               // Test start date
  endDate?: Date;                 // Test end date
  conversionEvent: string;        // Target conversion event
  description?: string;           // Test description
  hypothesis?: string;            // Expected outcome
  successMetric?: string;         // Primary success metric
}

export interface ABTestVariant {
  name: string;                   // Variant identifier
  weight: number;                 // Traffic allocation weight
  config: Record<string, any>;   // Variant configuration
}
```

### 2. Example Test Setup
**File:** `src/lib/ab-tests/button-text-test.ts`

```typescript
const buttonTextTestConfig: ABTestConfig = {
  name: 'waitlist_button_text',
  description: 'Testing CTA button text variations',
  hypothesis: 'Benefit-focused text will increase conversions',
  successMetric: 'waitlist_join conversion rate',
  conversionEvent: 'waitlist_join',
  trafficAllocation: 100,
  startDate: new Date('2025-08-08'),
  endDate: new Date('2025-09-08'),
  variants: [
    {
      name: 'control',
      weight: 25,
      config: {
        buttonText: 'Reserve My Spot',
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
```

## Implementation in Components

### 1. React Hook Usage
```tsx
import { useABTest, getVariantConfig } from '@/lib/ab-testing';
import { recordButtonConversion } from '@/lib/ab-tests/button-text-test';

const WaitlistButton = () => {
  const testResult = useABTest('waitlist_button_text');
  
  // Get variant-specific configuration
  const buttonText = getVariantConfig(testResult, 'buttonText', 'Reserve My Spot');
  const buttonSubtext = getVariantConfig(testResult, 'buttonSubtext', undefined);
  const buttonIcon = getVariantConfig(testResult, 'buttonIcon', '✨');

  const handleClick = () => {
    // Record conversion when user completes target action
    recordButtonConversion();
    // ... rest of button logic
  };

  return (
    <button onClick={handleClick} className="cta-button">
      <span className="icon">{buttonIcon}</span>
      <div>
        <div className="main-text">{buttonText}</div>
        {buttonSubtext && (
          <div className="subtext">{buttonSubtext}</div>
        )}
      </div>
    </button>
  );
};
```

### 2. Manual Variant Assignment
```typescript
import { abTesting } from '@/lib/ab-testing';

const getButtonVariant = (userId: string) => {
  const result = abTesting.getVariant('waitlist_button_text', userId);
  
  if (!result.isInTest) {
    // User not in test, use default
    return { buttonText: 'Reserve My Spot', icon: '✨' };
  }

  return {
    buttonText: result.config.buttonText,
    buttonSubtext: result.config.buttonSubtext,
    icon: result.config.buttonIcon
  };
};
```

## Test Management

### 1. Registering Tests
```typescript
import { abTesting } from '@/lib/ab-testing';
import { buttonTextTestConfig } from '@/lib/ab-tests/button-text-test';

// Register test in your app initialization
abTesting.registerTest(buttonTextTestConfig);
```

### 2. Recording Conversions
```typescript
import { abTesting } from '@/lib/ab-testing';

// Record conversion for specific test
abTesting.recordConversion('waitlist_button_text', userId);

// Record with additional properties
abTesting.recordConversion('waitlist_button_text', userId, {
  conversionValue: 1,
  experienceLevel: 'intermediate'
});
```

### 3. Viewing Test Results
```typescript
// Get test statistics
const stats = abTesting.getTestStats('waitlist_button_text');

if (stats) {
  stats.forEach((variantStats, variantName) => {
    console.log(`Variant: ${variantName}`);
    console.log(`Impressions: ${variantStats.impressions}`);
    console.log(`Conversions: ${variantStats.conversions}`);
    console.log(`Conversion Rate: ${(variantStats.conversionRate * 100).toFixed(2)}%`);
  });
}

// Calculate statistical significance
const significance = abTesting.calculateSignificance(
  'waitlist_button_text',
  'control',
  'benefit_focused'
);

console.log(`P-value: ${significance.pValue.toFixed(4)}`);
console.log(`Confidence: ${significance.confidence.toFixed(1)}%`);
console.log(`Significant: ${significance.isSignificant}`);
```

## Statistical Analysis

### 1. Conversion Rate Calculation
The framework automatically calculates conversion rates:
- **Impressions**: Number of users who saw the variant
- **Conversions**: Number of users who completed the target action
- **Conversion Rate**: Conversions ÷ Impressions × 100

### 2. Statistical Significance Testing
Uses z-test for comparing conversion rates between variants:

```typescript
// Example significance test
const result = abTesting.calculateSignificance(
  'waitlist_button_text',
  'control',      // baseline variant
  'urgency'       // test variant
);

if (result.isSignificant && result.confidence > 95) {
  console.log(`Test is statistically significant with ${result.confidence.toFixed(1)}% confidence`);
}
```

**Statistical Requirements:**
- **Minimum Sample Size**: 100 impressions per variant
- **Confidence Level**: 95% (p < 0.05)
- **Test Duration**: Minimum 1-2 weeks for seasonal effects

### 3. Effect Size Calculation
```typescript
const controlStats = testStats.get('control');
const testStats = testStats.get('test_variant');

if (controlStats && testStats) {
  const liftPercent = ((testStats.conversionRate - controlStats.conversionRate) 
                      / controlStats.conversionRate) * 100;
  console.log(`Conversion rate lift: ${liftPercent.toFixed(1)}%`);
}
```

## Analytics Integration

### 1. Automatic Event Tracking
The framework automatically tracks:
- **Experiment View**: When user is assigned to variant
- **Experiment Conversion**: When user completes target action

```typescript
// Events tracked automatically:
waitlistAnalytics.trackExperimentView('waitlist_button_text', 'benefit_focused');
waitlistAnalytics.trackExperimentConversion('waitlist_button_text', 'benefit_focused');
```

### 2. Google Analytics Integration
Events appear in GA4 as:
- **Event Name**: `experiment_view` / `experiment_conversion`
- **Parameters**: 
  - `experiment_name`: Test identifier
  - `variant_name`: Variant identifier
  - `timestamp`: Event timestamp

### 3. Custom Conversion Tracking
```typescript
// Track conversions with additional context
abTesting.recordConversion('waitlist_button_text', userId, {
  conversionValue: 25,        // Revenue value
  conversionTime: 45000,      // Time to convert (ms)
  userSegment: 'power_user'   // User classification
});
```

## User Assignment Logic

### 1. Deterministic Assignment
- Uses hash of `userId + testName` for consistent assignment
- Same user always gets same variant across sessions
- No external dependencies or server calls required

### 2. Traffic Allocation
```typescript
// Traffic allocation example
const testConfig = {
  trafficAllocation: 50,  // Only 50% of users enter test
  variants: [
    { name: 'control', weight: 50 },     // 25% of all users
    { name: 'variant_a', weight: 50 }    // 25% of all users
  ]
};
// 50% of users see neither variant (excluded from test)
```

### 3. User ID Generation
```typescript
// Persistent user ID across sessions
const getUserId = () => {
  let userId = localStorage.getItem('ab_test_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('ab_test_user_id', userId);
  }
  return userId;
};
```

## Best Practices

### 1. Test Design
- **Single Variable**: Test one element at a time
- **Clear Hypothesis**: Define expected outcome
- **Measurable Goals**: Use quantifiable success metrics
- **Sufficient Duration**: Run tests for at least 1-2 weeks
- **Sample Size**: Ensure statistical power (typically 1000+ users per variant)

### 2. Implementation
- **Consistent Assignment**: Same user always sees same variant
- **Default Fallback**: Handle test failures gracefully
- **Performance**: Minimize impact on page load
- **Mobile Optimization**: Test on all device types

### 3. Analysis
- **Wait for Significance**: Don't stop tests early
- **Consider External Factors**: Seasonality, marketing campaigns
- **Segment Analysis**: Look at results by user type
- **Document Learnings**: Record insights for future tests

## Test Examples

### 1. Button Text Test (Current)
**Hypothesis**: More specific, benefit-focused button text will increase conversions

**Variants:**
- Control: "Reserve My Spot"
- Urgency: "Join Waitlist Now"
- Benefit: "Get Free Design Tools"
- Personal: "Start My Aquascape Journey"

**Success Metric**: Waitlist signup conversion rate

### 2. Form Layout Test (Future)
**Hypothesis**: Single-column layout will improve completion rates

**Variants:**
- Control: Two-column form layout
- Test: Single-column form layout

**Success Metric**: Form completion rate

### 3. Pricing Display Test (Future)
**Hypothesis**: Showing savings will increase interest

**Variants:**
- Control: "15% off Green Aqua"
- Test: "Save $25 on Green Aqua"

**Success Metric**: Click-through rate to partner site

## Monitoring and Debugging

### 1. Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('ab_debug', 'true');

// View current assignments
console.log(localStorage.getItem('ab_test_assignments'));

// Check test stats
console.log(localStorage.getItem('ab_test_stats'));
```

### 2. Test Validation
```typescript
// Validate test is working correctly
const testResult = abTesting.getVariant('waitlist_button_text');
console.log('Test Result:', testResult);

// Check if user is in test
if (testResult.isInTest) {
  console.log(`User in variant: ${testResult.variant}`);
  console.log('Variant config:', testResult.config);
} else {
  console.log('User not in test');
}
```

### 3. Common Issues

#### Test Not Running
- Check test dates (startDate/endDate)
- Verify test is registered
- Confirm traffic allocation > 0

#### Users Not Assigned
- Check `trafficAllocation` percentage
- Verify user ID generation
- Confirm variant weights sum correctly

#### Conversions Not Tracking
- Ensure `recordConversion` is called
- Check user is actually in test
- Verify conversion event name matches

## Data Privacy and Compliance

### 1. Data Storage
- **Local Storage**: User assignments and stats stored locally
- **No Server Data**: No personal data sent to external services
- **Anonymous IDs**: Generated user IDs don't contain personal information

### 2. GDPR Compliance
- **Consent**: Respects analytics consent preferences
- **Data Minimization**: Only stores necessary test data
- **Right to Deletion**: Data automatically expires with browser storage clearing

### 3. Analytics Consent
```typescript
// Respect user consent for analytics
if (hasAnalyticsConsent) {
  waitlistAnalytics.trackExperimentView(testName, variant);
} else {
  // Still run test but don't track analytics
  console.log('Analytics consent not given, skipping tracking');
}
```

## Performance Considerations

### 1. Client-Side Only
- **No Server Calls**: All logic runs in browser
- **Fast Assignment**: Deterministic algorithm with minimal computation
- **Cached Results**: User assignments persisted locally

### 2. Bundle Size Impact
- **Core Framework**: ~5KB compressed
- **Test Configs**: ~1KB per test
- **Analytics Integration**: Uses existing GA4 implementation

### 3. Runtime Performance
```typescript
// Performance measurement
console.time('AB Test Assignment');
const variant = abTesting.getVariant('test_name');
console.timeEnd('AB Test Assignment'); // Typically <1ms
```

## Future Enhancements

### 1. Advanced Features
- **Multi-variate Testing**: Test multiple elements simultaneously
- **Audience Targeting**: Segment-based test allocation
- **Dynamic Allocation**: Adjust traffic based on performance
- **Bayesian Analysis**: More sophisticated statistical methods

### 2. Integration Improvements
- **Server-Side Testing**: Reduce client-side computation
- **External Analytics**: Integration with other analytics platforms
- **Real-time Dashboard**: Live test monitoring
- **Automated Stopping**: Statistical significance-based test ending

### 3. Machine Learning
- **Predictive Assignment**: ML-based variant selection
- **Outcome Prediction**: Forecast test results
- **Automated Optimization**: Dynamic variant generation

---

*Last updated: 2025-08-08*
*A/B Testing Framework ready for production deployment*