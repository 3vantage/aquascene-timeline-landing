'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  XMarkIcon,
  CogIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import Button from './Button';
import { updateConsentSettings } from '@/lib/analytics';

interface CookieConsentProps {
  className?: string;
  position?: 'bottom' | 'top' | 'center';
  variant?: 'banner' | 'modal' | 'corner';
}

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  className = '',
  position = 'bottom',
  variant = 'banner'
}) => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie_consent');
    const consentDate = localStorage.getItem('cookie_consent_date');
    
    // Show consent banner if no previous consent or if consent is older than 1 year
    if (!consentGiven || isConsentExpired(consentDate)) {
      setShowConsent(true);
    } else {
      // Load previous preferences
      try {
        const savedPreferences = JSON.parse(localStorage.getItem('cookie_preferences') || '{}');
        setPreferences({ ...preferences, ...savedPreferences });
        // Apply saved consent settings
        updateConsentSettings(savedPreferences.analytics || false);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const isConsentExpired = (dateString: string | null): boolean => {
    if (!dateString) return true;
    const consentDate = new Date(dateString);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return consentDate < oneYearAgo;
  };

  const handleAcceptAll = (): void => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    
    saveConsent(allAccepted);
    updateConsentSettings(true);
    setShowConsent(false);
  };

  const handleAcceptNecessary = (): void => {
    const necessaryOnly: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    saveConsent(necessaryOnly);
    updateConsentSettings(false);
    setShowConsent(false);
  };

  const handleSavePreferences = (): void => {
    saveConsent(preferences);
    updateConsentSettings(preferences.analytics);
    setShowConsent(false);
    setShowDetails(false);
  };

  const saveConsent = (prefs: ConsentPreferences): void => {
    localStorage.setItem('cookie_consent', 'given');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    localStorage.setItem('cookie_preferences', JSON.stringify(prefs));
  };

  const handlePreferenceChange = (type: keyof ConsentPreferences, value: boolean): void => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  const toggleDetails = (): void => {
    setShowDetails(!showDetails);
  };

  const positionClasses = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const variantClasses = {
    banner: 'w-full',
    modal: 'max-w-2xl mx-auto rounded-2xl',
    corner: 'bottom-4 right-4 max-w-sm rounded-2xl'
  };

  if (!showConsent) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        {variant === 'modal' && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleAcceptNecessary()}
          />
        )}

        {/* Consent Banner/Modal */}
        <motion.div
          className={`
            relative glass-deep-water backdrop-blur-lg border border-cyan-500/30 
            ${variantClasses[variant]} ${className}
          `}
          initial={{ y: variant === 'bottom' ? 100 : -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: variant === 'bottom' ? 100 : -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Privacy & Cookies</h3>
                  <p className="text-sm text-cyan-200/80">We respect your privacy</p>
                </div>
              </div>
              
              <button
                onClick={() => handleAcceptNecessary()}
                className="p-1 text-white/50 hover:text-white transition-colors"
                aria-label="Close consent banner"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content */}
            {!showDetails ? (
              <div className="space-y-4">
                <p className="text-cyan-100 leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage, and assist in our 
                  marketing efforts. By continuing to use our site, you consent to our use of cookies.
                </p>

                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <InformationCircleIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">What we collect:</span>
                  </div>
                  <ul className="text-sm text-blue-200/80 space-y-1">
                    <li>• Essential cookies for site functionality</li>
                    <li>• Anonymous usage statistics (with your consent)</li>
                    <li>• Form submission data for waitlist management</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold"
                    size="sm"
                  >
                    Accept All Cookies
                  </Button>
                  
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="secondary"
                    className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20"
                    size="sm"
                  >
                    Necessary Only
                  </Button>
                  
                  <Button
                    onClick={toggleDetails}
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300"
                    size="sm"
                    leftIcon={<CogIcon className="w-4 h-4" />}
                  >
                    Customize
                  </Button>
                </div>
              </div>
            ) : (
              /* Detailed Preferences */
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Cookie Preferences</h4>
                  
                  {/* Necessary Cookies */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 glass-underwater rounded-lg border border-emerald-500/30">
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Necessary Cookies</h5>
                        <p className="text-sm text-cyan-200/80 mt-1">
                          Essential for the website to function properly. Cannot be disabled.
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-4 glass-underwater rounded-lg border border-cyan-500/30">
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Analytics Cookies</h5>
                        <p className="text-sm text-cyan-200/80 mt-1">
                          Help us understand how visitors interact with our website.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.analytics 
                              ? 'bg-emerald-500 justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>
                    </div>

                    {/* Functional Cookies */}
                    <div className="flex items-center justify-between p-4 glass-underwater rounded-lg border border-cyan-500/30">
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Functional Cookies</h5>
                        <p className="text-sm text-cyan-200/80 mt-1">
                          Enable enhanced functionality and personalization.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.functional 
                              ? 'bg-emerald-500 justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-4 glass-underwater rounded-lg border border-cyan-500/30">
                      <div className="flex-1">
                        <h5 className="font-medium text-white">Marketing Cookies</h5>
                        <p className="text-sm text-cyan-200/80 mt-1">
                          Used to track visitors and display relevant ads.
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                          className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                            preferences.marketing 
                              ? 'bg-emerald-500 justify-end' 
                              : 'bg-gray-600 justify-start'
                          } px-1`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Policy Link */}
                <div className="text-center pt-4 border-t border-cyan-500/20">
                  <p className="text-sm text-cyan-200/70">
                    For more information, please read our{' '}
                    <a 
                      href="/privacy-policy" 
                      className="text-cyan-400 hover:text-cyan-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold"
                    size="sm"
                  >
                    Save Preferences
                  </Button>
                  
                  <Button
                    onClick={toggleDetails}
                    variant="secondary"
                    className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20"
                    size="sm"
                  >
                    Back to Simple View
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + Math.sin(i) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;