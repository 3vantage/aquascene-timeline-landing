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
        className={`glass-deep-water p-4 sm:p-6 md:p-8 rounded-2xl ${className}`}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-success to-accent-emerald rounded-full mb-4 sm:mb-6"
            animate={{ scale: [0, 1.2, 1], rotate: [0, 360, 360] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Welcome, Fellow Aquascaper! 🌿
          </h3>
          
          <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6 px-2 sm:px-0">
            You're now part of Central Europe's most advanced aquascaping community!
          </p>
          
          <div className="glass-underwater p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 border border-emerald-400/30">
            <p className="text-sm sm:text-base text-emerald-300 font-semibold">
              You're #{submissionResult.position} in line <span className="hidden sm:inline">• Early access coming soon!</span>
            </p>
          </div>
          
          <p className="text-cyan-200 mb-4 sm:mb-6 text-xs sm:text-sm px-2 sm:px-0 leading-relaxed">
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
        className={`glass-deep-water p-4 sm:p-6 md:p-8 rounded-2xl border border-error/30 ${className}`}
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <ExclamationCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-error mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6 px-2 sm:px-0">{submissionResult.error}</p>
          <Button
            onClick={() => setSubmissionResult(null)}
            variant="primary"
            className="min-h-[48px] w-full sm:w-auto touch-manipulation"
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
      className={`glass-deep-water p-4 sm:p-6 md:p-8 rounded-2xl space-y-4 sm:space-y-6 ${className}`}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Name Field */}
      <motion.div variants={staggerItem}>
        <Input
          {...register('name')}
          label="Your Name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          variant="glass"
        />
      </motion.div>

      {/* Email Field */}
      <motion.div variants={staggerItem}>
        <Input
          {...register('email')}
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          error={errors.email?.message}
          variant="glass"
        />
      </motion.div>

      {/* Experience Level */}
      <motion.div variants={staggerItem}>
        <Controller
          name="experience"
          control={control}
          render={({ field }) => (
            <Select
              label="Experience Level"
              placeholder="Select your experience"
              options={experienceOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.experience?.message}
              variant="glass"
            />
          )}
        />
      </motion.div>

      {/* Interests */}
      <motion.div variants={staggerItem}>
        <label className="block text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">
          Interested Features
        </label>
        <div className="space-y-2 sm:space-y-3">
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

      {/* Submit Button */}
      <motion.div variants={staggerItem} className="pt-2 sm:pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white border-0 font-semibold min-h-[48px] touch-manipulation"
          leftIcon={<SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
        >
          {isSubmitting ? 'Joining Waitlist...' : 'Reserve My Spot'}
        </Button>
      </motion.div>

      {/* Privacy Links */}
      <motion.div variants={staggerItem} className="text-center pt-2 sm:pt-4">
        <p className="text-xs text-white/60 leading-relaxed px-2 sm:px-0">
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