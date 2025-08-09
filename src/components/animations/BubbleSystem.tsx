'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationManager, bubbleFloat } from '@/lib/animation-config';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  color: string;
}

interface BubbleSystemProps {
  maxBubbles?: number;
  className?: string;
  intensity?: 'light' | 'normal' | 'heavy';
}

const BubbleSystem: React.FC<BubbleSystemProps> = ({ 
  maxBubbles = 25, 
  className = '',
  intensity = 'normal'
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const animationManager = AnimationManager.getInstance();
  const config = animationManager.getAnimationConfig();

  const bubbleColors = [
    'rgba(135, 206, 235, 0.6)',
    'rgba(64, 224, 208, 0.5)',
    'rgba(95, 158, 160, 0.4)',
    'rgba(176, 224, 230, 0.7)',
    'rgba(0, 191, 255, 0.5)',
  ];

  const intensityConfig = {
    light: { multiplier: 0.3, interval: 12000 },
    normal: { multiplier: 1, interval: 3000 },
    heavy: { multiplier: 2, interval: 1500 }
  };

  const generateBubble = useCallback((index: number): Bubble => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    
    return {
      id: `bubble-${Date.now()}-${index}-${Math.random()}`,
      x: Math.random() * screenWidth,
      y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
      size: Math.random() * 30 + 8,
      speed: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 3,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
    };
  }, []);

  const generateBubbles = useCallback(() => {
    if (!config.enabled) return;
    
    const bubbleCount = Math.floor(Math.min(maxBubbles, (config.particleCount || 8) * intensityConfig[intensity].multiplier));
    const newBubbles: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => 
      generateBubble(i)
    );
    
    setBubbles(prev => [...prev, ...newBubbles].slice(-maxBubbles * 2));
  }, [generateBubble, maxBubbles, config.enabled, config.particleCount, intensity]);

  const clearOldBubbles = useCallback(() => {
    setBubbles(prev => prev.slice(-maxBubbles));
  }, [maxBubbles]);

  useEffect(() => {
    if (!config.enabled) {
      setIsVisible(false);
      return;
    }

    generateBubbles();
    
    const bubbleInterval = setInterval(generateBubbles, intensityConfig[intensity].interval);
    const cleanupInterval = setInterval(clearOldBubbles, 10000);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(cleanupInterval);
    };
  }, [generateBubbles, clearOldBubbles, config.enabled, intensity]);

  useEffect(() => {
    const handleResize = () => {
      if (config.enabled) {
        setBubbles([]);
        generateBubbles();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateBubbles, config.enabled]);

  if (!isVisible || !config.enabled) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute"
            initial={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
              x: bubble.x,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              y: -100,
              x: [
                bubble.x,
                bubble.x + (Math.sin(Date.now() * 0.001) * 40),
                bubble.x + (Math.sin(Date.now() * 0.002) * 60),
                bubble.x + (Math.sin(Date.now() * 0.003) * 20),
                bubble.x
              ],
              scale: [0, 1, 1, 0.8, 0],
              opacity: [0, bubble.opacity, bubble.opacity, 0.3, 0],
              rotate: [0, 15, -10, 20, 0]
            }}
            exit={{ opacity: 0, scale: 0, y: -200 }}
            transition={{
              duration: bubble.speed * 3,
              ease: 'easeInOut',
              delay: bubble.delay,
              times: [0, 0.2, 0.6, 0.9, 1]
            }}
            style={{
              width: bubble.size,
              height: bubble.size,
            }}
          >
            <div 
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background: `radial-gradient(
                  circle at 25% 25%,
                  rgba(255, 255, 255, 0.9),
                  ${bubble.color},
                  rgba(30, 58, 95, 0.1)
                )`,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(1px)',
                boxShadow: `
                  inset 0 0 15px rgba(255, 255, 255, 0.4),
                  0 4px 15px rgba(0, 0, 0, 0.1),
                  inset -2px -2px 5px rgba(255, 255, 255, 0.6)
                `
              }}
            >
              {/* Bubble highlight */}
              <div
                className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  filter: 'blur(1px)'
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleSystem;