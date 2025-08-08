'use client';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Types for Google Analytics events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Enhanced event types for waitlist application
export interface WaitlistAnalyticsEvent {
  event_name: string;
  page_location?: string;
  page_title?: string;
  user_properties?: {
    experience_level?: string;
    interests?: string[];
    referral_source?: string;
    form_progress?: number;
  };
  custom_parameters?: {
    form_step?: string;
    field_name?: string;
    validation_error?: string;
    spam_confidence?: number;
    submission_time?: number;
  };
}

// Google gtag function declaration
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'consent',
      targetId: string | object,
      config?: object
    ) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initializeAnalytics = (): void => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(command: any, targetId: any, config?: any) {
    window.dataLayer.push(arguments);
  };

  // Configure gtag
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    // Privacy-friendly settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Enhanced ecommerce settings for conversion tracking
    send_page_view: false, // We'll send manually for better control
    // Custom settings for waitlist tracking
    custom_map: {
      'dimension1': 'experience_level',
      'dimension2': 'interests',
      'dimension3': 'referral_source',
      'dimension4': 'form_progress'
    }
  });
};

// Privacy-compliant consent management
export const updateConsentSettings = (hasConsent: boolean): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    'analytics_storage': hasConsent ? 'granted' : 'denied',
    'ad_storage': 'denied', // Always deny ad storage for privacy
    'functionality_storage': hasConsent ? 'granted' : 'denied',
    'personalization_storage': 'denied',
    'security_storage': 'granted'
  });
};

// Core event tracking function
export const trackEvent = (event: WaitlistAnalyticsEvent): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  try {
    window.gtag('event', event.event_name, {
      ...event.custom_parameters,
      page_location: event.page_location || window.location.href,
      page_title: event.page_title || document.title,
      // User properties
      experience_level: event.user_properties?.experience_level,
      interests: event.user_properties?.interests?.join(','),
      referral_source: event.user_properties?.referral_source,
      form_progress: event.user_properties?.form_progress,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Specific tracking functions for waitlist events
export const waitlistAnalytics = {
  // Page view tracking
  trackPageView: (page_path?: string, page_title?: string): void => {
    trackEvent({
      event_name: 'page_view',
      page_location: page_path || window.location.href,
      page_title: page_title || document.title,
    });
  },

  // Form interaction tracking
  trackFormStarted: (formType: string = 'waitlist'): void => {
    trackEvent({
      event_name: 'form_started',
      custom_parameters: {
        form_type: formType,
        timestamp: Date.now(),
      },
    });
  },

  trackFieldInteraction: (fieldName: string, action: 'focus' | 'blur' | 'change'): void => {
    trackEvent({
      event_name: 'form_field_interaction',
      custom_parameters: {
        field_name: fieldName,
        action: action,
        timestamp: Date.now(),
      },
    });
  },

  trackEmailValidation: (isValid: boolean, validationLevel: string, suggestion?: string): void => {
    trackEvent({
      event_name: 'email_validation',
      custom_parameters: {
        is_valid: isValid,
        validation_level: validationLevel,
        has_suggestion: !!suggestion,
        timestamp: Date.now(),
      },
    });
  },

  trackFormProgress: (progress: number, completedFields: string[]): void => {
    trackEvent({
      event_name: 'form_progress',
      custom_parameters: {
        progress_percentage: progress,
        completed_fields: completedFields.join(','),
        total_fields: 5, // Adjust based on your form
        timestamp: Date.now(),
      },
    });
  },

  trackValidationError: (fieldName: string, errorMessage: string): void => {
    trackEvent({
      event_name: 'validation_error',
      custom_parameters: {
        field_name: fieldName,
        error_message: errorMessage,
        timestamp: Date.now(),
      },
    });
  },

  trackSpamDetection: (confidence: number, reasons: string[], blocked: boolean): void => {
    trackEvent({
      event_name: 'spam_detection',
      custom_parameters: {
        confidence_score: confidence,
        detection_reasons: reasons.join(','),
        submission_blocked: blocked,
        timestamp: Date.now(),
      },
    });
  },

  // Conversion tracking
  trackFormSubmitted: (
    experienceLevel?: string,
    interests?: string[],
    referralSource?: string,
    submissionTime?: number
  ): void => {
    trackEvent({
      event_name: 'form_submit',
      user_properties: {
        experience_level: experienceLevel,
        interests: interests,
        referral_source: referralSource,
      },
      custom_parameters: {
        submission_duration_ms: submissionTime,
        timestamp: Date.now(),
      },
    });
  },

  trackWaitlistJoin: (
    position: number,
    experienceLevel?: string,
    interests?: string[]
  ): void => {
    trackEvent({
      event_name: 'waitlist_join',
      user_properties: {
        experience_level: experienceLevel,
        interests: interests,
      },
      custom_parameters: {
        waitlist_position: position,
        timestamp: Date.now(),
        // This is a conversion event
        value: 1,
        currency: 'USD',
      },
    });

    // Also track as a conversion
    window.gtag?.('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      value: 1,
      currency: 'USD',
      transaction_id: `waitlist_${Date.now()}`,
    });
  },

  // User interaction tracking
  trackShareAction: (method: 'native' | 'clipboard' | 'social', success: boolean): void => {
    trackEvent({
      event_name: 'share',
      custom_parameters: {
        method: method,
        success: success,
        content_type: 'waitlist_invitation',
        timestamp: Date.now(),
      },
    });
  },

  trackButtonClick: (buttonName: string, location: string): void => {
    trackEvent({
      event_name: 'button_click',
      custom_parameters: {
        button_name: buttonName,
        button_location: location,
        timestamp: Date.now(),
      },
    });
  },

  trackExternalLinkClick: (url: string, linkText: string): void => {
    trackEvent({
      event_name: 'external_link_click',
      custom_parameters: {
        link_url: url,
        link_text: linkText,
        timestamp: Date.now(),
      },
    });
  },

  // Error and performance tracking
  trackError: (errorType: string, errorMessage: string, stackTrace?: string): void => {
    trackEvent({
      event_name: 'error',
      custom_parameters: {
        error_type: errorType,
        error_message: errorMessage,
        stack_trace: stackTrace?.substring(0, 500), // Limit stack trace length
        timestamp: Date.now(),
      },
    });
  },

  trackPerformanceMetric: (metricName: string, value: number, unit: string): void => {
    trackEvent({
      event_name: 'performance_metric',
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
        metric_unit: unit,
        timestamp: Date.now(),
      },
    });
  },

  // A/B testing tracking
  trackExperimentView: (experimentName: string, variant: string): void => {
    trackEvent({
      event_name: 'experiment_view',
      custom_parameters: {
        experiment_name: experimentName,
        variant_name: variant,
        timestamp: Date.now(),
      },
    });
  },

  trackExperimentConversion: (experimentName: string, variant: string): void => {
    trackEvent({
      event_name: 'experiment_conversion',
      custom_parameters: {
        experiment_name: experimentName,
        variant_name: variant,
        timestamp: Date.now(),
      },
    });
  },
};

// Enhanced ecommerce tracking for waitlist conversions
export const ecommerceTracking = {
  trackWaitlistConversion: (
    position: number,
    experienceLevel: string,
    interests: string[],
    value: number = 1
  ): void => {
    if (typeof window === 'undefined' || !window.gtag) return;

    // Enhanced ecommerce purchase event
    window.gtag('event', 'purchase', {
      transaction_id: `waitlist_${Date.now()}_${position}`,
      value: value,
      currency: 'USD',
      items: [{
        item_id: 'waitlist_signup',
        item_name: 'Waitlist Registration',
        item_category: 'Conversion',
        item_variant: experienceLevel,
        quantity: 1,
        price: value,
        custom_parameters: {
          waitlist_position: position,
          interests: interests.join(','),
        }
      }]
    });
  }
};

// User properties management
export const userProperties = {
  setUserProperty: (propertyName: string, value: string | number): void => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('set', 'user_properties', {
      [propertyName]: value
    });
  },

  setUserProperties: (properties: Record<string, string | number>): void => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('set', 'user_properties', properties);
  },

  identifyUser: (
    experienceLevel?: string,
    interests?: string[],
    referralSource?: string
  ): void => {
    const properties: Record<string, string | number> = {};

    if (experienceLevel) properties.experience_level = experienceLevel;
    if (interests?.length) properties.interests = interests.join(',');
    if (referralSource) properties.referral_source = referralSource;

    userProperties.setUserProperties(properties);
  }
};

