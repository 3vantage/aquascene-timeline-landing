'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { waitlistSchema, WaitlistFormData } from '@/lib/validations';
import { 
  validateEmailRealTime, 
  FormProgressTracker, 
  SpamDetector,
  FormRateLimiter,
  enhancedWaitlistSchema,
  EnhancedWaitlistFormData 
} from '@/lib/enhanced-validation';
import { waitlistAnalytics } from '@/lib/analytics';
import { useABTest, getVariantConfig } from '@/lib/ab-testing';
import { initializeButtonTextTest } from '@/lib/ab-tests/button-text-test';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import SecurityBadges from '@/components/ui/SecurityBadges';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animation-config';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  SparklesIcon,
  ShareIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface WaitlistFormProps {
  className?: string;
}

interface SubmissionResult {
  success: boolean;
  position?: number;
  error?: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '', level: 'error' as const });
  const [formProgress, setFormProgress] = useState(0);
  const [spamDetection, setSpamDetection] = useState({ isSpam: false, confidence: 0, reasons: [] as string[] });
  const [showSpamWarning, setShowSpamWarning] = useState(false);
  
  // Initialize utilities
  const progressTracker = new FormProgressTracker(['basic-info', 'preferences', 'consent'], ['name', 'email', 'experience', 'interests', 'gdprConsent']);
  const spamDetector = new SpamDetector();
  const rateLimiter = new FormRateLimiter();

  // Initialize A/B test and track form start
  useEffect(() => {
    initializeButtonTextTest();
    waitlistAnalytics.trackFormStarted('waitlist');
  }, []);

  // Get A/B test variant for button
  const buttonTestResult = useABTest('waitlist_button_text');
  const buttonText = getVariantConfig(buttonTestResult, 'buttonText', 'Reserve My Spot');
  const buttonSubtext = getVariantConfig(buttonTestResult, 'buttonSubtext', undefined);
  const buttonIcon = getVariantConfig(buttonTestResult, 'buttonIcon', '✨');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<EnhancedWaitlistFormData>({
    resolver: zodResolver(enhancedWaitlistSchema),
    mode: 'onChange',
    defaultValues: {
      interests: [],
      gdprConsent: false,
      marketingConsent: false,
      honeypot: '',
      honeypot2: '',
      timestamp: Date.now()
    }
  });
  
  // Watch form values for real-time validation
  const watchedEmail = useWatch({ control, name: 'email' });
  const watchedName = useWatch({ control, name: 'name' });
  const watchedExperience = useWatch({ control, name: 'experience' });
  const watchedInterests = useWatch({ control, name: 'interests' });
  const watchedGdprConsent = useWatch({ control, name: 'gdprConsent' });

  // Real-time email validation
  useEffect(() => {
    if (watchedEmail) {
      const validation = validateEmailRealTime(watchedEmail);
      setEmailValidation(validation);
      
      // Track email validation events
      waitlistAnalytics.trackEmailValidation(
        validation.isValid,
        validation.level,
        validation.message
      );
    }
  }, [watchedEmail]);

  // Update form progress
  useEffect(() => {
    progressTracker.setFieldComplete('name', !!(watchedName && watchedName.length >= 2));
    progressTracker.setFieldComplete('email', !!(watchedEmail && emailValidation.isValid));
    progressTracker.setFieldComplete('experience', !!watchedExperience);
    progressTracker.setFieldComplete('interests', !!(watchedInterests && watchedInterests.length > 0));
    progressTracker.setFieldComplete('gdprConsent', !!watchedGdprConsent);
    
    const progress = progressTracker.getProgress();
    setFormProgress(progress.percentage);
    
    // Track form progress analytics
    const completedFields = [
      watchedName && watchedName.length >= 2 ? 'name' : null,
      watchedEmail && emailValidation.isValid ? 'email' : null,
      watchedExperience ? 'experience' : null,
      watchedInterests && watchedInterests.length > 0 ? 'interests' : null,
      watchedGdprConsent ? 'gdprConsent' : null
    ].filter(Boolean) as string[];
    
    if (completedFields.length > 0) {
      waitlistAnalytics.trackFormProgress(progress.percentage, completedFields);
    }
  }, [watchedName, watchedEmail, watchedExperience, watchedInterests, watchedGdprConsent, emailValidation.isValid]);

  // Spam detection
  useEffect(() => {
    if (watchedName && watchedEmail) {
      const detection = spamDetector.detectSpam({
        name: watchedName,
        email: watchedEmail
      });
      setSpamDetection(detection);
      setShowSpamWarning(detection.isSpam);
      
      // Track spam detection analytics
      if (detection.confidence > 30) { // Only track significant detections
        waitlistAnalytics.trackSpamDetection(
          detection.confidence,
          detection.reasons,
          detection.isSpam
        );
      }
    }
  }, [watchedName, watchedEmail]);

  const submitWithRetry = async (data: EnhancedWaitlistFormData, attempt = 0): Promise<SubmissionResult> => {
    const maxRetries = 3;
    
    try {
      // Submit to API endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to join waitlist');
      }
      
      return {
        success: true,
        position: result.position
      };
      
    } catch (error) {
      console.error(`Submission attempt ${attempt + 1} failed:`, error);
      
      // Check if we should retry
      if (attempt < maxRetries) {
        // Handle different error types
        const isNetworkError = error instanceof TypeError || 
                              (error instanceof Error && error.name === 'AbortError');
        const isServerError = error instanceof Error && 
                              error.message.includes('50') || 
                              error.message.includes('timeout');
        
        if (isNetworkError || isServerError) {
          // Wait before retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          setRetryCount(attempt + 1);
          return submitWithRetry(data, attempt + 1);
        }
      }
      
      // Max retries reached or non-retryable error
      return {
        success: false,
        error: error instanceof Error ? 
          (error.name === 'AbortError' ? 'Request timed out. Please try again.' : error.message) :
          'Something went wrong. Please try again.'
      };
    }
  };

  const onSubmit = async (data: EnhancedWaitlistFormData) => {
    setIsSubmitting(true);
    const submissionStartTime = Date.now();
    
    // Track form submission attempt
    waitlistAnalytics.trackFormSubmitted(
      data.experience,
      data.interests,
      data.referralSource,
      submissionStartTime
    );
    
    try {
      // Rate limiting check
      const rateLimitCheck = rateLimiter.checkAttempt(data.email);
      if (!rateLimitCheck.allowed) {
        setSubmissionResult({
          success: false,
          error: `Too many attempts. Please wait ${Math.ceil(rateLimitCheck.resetIn / 60000)} minutes before trying again.`
        });
        return;
      }

      // Final spam detection
      const finalSpamCheck = spamDetector.detectSpam(data);
      if (finalSpamCheck.isSpam && finalSpamCheck.confidence > 70) {
        setSubmissionResult({
          success: false,
          error: 'Submission blocked due to suspicious activity. Please contact support if this is an error.'
        });
        return;
      }

      // Honeypot check
      if (data.honeypot || data.honeypot2) {
        setSubmissionResult({
          success: false,
          error: 'Spam detected.'
        });
        return;
      }
      
      // Use retry mechanism for submission
      setRetryCount(0); // Reset retry count
      const result = await submitWithRetry(data);
      
      if (!result.success) {
        setSubmissionResult(result);
        return;
      }
      
      const position = result.position;
      
      // Track successful conversion
      waitlistAnalytics.trackWaitlistJoin(
        position,
        data.experience,
        data.interests
      );
      
      // Track A/B test conversion
      if (buttonTestResult.isInTest) {
        const { recordConversion } = await import('@/lib/ab-tests/button-text-test');
        recordConversion();
      }
      
      setSubmissionResult({
        success: true,
        position: position
      });
      reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Track submission error
      waitlistAnalytics.trackError(
        'form_submission',
        error instanceof Error ? error.message : 'Unknown error',
        error instanceof Error ? error.stack : undefined
      );
      
      // This shouldn't happen with the retry mechanism, but just in case
      setSubmissionResult({
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setRetryCount(0); // Reset retry count
    }
  };

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'professional', label: 'Professional' },
  ];

  const interestOptions = [
    { id: '3d_design' as const, label: '3D Aquascape Designer' },
    { id: 'calculations' as const, label: 'Smart Calculations' },
    { id: 'community' as const, label: 'Community Features' },
    { id: 'mobile_app' as const, label: 'Mobile App' },
    { id: 'ai_assistant' as const, label: 'AI Assistant' },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '3vantage Aquascaping',
          text: 'Join me on the 3vantage aquascaping platform waitlist!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Success state component
  if (submissionResult?.success) {
    return (
      <motion.div
        className={`premium-hover glass-deep-water p-8 sm:p-10 md:p-12 rounded-3xl ${className}`}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-success to-accent-emerald rounded-full mb-6 sm:mb-8"
            animate={{ scale: [0, 1.2, 1], rotate: [0, 360, 360] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <CheckCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          
          <h3 className="heading-h3 text-white mb-6">
            Welcome, Fellow Aquascaper! 🌿
          </h3>
          
          <p className="text-body text-white/80 mb-8">
            You're now part of Central Europe's most advanced aquascaping community!
          </p>
          
          <div className="glass-underwater p-5 sm:p-6 rounded-2xl mb-6 sm:mb-8 border border-emerald-400/30">
            <p className="text-body text-emerald-300 font-semibold">
              You're #{submissionResult.position} in line <span className="hidden sm:inline">• Early access coming soon!</span>
            </p>
          </div>
          
          <p className="text-body text-cyan-200 mb-6 sm:mb-8 leading-relaxed">
            Check your email for your FREE aquascaping design guide <span className="hidden sm:inline">+ regional plant availability charts</span>
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            <Button
              onClick={handleShare}
              variant="secondary"
              className="glass-underwater border-cyan-400/50 text-white hover:bg-cyan-500/20 w-full sm:w-auto min-h-[48px] touch-manipulation"
              leftIcon={<ShareIcon className="w-4 h-4" />}
            >
              Invite Friends
            </Button>
            
            <div className="glass-underwater p-3 rounded-lg border border-orange-400/30">
              <p className="text-orange-300 text-xs sm:text-sm font-semibold">
                Bonus: <span className="hidden sm:inline">You'll get </span>15% off your first Green Aqua order!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (submissionResult?.success === false) {
    return (
      <motion.div
        className={`premium-hover glass-deep-water p-8 sm:p-10 md:p-12 rounded-3xl border border-error/30 ${className}`}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <ExclamationCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-error mx-auto mb-6" />
          <h3 className="heading-h3 text-white mb-4">Oops! Something went wrong</h3>
          <p className="text-body text-white/80 mb-8">{submissionResult.error}</p>
          
          <div className="space-y-4">
            <Button
              onClick={() => setSubmissionResult(null)}
              variant="primary"
              className="button-premium min-h-[56px] w-full touch-manipulation px-8 py-4"
              aria-describedby="submission-error"
            >
              Try Again
            </Button>
            
            <div className="text-center">
              <p className="text-small text-white/60 leading-relaxed">
                Still having issues?{' '}
                <a 
                  href="mailto:support@3vantage.com" 
                  className="text-cyan-400 hover:text-cyan-300 underline touch-target"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Form state
  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className={`waitlist-form premium-hover glass-deep-water p-8 sm:p-10 md:p-12 rounded-3xl space-y-6 sm:space-y-8 ${className}`}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Form Progress Indicator */}
      <motion.div 
        variants={staggerItem}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-cyan-300">Form Progress</span>
          <span className="text-sm text-cyan-200">{Math.round(formProgress)}% Complete</span>
        </div>
        <div className="w-full bg-blue-900/30 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Spam Detection Warning */}
      <AnimatePresence>
        {showSpamWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-underwater border border-orange-400/50 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 text-orange-300">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Security Check Active</span>
            </div>
            <p className="text-orange-200/80 text-sm mt-1">
              Our spam detection is monitoring this form. Please ensure all information is accurate.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honeypot Fields (hidden from users) */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <input
          {...register('honeypot')}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input
          {...register('honeypot2')}
          type="email"
          name="email_confirm"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {/* Name Field */}
      <motion.div variants={staggerItem}>
        <Input
          {...register('name')}
          id="waitlist-name"
          name="name"
          label="Your Name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          variant="glass"
          required
          autoComplete="name"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div variants={staggerItem}>
        <Input
          {...register('email')}
          id="waitlist-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          error={errors.email?.message}
          variant="glass"
          required
          autoComplete="email"
        />
        
        {/* Real-time email validation feedback */}
        <AnimatePresence>
          {watchedEmail && watchedEmail.length > 0 && !errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2"
            >
              <div className={`flex items-center gap-2 text-sm ${
                emailValidation.level === 'success' 
                  ? 'text-emerald-400' 
                  : emailValidation.level === 'warning'
                  ? 'text-orange-400'
                  : 'text-red-400'
              }`}>
                {emailValidation.level === 'success' && <CheckCircleIcon className="w-4 h-4" />}
                {emailValidation.level === 'warning' && <ExclamationCircleIcon className="w-4 h-4" />}
                {emailValidation.level === 'error' && <ExclamationCircleIcon className="w-4 h-4" />}
                <span>{emailValidation.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Experience Level */}
      <motion.div variants={staggerItem}>
        <Controller
          name="experience"
          control={control}
          render={({ field }) => (
            <Select
              name="experience"
              label="Experience Level"
              placeholder="Select your experience"
              options={experienceOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.experience?.message}
              variant="glass"
              required
            />
          )}
        />
      </motion.div>

      {/* Interests */}
      <motion.div variants={staggerItem}>
        <fieldset>
          <legend className="block text-sm font-semibold text-white mb-4">
            Interested Features
          </legend>
        <div className="space-y-3 sm:space-y-4">
          {interestOptions.map((interest) => (
            <Controller
              key={interest.id}
              name="interests"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={interest.id}
                  label={interest.label}
                  checked={field.value?.includes(interest.id) || false}
                  onChange={(checked) => {
                    const currentInterests = field.value || [];
                    if (checked) {
                      field.onChange([...currentInterests, interest.id]);
                    } else {
                      field.onChange(currentInterests.filter(i => i !== interest.id));
                    }
                  }}
                  variant="glass"
                />
              )}
            />
          ))}
        </div>
        </fieldset>
      </motion.div>

      {/* GDPR Consent */}
      <motion.div variants={staggerItem}>
        <Controller
          name="gdprConsent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="gdprConsent"
              label="I consent to receive updates about the 3vantage platform launch and understand I can unsubscribe at any time."
              checked={field.value}
              onChange={field.onChange}
              error={errors.gdprConsent?.message}
              variant="glass"
            />
          )}
        />
      </motion.div>

      {/* Marketing Consent (Optional) */}
      <motion.div variants={staggerItem}>
        <Controller
          name="marketingConsent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="marketingConsent"
              label="I'd like to receive aquascaping tips and exclusive content (optional)."
              checked={field.value || false}
              onChange={field.onChange}
              variant="glass"
            />
          )}
        />
      </motion.div>

      {/* Security Trust Signals */}
      <motion.div variants={staggerItem} className="pt-2">
        <SecurityBadges variant="compact" />
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={staggerItem} className="pt-4 sm:pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="button-premium w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white border-0 font-semibold min-h-[56px] px-8 py-4 text-lg touch-manipulation"
          leftIcon={<span className="text-xl">{buttonIcon}</span>}
        >
          <div className="flex flex-col items-center">
            <span>
              {isSubmitting 
                ? (retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Joining Waitlist...') 
                : buttonText}
            </span>
            {buttonSubtext && !isSubmitting && (
              <span className="text-xs opacity-80 mt-1">{buttonSubtext}</span>
            )}
            {isSubmitting && retryCount > 0 && (
              <span className="text-xs opacity-80 mt-1">Connection issues detected, retrying...</span>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Privacy Links */}
      <motion.div variants={staggerItem} className="text-center pt-4 sm:pt-6">
        <p className="text-small text-white/60 leading-relaxed">
          By joining, you agree to our{' '}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline touch-target">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline touch-target">
            Terms of Service
          </a>
        </p>
      </motion.div>
    </motion.form>
  );
};

export default WaitlistForm;