'use client';

import { waitlistAnalytics, analyticsDebug, initializeAnalytics } from './analytics';
import { abTesting } from './ab-testing';
import { initializeButtonTextTest } from './ab-tests/button-text-test';

// Test suite for analytics and A/B testing
export class AnalyticsTestSuite {
  private testResults: { test: string; status: 'passed' | 'failed' | 'skipped'; message?: string }[] = [];

  constructor() {
    // Enable debug mode for testing
    analyticsDebug.enableDebug();
  }

  // Test individual analytics events
  async testAnalyticsEvents(): Promise<void> {
    console.log('🧪 Testing Analytics Events...\n');

    try {
      // Test 1: Page view tracking
      console.log('Test 1: Page view tracking');
      waitlistAnalytics.trackPageView('/test-page', 'Test Page');
      this.testResults.push({ test: 'Page view tracking', status: 'passed' });
      
      // Test 2: Form started event
      console.log('Test 2: Form started event');
      waitlistAnalytics.trackFormStarted('waitlist');
      this.testResults.push({ test: 'Form started tracking', status: 'passed' });
      
      // Test 3: Email validation tracking
      console.log('Test 3: Email validation tracking');
      waitlistAnalytics.trackEmailValidation(true, 'success', 'Email looks good!');
      waitlistAnalytics.trackEmailValidation(false, 'error', 'Invalid email format');
      this.testResults.push({ test: 'Email validation tracking', status: 'passed' });
      
      // Test 4: Form progress tracking
      console.log('Test 4: Form progress tracking');
      waitlistAnalytics.trackFormProgress(60, ['name', 'email', 'experience']);
      this.testResults.push({ test: 'Form progress tracking', status: 'passed' });
      
      // Test 5: Spam detection tracking
      console.log('Test 5: Spam detection tracking');
      waitlistAnalytics.trackSpamDetection(45, ['suspicious_pattern'], false);
      this.testResults.push({ test: 'Spam detection tracking', status: 'passed' });
      
      // Test 6: Form submission tracking
      console.log('Test 6: Form submission tracking');
      waitlistAnalytics.trackFormSubmitted('intermediate', ['3d_design', 'ai_assistant'], 'google', 2500);
      this.testResults.push({ test: 'Form submission tracking', status: 'passed' });
      
      // Test 7: Waitlist join conversion
      console.log('Test 7: Waitlist join conversion');
      waitlistAnalytics.trackWaitlistJoin(42, 'intermediate', ['3d_design', 'ai_assistant']);
      this.testResults.push({ test: 'Waitlist conversion tracking', status: 'passed' });
      
      // Test 8: Button click tracking
      console.log('Test 8: Button click tracking');
      waitlistAnalytics.trackButtonClick('join_waitlist', 'hero_section');
      this.testResults.push({ test: 'Button click tracking', status: 'passed' });
      
      // Test 9: Share action tracking
      console.log('Test 9: Share action tracking');
      waitlistAnalytics.trackShareAction('native', true);
      this.testResults.push({ test: 'Share action tracking', status: 'passed' });
      
      // Test 10: Error tracking
      console.log('Test 10: Error tracking');
      waitlistAnalytics.trackError('test_error', 'This is a test error', 'Error stack trace');
      this.testResults.push({ test: 'Error tracking', status: 'passed' });
      
    } catch (error) {
      console.error('Analytics testing failed:', error);
      this.testResults.push({ 
        test: 'Analytics events', 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // Test A/B testing functionality
  async testABTesting(): Promise<void> {
    console.log('\n🧪 Testing A/B Testing Framework...\n');

    try {
      // Initialize the button text test
      initializeButtonTextTest();
      
      // Test 1: User assignment
      console.log('Test 1: User assignment');
      const testResult = abTesting.getVariant('waitlist_button_text');
      console.log('Assigned variant:', testResult);
      this.testResults.push({ test: 'A/B test user assignment', status: 'passed' });
      
      // Test 2: Variant consistency
      console.log('Test 2: Variant consistency');
      const testResult2 = abTesting.getVariant('waitlist_button_text');
      if (testResult.variant === testResult2.variant) {
        this.testResults.push({ test: 'A/B test consistency', status: 'passed' });
      } else {
        this.testResults.push({ 
          test: 'A/B test consistency', 
          status: 'failed', 
          message: 'User assigned different variants' 
        });
      }
      
      // Test 3: Conversion tracking
      console.log('Test 3: Conversion tracking');
      abTesting.recordConversion('waitlist_button_text');
      this.testResults.push({ test: 'A/B test conversion tracking', status: 'passed' });
      
      // Test 4: Statistics
      console.log('Test 4: Statistics');
      const stats = abTesting.getTestStats('waitlist_button_text');
      console.log('Test stats:', stats);
      this.testResults.push({ test: 'A/B test statistics', status: 'passed' });
      
      // Test 5: Analytics integration
      console.log('Test 5: Analytics integration');
      waitlistAnalytics.trackExperimentView('waitlist_button_text', testResult.variant);
      waitlistAnalytics.trackExperimentConversion('waitlist_button_text', testResult.variant);
      this.testResults.push({ test: 'A/B test analytics integration', status: 'passed' });
      
    } catch (error) {
      console.error('A/B testing failed:', error);
      this.testResults.push({ 
        test: 'A/B testing', 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // Test validation features
  async testValidationFeatures(): Promise<void> {
    console.log('\n🧪 Testing Form Validation...\n');

    try {
      const { validateEmailRealTime, SpamDetector, FormProgressTracker } = await import('./enhanced-validation');
      
      // Test 1: Email validation
      console.log('Test 1: Email validation');
      const emailTests = [
        'valid@example.com',
        'invalid-email',
        'test@gmial.com', // Typo test
        'toolong'.repeat(50) + '@example.com'
      ];
      
      emailTests.forEach(email => {
        const result = validateEmailRealTime(email);
        console.log(`Email: ${email} -> Valid: ${result.isValid}, Level: ${result.level}`);
      });
      this.testResults.push({ test: 'Email validation', status: 'passed' });
      
      // Test 2: Spam detection
      console.log('Test 2: Spam detection');
      const spamDetector = new SpamDetector();
      const spamResult = spamDetector.detectSpam({
        name: 'test user',
        email: 'test@example.com'
      });
      console.log('Spam detection result:', spamResult);
      this.testResults.push({ test: 'Spam detection', status: 'passed' });
      
      // Test 3: Form progress tracking
      console.log('Test 3: Form progress tracking');
      const progressTracker = new FormProgressTracker(
        ['step1', 'step2'], 
        ['name', 'email']
      );
      progressTracker.setFieldComplete('name', true);
      progressTracker.setFieldComplete('email', true);
      const progress = progressTracker.getProgress();
      console.log('Progress result:', progress);
      this.testResults.push({ test: 'Form progress tracking', status: 'passed' });
      
    } catch (error) {
      console.error('Validation testing failed:', error);
      this.testResults.push({ 
        test: 'Validation features', 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // Generate test report
  generateReport(): void {
    console.log('\n📊 Test Results Summary\n');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const skipped = this.testResults.filter(r => r.status === 'skipped').length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
    
    // Detailed results
    this.testResults.forEach(result => {
      const icon = result.status === 'passed' ? '✅' : 
                   result.status === 'failed' ? '❌' : '⏭️';
      console.log(`${icon} ${result.test}`);
      if (result.message) {
        console.log(`   ${result.message}`);
      }
    });
    
    console.log('\n='.repeat(50));
    console.log(`🏁 Testing Complete - ${passed}/${total} tests passed`);
    
    // Store results for later access
    if (typeof window !== 'undefined') {
      (window as any).analyticsTestResults = {
        summary: { total, passed, failed, skipped },
        details: this.testResults,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Analytics & A/B Testing Test Suite...\n');
    
    await this.testAnalyticsEvents();
    await this.testABTesting();
    await this.testValidationFeatures();
    
    this.generateReport();
  }
}

// Export convenience functions
export const runAnalyticsTests = async (): Promise<void> => {
  const testSuite = new AnalyticsTestSuite();
  await testSuite.runAllTests();
};

export const quickTest = (): void => {
  console.log('🔍 Quick Analytics Test...');
  
  // Test analytics availability
  if (typeof window === 'undefined') {
    console.log('❌ Running in server environment - analytics not available');
    return;
  }
  
  // Initialize analytics
  initializeAnalytics();
  
  // Test basic events
  waitlistAnalytics.trackPageView();
  waitlistAnalytics.trackFormStarted('test');
  waitlistAnalytics.trackButtonClick('test_button', 'test_location');
  
  console.log('✅ Basic analytics test completed - check browser console for events');
  
  // Test A/B testing
  initializeButtonTextTest();
  const variant = abTesting.getVariant('waitlist_button_text');
  console.log('✅ A/B test variant assigned:', variant.variant);
};

// Browser console helpers (for manual testing)
if (typeof window !== 'undefined') {
  (window as any).testAnalytics = runAnalyticsTests;
  (window as any).quickTestAnalytics = quickTest;
  (window as any).enableAnalyticsDebug = analyticsDebug.enableDebug;
  (window as any).disableAnalyticsDebug = analyticsDebug.disableDebug;
}

export default AnalyticsTestSuite;