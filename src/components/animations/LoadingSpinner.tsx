'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = "Loading...",
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Bubble loading animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Central bubble */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Orbiting bubbles */}
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Center aquarium icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.svg 
            className="w-6 h-6 text-cyan-400" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <path d="M12,2A2,2 0 0,1 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4A2,2 0 0,1 12,2ZM21,9V7L15,7.5L15,11.5C15.8,11.8 16.5,12.4 17,13.1L21,9ZM3,9L7,13.1C7.5,12.4 8.2,11.8 9,11.5V7.5L3,7V9ZM9,12C7.9,12 7,12.9 7,14S7.9,16 9,16 11,15.1 11,14 10.1,12 9,12ZM15,12C13.9,12 13,12.9 13,14S13.9,16 15,16 17,15.1 17,14 16.1,12 15,12ZM12,10.5C11.2,10.5 10.5,11.2 10.5,12S11.2,13.5 12,13.5 13.5,12.8 13.5,12 12.8,10.5 12,10.5Z"/>
          </svg>
        </div>
      </div>

      {/* Rising bubbles */}
      <div className="relative w-full h-16 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              bottom: -4,
            }}
            animate={{
              y: [-4, -60],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className="text-cyan-300 text-sm font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// Aquarium-themed loading overlay
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Preparing your aquascape..." 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Underwater backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-teal-900/80 backdrop-blur-sm" />
      
      {/* Floating particles background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Loading content */}
      <div className="relative z-10">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </motion.div>
  );
};

export { LoadingSpinner, LoadingOverlay };
export default LoadingSpinner;