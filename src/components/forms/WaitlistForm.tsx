'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { waitlistSchema, WaitlistFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animation-config';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  SparklesIcon,
  ShareIcon
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    mode: 'onChange',
    defaultValues: {
      interests: [],
      gdprConsent: false,
      marketingConsent: false,
    }
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    
    try {
      // For static deployment, use a client-side solution
      // In a real deployment, you would use services like Formspree, Netlify Forms, etc.
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock position for demo purposes
      const position = Math.floor(Math.random() * 1000) + 1;
      
      // Store submission data in localStorage (for demo purposes)
      const submissions = JSON.parse(localStorage.getItem('waitlist-submissions') || '[]');
      submissions.push({
        ...data,
        position,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('waitlist-submissions', JSON.stringify(submissions));
      
      setSubmissionResult({
        success: true,
        position: position
      });
      reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionResult({
        success: false,
        error: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
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
          
          <h3 className="heading-h3 text-high-contrast mb-6">
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
          <h3 className="heading-h3 text-white mb-4">Something went wrong</h3>
          <p className="text-body text-white/80 mb-8">{submissionResult.error}</p>
          <Button
            onClick={() => setSubmissionResult(null)}
            variant="primary"
            className="button-premium min-h-[56px] w-full sm:w-auto touch-manipulation px-8 py-4"
            aria-describedby="submission-error"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  // Form state
  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className={`waitlist-form premium-hover glass-deep-water p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl space-y-8 sm:space-y-10 ${className}`}
      style={{ minHeight: 'auto' }}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Name Field */}
      <motion.div variants={staggerItem} className="w-full">
        <div className="mb-2">
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
            className="mobile-input w-full"
            style={{ marginBottom: '0.5rem' }}
          />
        </div>
      </motion.div>

      {/* Email Field */}
      <motion.div variants={staggerItem} className="w-full">
        <div className="mb-2">
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
            className="mobile-input w-full"
            style={{ marginBottom: '0.5rem' }}
          />
        </div>
      </motion.div>

      {/* Experience Level */}
      <motion.div variants={staggerItem} className="w-full">
        <div className="mb-2">
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
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div variants={staggerItem} className="w-full">
        <fieldset className="mb-4">
          <legend className="block text-sm font-semibold text-white mb-6">
            Interested Features
          </legend>
        <div className="space-y-4 sm:space-y-5">
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
      <motion.div variants={staggerItem} className="w-full">
        <div className="mb-4">
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
        </div>
      </motion.div>

      {/* Marketing Consent (Optional) */}
      <motion.div variants={staggerItem} className="w-full">
        <div className="mb-4">
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
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={staggerItem} className="pt-4 sm:pt-6">
        <Button
          type="submit"
          variant="professional"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="w-full min-h-[56px] px-8 py-4 text-lg touch-manipulation"
          leftIcon={<SparklesIcon className="w-5 h-5" />}
        >
          {isSubmitting ? 'Joining Waitlist...' : 'Reserve My Spot'}
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