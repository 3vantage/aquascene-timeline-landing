'use client';

import { waitlistAnalytics } from './analytics';

// A/B Test Configuration Interface
export interface ABTestConfig {
  name: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // Percentage of users to include in test (0-100)
  startDate?: Date;
  endDate?: Date;
  conversionEvent: string;
  description?: string;
  hypothesis?: string;
  successMetric?: string;
}

export interface ABTestVariant {
  name: string;
  weight: number; // Relative weight for traffic allocation
  config: Record<string, any>;
}

export interface ABTestResult {
  testName: string;
  variant: string;
  userId: string;
  isInTest: boolean;
  config: Record<string, any>;
}

export interface ABTestStats {
  testName: string;
  variant: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  confidence?: number;
  isSignificant?: boolean;
}

// A/B Testing Framework Class
export class ABTestingFramework {
  private tests: Map<string, ABTestConfig> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();
  private stats: Map<string, Map<string, ABTestStats>> = new Map();

  constructor() {
    this.loadUserAssignments();
    this.loadStats();
  }

  // Register a new A/B test
  registerTest(config: ABTestConfig): void {
    // Validate configuration
    if (!this.validateTestConfig(config)) {
      throw new Error(`Invalid test configuration: ${config.name}`);
    }

    this.tests.set(config.name, config);
    
    // Initialize stats for all variants
    const testStats = new Map<string, ABTestStats>();
    config.variants.forEach(variant => {
      testStats.set(variant.name, {
        testName: config.name,
        variant: variant.name,
        impressions: 0,
        conversions: 0,
        conversionRate: 0
      });
    });
    this.stats.set(config.name, testStats);
  }

  // Get user's variant assignment for a test
  getVariant(testName: string, userId?: string): ABTestResult {
    const test = this.tests.get(testName);
    if (!test) {
      return this.createDefaultResult(testName, userId);
    }

    // Check if test is active
    if (!this.isTestActive(test)) {
      return this.createDefaultResult(testName, userId);
    }

    const effectiveUserId = userId || this.getUserId();
    
    // Check if user is already assigned
    let userTests = this.userAssignments.get(effectiveUserId);
    if (userTests?.has(testName)) {
      const assignedVariant = userTests.get(testName)!;
      const variant = test.variants.find(v => v.name === assignedVariant);
      
      return {
        testName,
        variant: assignedVariant,
        userId: effectiveUserId,
        isInTest: true,
        config: variant?.config || {}
      };
    }

    // Check if user should be included in test
    if (!this.shouldIncludeUser(test, effectiveUserId)) {
      return this.createDefaultResult(testName, effectiveUserId);
    }

    // Assign user to variant
    const assignedVariant = this.assignUserToVariant(test, effectiveUserId);
    this.saveUserAssignment(effectiveUserId, testName, assignedVariant.name);

    // Track experiment view
    this.trackExperimentView(testName, assignedVariant.name);

    return {
      testName,
      variant: assignedVariant.name,
      userId: effectiveUserId,
      isInTest: true,
      config: assignedVariant.config
    };
  }

  // Record a conversion for a test
  recordConversion(testName: string, userId?: string, customProperties?: Record<string, any>): void {
    const effectiveUserId = userId || this.getUserId();
    const userTests = this.userAssignments.get(effectiveUserId);
    
    if (!userTests?.has(testName)) {
      return; // User not in test
    }

    const variant = userTests.get(testName)!;
    
    // Update stats
    const testStats = this.stats.get(testName);
    if (testStats) {
      const variantStats = testStats.get(variant);
      if (variantStats) {
        variantStats.conversions++;
        variantStats.conversionRate = variantStats.conversions / variantStats.impressions;
        this.saveStats();
      }
    }

    // Track conversion event
    waitlistAnalytics.trackExperimentConversion(testName, variant);
  }

  // Get test statistics
  getTestStats(testName: string): Map<string, ABTestStats> | null {
    return this.stats.get(testName) || null;
  }

  // Calculate statistical significance
  calculateSignificance(testName: string, controlVariant: string, testVariant: string): {
    pValue: number;
    isSignificant: boolean;
    confidence: number;
  } {
    const stats = this.stats.get(testName);
    if (!stats) {
      return { pValue: 1, isSignificant: false, confidence: 0 };
    }

    const control = stats.get(controlVariant);
    const test = stats.get(testVariant);
    
    if (!control || !test) {
      return { pValue: 1, isSignificant: false, confidence: 0 };
    }

    // Simple z-test for conversion rate comparison
    const p1 = control.conversionRate;
    const n1 = control.impressions;
    const p2 = test.conversionRate;
    const n2 = test.impressions;

    if (n1 === 0 || n2 === 0) {
      return { pValue: 1, isSignificant: false, confidence: 0 };
    }

    const pooledProbability = (control.conversions + test.conversions) / (n1 + n2);
    const standardError = Math.sqrt(pooledProbability * (1 - pooledProbability) * (1/n1 + 1/n2));
    
    if (standardError === 0) {
      return { pValue: 1, isSignificant: false, confidence: 0 };
    }

    const zScore = Math.abs(p1 - p2) / standardError;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    const confidence = (1 - pValue) * 100;
    const isSignificant = pValue < 0.05; // 95% confidence level

    return { pValue, isSignificant, confidence };
  }

