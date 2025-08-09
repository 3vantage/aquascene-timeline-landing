'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimationManager } from '@/lib/animation-config';

interface LightRayProps {
  className?: string;
  intensity?: 'subtle' | 'normal' | 'dramatic';
}

const UnderwaterLightRays: React.FC<LightRayProps> = ({ 
  className = '', 
  intensity = 'normal' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const animationManager = AnimationManager.getInstance();
  const config = animationManager.getAnimationConfig();

  useEffect(() => {
    if (!config.enabled) {
      setIsVisible(false);
    }
  }, [config.enabled]);

  if (!isVisible || !config.enabled) {
    return null;
  }

  const intensityConfig = {
    subtle: { opacity: 0.1, rayCount: 3 },
    normal: { opacity: 0.15, rayCount: 5 },
    dramatic: { opacity: 0.25, rayCount: 7 }
  };

  const { opacity, rayCount } = intensityConfig[intensity];

  const rays = Array.from({ length: rayCount }, (_, i) => ({
    id: i,
    left: `${10 + (i * 80 / rayCount)}%`,
    width: `${15 + Math.random() * 10}px`,
    delay: i * 0.5,
    duration: 8 + Math.random() * 4
  }));

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-0 bottom-0"
          style={{ 
            left: ray.left, 
            width: ray.width,
            background: `linear-gradient(
              180deg,
              rgba(135, 206, 235, ${opacity}) 0%,
              rgba(135, 206, 235, ${opacity * 0.7}) 30%,
              rgba(135, 206, 235, ${opacity * 0.4}) 60%,
              rgba(135, 206, 235, 0) 100%
            )`,
            filter: 'blur(2px)',
            transformOrigin: 'top center'
          }}
          animate={{
            scaleY: [0.8, 1, 0.9, 1, 0.8],
            opacity: [opacity * 0.5, opacity, opacity * 0.8, opacity, opacity * 0.5],
            skewX: [-2, 1, -1, 2, -2]
          }}
          transition={{
            duration: ray.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: ray.delay
          }}
        />
      ))}
      
      {/* Additional shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 60% 40% at 50% 0%,
            rgba(135, 206, 235, ${opacity * 0.3}) 0%,
            rgba(135, 206, 235, ${opacity * 0.1}) 50%,
            transparent 100%
          )`,
          filter: 'blur(3px)'
        }}
        animate={{
          opacity: [0.3, 0.7, 0.5, 0.8, 0.3],
          scale: [1, 1.1, 1.05, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default UnderwaterLightRays;