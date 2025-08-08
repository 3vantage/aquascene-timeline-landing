'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SuccessStateProps {
  title?: string;
  message?: string;
  position?: number;
  className?: string;
  onContinue?: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({ 
  title = "Welcome to the Deep!",
  message = "You're now part of our aquascaping community",
  position,
  className = '',
  onContinue
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden glass-deep-water p-8 rounded-3xl border border-emerald-500/30 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.6, -0.05, 0.01, 0.99]
      }}
    >
      {/* Success fish animation */}
      <div className="relative">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: -50,
              y: 50 + i * 20,
              opacity: 0
            }}
            animate={{ 
              x: 300,
              y: 50 + i * 20 + Math.sin(i) * 10,
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg width="24" height="16" viewBox="0 0 40 24" className="text-emerald-400">
              <g fill="currentColor">
                <ellipse cx="12" cy="8" rx="10" ry="3" opacity="0.8" />
                <path d="M22 8 L28 6 L28 10 Z" opacity="0.6" />
                <circle cx="6" cy="7" r="1.5" fill="#00FFD4" />
                <path d="M2 8 C2 8 0 6 2 4 C4 6 2 8 2 8" opacity="0.7" />
              </g>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Success checkmark with ripple effect */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 relative"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>

          {/* Ripple effect */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-emerald-400 rounded-full"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.8, 0.3, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Title and message */}
      <motion.h2
        className="text-2xl font-bold text-white text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-cyan-200 text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {message}
      </motion.p>

      {/* Position indicator */}
      {position && (
        <motion.div
          className="glass-underwater p-4 rounded-2xl border border-emerald-400/30 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p className="text-emerald-300 font-semibold text-center">
            You're #{position} in line for early access!
          </p>
        </motion.div>
      )}

      {/* Floating success particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 360]
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

      {/* Action button */}
      {onContinue && (
        <motion.button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue Your Journey
        </motion.button>
      )}

      {/* Ambient aquarium glow */}
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent rounded-3xl pointer-events-none" />
    </motion.div>
  );
};

export default SuccessState;