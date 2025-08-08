import { z } from 'zod';

// Enhanced email validation with multiple checks
export const validateEmailRealTime = (email: string): { isValid: boolean; message?: string; level: 'error' | 'warning' | 'success' } => {
  if (!email) {
    return { isValid: false, level: 'error' };
  }

  // Basic format check
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(email)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid email format', 
      level: 'error' 
    };
  }

  // Advanced email validation
  const advancedEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!advancedEmailRegex.test(email)) {
    return { 
      isValid: false, 
      message: 'Email contains invalid characters', 
      level: 'error' 
    };
  }

  // Check for common typos in domains
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  const suspiciousDomains = ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com'];
  
  if (suspiciousDomains.includes(domain)) {
    const suggestion = commonDomains.find(d => d.includes(domain.substring(0, 4)));
    return { 
      isValid: false, 
      message: suggestion ? `Did you mean ${email.split('@')[0]}@${suggestion}?` : 'Please check your email domain', 
      level: 'warning' 
    };
  }

  // Length validation
  if (email.length > 254) {
    return { 
      isValid: false, 
      message: 'Email address is too long', 
      level: 'error' 
    };
  }

  // Local part length check
  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return { 
      isValid: false, 
      message: 'Email address is too long', 
      level: 'error' 
    };
  }

  return { 
    isValid: true, 
    message: 'Email looks good!', 
    level: 'success' 
  };
};

// Form field state interface
export interface FieldState {
  value: string;
  error?: string;
  isValid: boolean;
  isTouched: boolean;
  validationLevel?: 'error' | 'warning' | 'success';
  suggestion?: string;
}

// Progress tracker for multi-step forms
export class FormProgressTracker {
  private steps: string[] = [];
  private currentStep: number = 0;
  private completedFields: Set<string> = new Set();
  private requiredFields: Set<string> = new Set();

  constructor(steps: string[], requiredFields: string[] = []) {
    this.steps = steps;
    this.requiredFields = new Set(requiredFields);
  }

  setFieldComplete(fieldName: string, isValid: boolean = true): void {
    if (isValid) {
      this.completedFields.add(fieldName);
    } else {
      this.completedFields.delete(fieldName);
    }
  }

  getProgress(): { percentage: number; step: number; totalSteps: number; isComplete: boolean } {
    const totalRequired = this.requiredFields.size;
    const completed = Array.from(this.completedFields).filter(field => this.requiredFields.has(field)).length;
    const percentage = totalRequired > 0 ? (completed / totalRequired) * 100 : 0;
    
    return {
      percentage,
      step: this.currentStep + 1,
      totalSteps: this.steps.length,
      isComplete: percentage === 100
    };
  }

  getStepName(): string {
    return this.steps[this.currentStep] || '';
  }

  nextStep(): boolean {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return true;
    }
    return false;
  }

  previousStep(): boolean {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  canProceed(): boolean {
    // Check if required fields for current step are complete
    const currentStepRequiredFields = this.getCurrentStepRequiredFields();
    return currentStepRequiredFields.every(field => this.completedFields.has(field));
  }

  private getCurrentStepRequiredFields(): string[] {
    // This would be configured based on your form structure
    // For now, return all required fields
    return Array.from(this.requiredFields);
  }
}

// Spam detection utilities
export class SpamDetector {
  private suspiciousPatterns = [
    /(.)\1{4,}/g, // Repeated characters
    /https?:\/\/[^\s]+/gi, // URLs
    /\b(buy|sell|cheap|free|money|cash|prize|winner|congratulations)\b/gi, // Spam keywords
    /[^\w\s@.-]/g, // Special characters (excluding common email/name chars)
  ];

  private suspiciousNames = [
    'test', 'admin', 'root', 'user', 'guest', 'demo',
    'asdf', 'qwerty', '123456', 'password'
  ];

  detectSpam(data: { name?: string; email?: string; [key: string]: any }): { isSpam: boolean; confidence: number; reasons: string[] } {
    const reasons: string[] = [];
    let spamScore = 0;

    // Check name for suspicious patterns
    if (data.name) {
      if (this.suspiciousNames.includes(data.name.toLowerCase())) {
        reasons.push('Suspicious name detected');
        spamScore += 30;
      }

      if (data.name.length < 2 || data.name.length > 50) {
        reasons.push('Name length suspicious');
        spamScore += 20;
      }

      if (this.suspiciousPatterns.some(pattern => pattern.test(data.name))) {
        reasons.push('Suspicious patterns in name');
        spamScore += 25;
      }
    }

    // Check email for suspicious patterns
    if (data.email) {
      const domain = data.email.split('@')[1]?.toLowerCase();
      const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
      
      if (suspiciousDomains.some(suspDomain => domain?.includes(suspDomain))) {
        reasons.push('Temporary email detected');
        spamScore += 50;
      }

      if (data.email.includes('+')) {
        reasons.push('Email alias detected');
        spamScore += 10; // Lower score as aliases are often legitimate
      }
    }

    // Check submission timing (would need to be implemented with actual timestamps)
    // Fast submissions could indicate bot activity

    return {
      isSpam: spamScore >= 50,
      confidence: Math.min(spamScore, 100),
      reasons
    };
  }
}

// Rate limiting for form submissions
export class FormRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  private minInterval: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000, minInterval: number = 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.minInterval = minInterval; // Minimum time between attempts
  }

  checkAttempt(identifier: string): { allowed: boolean; remaining: number; resetIn: number; reason?: string } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      // Reset window or first attempt
      this.attempts.set(identifier, { 
        count: 1, 
        resetTime: now + this.windowMs, 
        lastAttempt: now 
      });
      return { 
        allowed: true, 
        remaining: this.maxAttempts - 1, 
        resetIn: this.windowMs 
      };
    }

    // Check for too frequent submissions
    if (now - record.lastAttempt < this.minInterval) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: record.resetTime - now,
        reason: 'Submissions too frequent'
      };
    }

    if (record.count >= this.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: record.resetTime - now,
        reason: 'Rate limit exceeded'
      };
    }

    record.count++;
    record.lastAttempt = now;
    return {
      allowed: true,
      remaining: this.maxAttempts - record.count,
      resetIn: record.resetTime - now
    };
  }
}

// Enhanced waitlist schema with real-time validation
export const enhancedWaitlistSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\u0100-\u017F\u0400-\u04FF\s'-]+$/, 'Please enter a valid name'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .refine((email) => {
      const validation = validateEmailRealTime(email);
      return validation.isValid;
    }, 'Please enter a valid email address'),
  
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'professional'], {
    message: 'Please select your experience level'
  }),
  
  interests: z
    .array(z.enum(['3d_design', 'calculations', 'community', 'mobile_app', 'ai_assistant']))
    .min(1, 'Please select at least one feature of interest'),
  
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to receive updates'),
  
  marketingConsent: z.boolean().optional(),
  
  referralSource: z.string().optional(),
  
  // Enhanced honeypot with multiple traps
  honeypot: z.string().max(0, 'Spam detected').optional(),
  honeypot2: z.string().max(0, 'Spam detected').optional(), // Additional honeypot
  timestamp: z.number().optional(), // For timing analysis
});

export type EnhancedWaitlistFormData = z.infer<typeof enhancedWaitlistSchema>;

// Export utilities
export const validation = {
  validateEmailRealTime,
  FormProgressTracker,
  SpamDetector,
  FormRateLimiter,
  enhancedWaitlistSchema,
};