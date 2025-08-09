'use client';

import React, { useEffect, useState } from 'react';
import BubbleSystem from './BubbleSystem';
import SwimmingFish from './SwimmingFish';
import UnderwaterLightRays from './UnderwaterLightRays';
import { motion } from 'framer-motion';
import { AnimationManager } from '@/lib/animation-config';

interface AquaticSceneProps {
  className?: string;
  intensity?: 'subtle' | 'normal' | 'dramatic';
  showFish?: boolean;
  showBubbles?: boolean;
  showLightRays?: boolean;
}

const AquaticScene: React.FC<AquaticSceneProps> = ({
  className = '',
  intensity = 'normal',
  showFish = true,
  showBubbles = true,
  showLightRays = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const animationManager = AnimationManager.getInstance();
  const config = animationManager.getAnimationConfig();

  useEffect(() => {
    setIsVisible(config.enabled);
  }, [config.enabled]);

  if (!isVisible) {
    return null;
  }

  const fishTypes: Array<'neon-tetra' | 'angelfish' | 'guppy' | 'betta' | 'goldfish'> = [
    'neon-tetra', 'angelfish', 'guppy', 'betta', 'goldfish'
  ];

  const fishSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

  const intensityConfig = {
    subtle: { fishCount: 2, bubbleIntensity: 'light' as const },
    normal: { fishCount: 4, bubbleIntensity: 'normal' as const },
    dramatic: { fishCount: 6, bubbleIntensity: 'heavy' as const }
  };

  const { fishCount, bubbleIntensity } = intensityConfig[intensity];

  // Generate fish with varied properties
  const fishInstances = Array.from({ length: fishCount }, (_, i) => ({
    id: `fish-${i}`,
    type: fishTypes[i % fishTypes.length],
    size: fishSizes[Math.floor(Math.random() * fishSizes.length)],
    delay: Math.random() * 10 + i * 3, // Staggered appearance
    depth: Math.random() * 80 + 20 // 20-100 depth
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {/* Underwater Light Rays */}
      {showLightRays && (
        <UnderwaterLightRays intensity={intensity} />
      )}

      {/* Bubble System */}
      {showBubbles && (
        <BubbleSystem 
          intensity={bubbleIntensity}
          maxBubbles={intensity === 'subtle' ? 15 : intensity === 'normal' ? 25 : 40}
        />
      )}

      {/* Swimming Fish */}
      {showFish && fishInstances.map(fish => (
        <SwimmingFish
          key={fish.id}
          type={fish.type}
          size={fish.size}
          startDelay={fish.delay}
          depth={fish.depth}
        />
      ))}

      {/* Additional water effects */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at 50% 20%,
            rgba(135, 206, 235, 0.05) 0%,
            rgba(64, 224, 208, 0.03) 40%,
            transparent 80%
          )`,
          filter: 'blur(40px)',
          mixBlendMode: 'multiply'
        }}
        animate={{
          opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
          scale: [1, 1.1, 1.05, 1.15, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Subtle water shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            45deg,
            transparent 48%,
            rgba(255, 255, 255, 0.02) 50%,
            transparent 52%
          )`,
          backgroundSize: '20px 20px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export default AquaticScene;