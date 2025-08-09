'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FishProps {
  type: 'neon-tetra' | 'angelfish' | 'guppy' | 'betta' | 'goldfish';
  size?: 'small' | 'medium' | 'large';
  startDelay?: number;
  depth?: number; // 0-100, affects opacity and size
}

const FishSVG: React.FC<{ type: string; className: string }> = ({ type, className }) => {
  const fishPaths = {
    'neon-tetra': (
      <g className={className}>
        <ellipse cx="12" cy="8" rx="10" ry="3" fill="currentColor" opacity="0.8" />
        <path d="M22 8 L28 6 L28 10 Z" fill="currentColor" opacity="0.6" />
        <circle cx="6" cy="7" r="1.5" fill="#FF4081" />
        <path d="M2 8 C2 8 0 6 2 4 C4 6 2 8 2 8" fill="currentColor" opacity="0.7" />
      </g>
    ),
    'angelfish': (
      <g className={className}>
        <ellipse cx="15" cy="12" rx="8" ry="12" fill="currentColor" opacity="0.8" />
        <path d="M23 12 L32 8 L32 16 Z" fill="currentColor" opacity="0.6" />
        <path d="M7 2 C12 4 12 8 15 12 C12 16 12 20 7 22 C10 12 7 2 7 2" fill="currentColor" opacity="0.7" />
        <path d="M7 22 C12 20 12 16 15 12 C12 8 12 4 7 2 C10 12 7 22 7 22" fill="currentColor" opacity="0.7" />
        <circle cx="10" cy="10" r="1.5" fill="#00FFD4" />
      </g>
    ),
    'guppy': (
      <g className={className}>
        <ellipse cx="10" cy="8" rx="6" ry="2.5" fill="currentColor" opacity="0.8" />
        <path d="M16 8 L20 6 L20 10 Z" fill="currentColor" opacity="0.6" />
        <path d="M4 8 C2 4 6 2 10 6 C6 10 2 12 4 8" fill="#FF6BB3" opacity="0.8" />
        <circle cx="6" cy="7" r="1" fill="#00FF88" />
      </g>
    ),
    'betta': (
      <g className={className}>
        <ellipse cx="12" cy="10" rx="8" ry="4" fill="currentColor" opacity="0.8" />
        <path d="M20 10 L26 8 L26 12 Z" fill="currentColor" opacity="0.6" />
        <path d="M4 10 C0 4 8 2 12 8 C8 14 0 16 4 10" fill="#FF4081" opacity="0.9" />
        <path d="M12 6 C8 2 16 0 20 4 C16 8 8 10 12 6" fill="#00D4FF" opacity="0.8" />
        <path d="M12 14 C8 18 16 20 20 16 C16 12 8 10 12 14" fill="#00FFD4" opacity="0.8" />
        <circle cx="8" cy="9" r="1.5" fill="#FFFFFF" />
      </g>
    ),
    'goldfish': (
      <g className={className}>
        <ellipse cx="14" cy="10" rx="10" ry="5" fill="currentColor" opacity="0.9" />
        <path d="M24 10 L32 8 L32 12 Z" fill="currentColor" opacity="0.7" />
        <path d="M4 10 C2 6 8 4 14 8 C8 12 2 14 4 10" fill="currentColor" opacity="0.8" />
        <path d="M14 5 C10 2 18 1 22 4 C18 7 10 8 14 5" fill="currentColor" opacity="0.7" />
        <circle cx="9" cy="9" r="1.5" fill="#000000" opacity="0.8" />
      </g>
    )
  };

  return (
    <svg width="40" height="24" viewBox="0 0 40 24">
      {fishPaths[type as keyof typeof fishPaths]}
    </svg>
  );
};

const SwimmingFish: React.FC<FishProps> = ({ 
  type, 
  size = 'medium', 
  startDelay = 0,
  depth = 50
}) => {
  const sizeMultiplier = {
    small: 0.6,
    medium: 1.0,
    large: 1.4
  };

  const colors = {
    'neon-tetra': '#00D4FF',
    'angelfish': '#00FF88', 
    'guppy': '#FF6BB3',
    'betta': '#FF4081',
    'goldfish': '#FFD700'
  };

  const depthOpacity = 0.2 + (depth / 100) * 0.6;
  const depthScale = 0.4 + (depth / 100) * 0.8;
  const swimSpeed = 20 + Math.random() * 15; // 20-35 seconds per cycle
  
  // More natural swimming path
  const startY = typeof window !== 'undefined' ? 
    Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.15 : 
    Math.random() * 400 + 100;
  
  const endY = startY + (Math.random() - 0.5) * 300;
  const midY1 = startY + (Math.random() - 0.5) * 150;
  const midY2 = endY + (Math.random() - 0.5) * 150;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        color: colors[type],
        opacity: depthOpacity,
        scale: sizeMultiplier[size] * depthScale,
        zIndex: Math.floor(depth)
      }}
      initial={{ 
        x: -100,
        y: startY,
      }}
      animate={{
        x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1300,
        y: [startY, midY1, midY2, endY],
      }}
      transition={{
        duration: swimSpeed,
        delay: startDelay,
        repeat: Infinity,
        ease: "linear",
        y: {
          duration: swimSpeed,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.7, 1]
        }
      }}
    >
      <motion.div
        animate={{
          rotateY: [0, 3, -3, 0],
          rotateZ: [0, 1, -1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FishSVG type={type} className="drop-shadow-lg filter blur-[0.5px]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SwimmingFish;