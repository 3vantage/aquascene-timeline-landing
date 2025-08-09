'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationManager } from '@/lib/animation-config';

interface Ripple {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

interface WaterRippleEffectProps {
  className?: string;
  trigger?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const WaterRippleEffect: React.FC<WaterRippleEffectProps> = ({ 
  className = '', 
  trigger = false, 
  onClick 
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const animationManager = AnimationManager.getInstance();
  const config = animationManager.getAnimationConfig();

  const createRipple = useCallback((e: React.MouseEvent) => {
    if (!config.enabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x,
      y,
      timestamp: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Clean up old ripples
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 1000);

    onClick?.(e);
  }, [config.enabled, onClick]);

  if (!config.enabled) {
    return (
      <div 
        className={className} 
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      />
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x - 2,
              top: ripple.y - 2,
              width: 4,
              height: 4
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 50, opacity: 0 }}
            exit={{ scale: 60, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
          >
            <div 
              className="w-full h-full rounded-full border-2"
              style={{
                borderColor: 'rgba(135, 206, 235, 0.6)',
                background: 'rgba(135, 206, 235, 0.1)'
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WaterRippleEffect;