  // Get active tests summary
  getActiveTests(): Array<{ name: string; config: ABTestConfig; stats: Map<string, ABTestStats> }> {
    const activeTests: Array<{ name: string; config: ABTestConfig; stats: Map<string, ABTestStats> }> = [];
    
    this.tests.forEach((config, name) => {
      if (this.isTestActive(config)) {
        const stats = this.stats.get(name) || new Map();
        activeTests.push({ name, config, stats });
      }
    });

    return activeTests;
  }

  // Private methods
  private validateTestConfig(config: ABTestConfig): boolean {
    if (!config.name || !config.variants || config.variants.length < 2) {
      return false;
    }

    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0);
    if (totalWeight <= 0) {
      return false;
    }

    if (config.trafficAllocation < 0 || config.trafficAllocation > 100) {
      return false;
    }

    return true;
  }

  private isTestActive(test: ABTestConfig): boolean {
    const now = new Date();
    
    if (test.startDate && now < test.startDate) {
      return false;
    }
    
    if (test.endDate && now > test.endDate) {
      return false;
    }
    
    return true;
  }

  private shouldIncludeUser(test: ABTestConfig, userId: string): boolean {
    // Use hash of userId to determine inclusion
    const hash = this.hashUserId(userId + test.name);
    const hashPercent = (hash % 100) + 1;
    return hashPercent <= test.trafficAllocation;
  }

  private assignUserToVariant(test: ABTestConfig, userId: string): ABTestVariant {
    const hash = this.hashUserId(userId + test.name + 'variant');
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    const targetWeight = (hash % totalWeight) + 1;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (targetWeight <= cumulativeWeight) {
        return variant;
      }
    }
    
    return test.variants[0]; // Fallback
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getUserId(): string {
    // Try to get user ID from various sources
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('ab_test_user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem('ab_test_user_id', userId);
      }
      return userId;
    }
    return `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private createDefaultResult(testName: string, userId?: string): ABTestResult {
    return {
      testName,
      variant: 'control',
      userId: userId || this.getUserId(),
      isInTest: false,
      config: {}
    };
  }

  private saveUserAssignment(userId: string, testName: string, variant: string): void {
    let userTests = this.userAssignments.get(userId);
    if (!userTests) {
      userTests = new Map();
      this.userAssignments.set(userId, userTests);
    }
    userTests.set(testName, variant);

    // Record impression
    const testStats = this.stats.get(testName);
    if (testStats) {
      const variantStats = testStats.get(variant);
      if (variantStats) {
        variantStats.impressions++;
        variantStats.conversionRate = variantStats.conversions / variantStats.impressions;
      }
    }

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const assignments: Record<string, Record<string, string>> = {};
      this.userAssignments.forEach((tests, user) => {
        const userAssignments: Record<string, string> = {};
        tests.forEach((variant, test) => {
          userAssignments[test] = variant;
        });
        assignments[user] = userAssignments;
      });
      localStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
    }
  }

  private loadUserAssignments(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ab_test_assignments');
        if (stored) {
          const assignments = JSON.parse(stored);
          Object.entries(assignments).forEach(([userId, tests]) => {
            const userTests = new Map();
            Object.entries(tests as Record<string, string>).forEach(([test, variant]) => {
              userTests.set(test, variant);
            });
            this.userAssignments.set(userId, userTests);
          });
        }
      } catch (error) {
        console.error('Error loading A/B test assignments:', error);
      }
    }
  }

  private saveStats(): void {
    if (typeof window !== 'undefined') {
      try {
        const statsObj: Record<string, Record<string, ABTestStats>> = {};
        this.stats.forEach((variants, testName) => {
          const variantStats: Record<string, ABTestStats> = {};
          variants.forEach((stats, variantName) => {
            variantStats[variantName] = stats;
          });
          statsObj[testName] = variantStats;
        });
        localStorage.setItem('ab_test_stats', JSON.stringify(statsObj));
      } catch (error) {
        console.error('Error saving A/B test stats:', error);
      }
    }
  }

  private loadStats(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ab_test_stats');
        if (stored) {
          const statsObj = JSON.parse(stored);
          Object.entries(statsObj).forEach(([testName, variants]) => {
            const variantStats = new Map();
            Object.entries(variants as Record<string, ABTestStats>).forEach(([variantName, stats]) => {
              variantStats.set(variantName, stats as ABTestStats);
            });
            this.stats.set(testName, variantStats);
          });
        }
      } catch (error) {
        console.error('Error loading A/B test stats:', error);
      }
    }
  }

  private trackExperimentView(testName: string, variant: string): void {
    waitlistAnalytics.trackExperimentView(testName, variant);
  }

  // Simple normal CDF approximation for statistical calculations
  private normalCDF(z: number): number {
    return (1 + this.erf(z / Math.sqrt(2))) / 2;
  }

  private erf(x: number): number {
    // Abramowitz and Stegun approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

// Global A/B Testing instance
export const abTesting = new ABTestingFramework();

// React hook for A/B testing
export function useABTest(testName: string): ABTestResult {
  if (typeof window === 'undefined') {
    return {
      testName,
      variant: 'control',
      userId: '',
      isInTest: false,
      config: {}
    };
  }

  return abTesting.getVariant(testName);
}

// Utility function to get variant config value
export function getVariantConfig<T>(result: ABTestResult, key: string, defaultValue: T): T {
  return result.config[key] ?? defaultValue;
}

// Export utilities
export const abTestingUtils = {
  abTesting,
  useABTest,
  getVariantConfig,
};