// Debug mode for development
export const analyticsDebug = {
  isDebugMode: (): boolean => {
    return process.env.NODE_ENV === 'development' || 
           localStorage.getItem('ga_debug') === 'true';
  },

  enableDebug: (): void => {
    localStorage.setItem('ga_debug', 'true');
    console.log('Google Analytics debug mode enabled');
  },

  disableDebug: (): void => {
    localStorage.removeItem('ga_debug');
    console.log('Google Analytics debug mode disabled');
  },

  logEvent: (event: WaitlistAnalyticsEvent): void => {
    if (analyticsDebug.isDebugMode()) {
      console.group('🔍 Analytics Event');
      console.log('Event Name:', event.event_name);
      console.log('User Properties:', event.user_properties);
      console.log('Custom Parameters:', event.custom_parameters);
      console.groupEnd();
    }
  }
};

// Utility functions
export const analyticsUtils = {
  // Get unique session ID for tracking
  getSessionId: (): string => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  },

  // Check if analytics is available
  isAnalyticsAvailable: (): boolean => {
    return typeof window !== 'undefined' && !!window.gtag;
  },

  // Get current page data
  getCurrentPageData: () => {
    if (typeof window === 'undefined') {
      return { page_location: '', page_title: '', page_path: '' };
    }

    return {
      page_location: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
    };
  }
};

// Export default analytics configuration
export default {
  initializeAnalytics,
  updateConsentSettings,
  trackEvent,
  waitlistAnalytics,
  ecommerceTracking,
  userProperties,
  analyticsDebug,
  analyticsUtils,
  GA_MEASUREMENT_ID,
};