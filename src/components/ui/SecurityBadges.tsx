'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  EyeSlashIcon,
  DocumentCheckIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animation-config';

interface SecurityBadge {
  icon: React.ReactNode;
  text: string;
  description?: string;
}

interface SecurityBadgesProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

const SecurityBadges: React.FC<SecurityBadgesProps> = ({ 
  variant = 'compact',
  className = '' 
}) => {
  const badges: SecurityBadge[] = [
    {
      icon: <LockClosedIcon className="w-4 h-4" />,
      text: "🔒 Secure & Encrypted",
      description: "All data is encrypted in transit and at rest"
    },
    {
      icon: <EyeSlashIcon className="w-4 h-4" />,
      text: "We'll never spam you",
      description: "Unsubscribe at any time with one click"
    },
    {
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      text: "GDPR Compliant",
      description: "Your privacy rights are protected"
    },
    {
      icon: <HeartIcon className="w-4 h-4" />,
      text: "Trusted by 1000+ aquascapers",
      description: "Join our growing community"
    }
  ];

  if (variant === 'compact') {
    return (
      <motion.div
        className={`flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm ${className}`}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {badges.slice(0, 2).map((badge, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className="flex items-center gap-2 text-cyan-300/80 hover:text-cyan-200 transition-colors duration-200"
          >
            {badge.icon}
            <span>{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          variants={staggerItem}
          className="flex items-start gap-3 p-3 glass-underwater rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200"
        >
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-500/20 rounded-full text-cyan-300">
            {badge.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-cyan-200 mb-1">
              {badge.text}
            </h4>
            {badge.description && (
              <p className="text-xs text-cyan-300/70 leading-relaxed">
                {badge.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}

      {/* Privacy and Terms Links */}
      <motion.div
        variants={staggerItem}
        className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs"
      >
        <a 
          href="/privacy" 
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200 touch-target"
          aria-label="Read our Privacy Policy"
        >
          <DocumentCheckIcon className="w-3 h-3" />
          Privacy Policy
        </a>
        <span className="text-cyan-500/50">•</span>
        <a 
          href="/terms" 
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200 touch-target"
          aria-label="Read our Terms of Service"
        >
          <DocumentCheckIcon className="w-3 h-3" />
          Terms of Service
        </a>
      </motion.div>
    </motion.div>
  );
};

export default SecurityBadges;