'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  type?: 'bubbles' | 'waves' | 'fish' | 'spinner';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BubblesLoader: React.FC<{ size: string; className: string }> = ({ size, className }) => {
  const bubbleSizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`bg-cyan-400 rounded-full ${bubbleSizes[size as keyof typeof bubbleSizes]}`}
          animate={{
            y: [-10, -30, -10],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

const WavesLoader: React.FC<{ size: string; className: string }> = ({ size, className }) => {
  const barSizes = {
    small: 'w-1 h-8',
    medium: 'w-1.5 h-12',
    large: 'w-2 h-16'
  };

  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`bg-gradient-to-t from-cyan-500 to-blue-400 ${barSizes[size as keyof typeof barSizes]}`}
          animate={{
            scaleY: [0.4, 1, 0.4],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

const FishLoader: React.FC<{ size: string; className: string }> = ({ size, className }) => {
  const fishSizes = {
    small: 'w-8 h-4',
    medium: 'w-12 h-6',
    large: 'w-16 h-8'
  };

  return (
    <div className={`relative ${fishSizes[size as keyof typeof fishSizes]} ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, 20, 0],
          rotateY: [0, 0, 180, 180, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <svg viewBox="0 0 32 16" className="w-full h-full text-cyan-400 fill-current">
          <ellipse cx="12" cy="8" rx="10" ry="3" opacity="0.8" />
          <path d="M22 8 L28 6 L28 10 Z" opacity="0.6" />
          <circle cx="6" cy="7" r="1.5" fill="#FF4081" />
        </svg>
      </motion.div>
    </div>
  );
};

const SpinnerLoader: React.FC<{ size: string; className: string }> = ({ size, className }) => {
  const spinnerSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`border-2 border-cyan-400 border-t-transparent rounded-full ${spinnerSizes[size as keyof typeof spinnerSizes]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'bubbles',
  size = 'medium',
  className = ''
}) => {
  const loaders = {
    bubbles: BubblesLoader,
    waves: WavesLoader,
    fish: FishLoader,
    spinner: SpinnerLoader
  };

  const LoaderComponent = loaders[type];

  return <LoaderComponent size={size} className={className} />;
};

export default LoadingAnimation;