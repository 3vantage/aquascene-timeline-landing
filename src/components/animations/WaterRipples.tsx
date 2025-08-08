'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaterRipplesProps {
  intensity?: number;
  count?: number;
  className?: string;
}

const WaterRipples: React.FC<WaterRipplesProps> = ({ 
  intensity = 1, 
  count = 5,
  className = '' 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Water distortion filter */}
          <filter id="waterRipple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
            <feOffset dx="0" dy="0" result="offset" />
            <feFlood floodColor="#00D4FF" floodOpacity="0.1"/>
            <feComposite in="offset" in2="SourceGraphic" />
          </filter>
          
          {/* Animated gradient for ripples */}
          <radialGradient id="rippleGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0.3)" />
            <stop offset="70%" stopColor="rgba(0, 255, 212, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Animated ripple circles */}
        {Array.from({ length: count }, (_, i) => (
          <motion.circle
            key={i}
            cx={30 + (i * 15)}
            cy={50 + Math.sin(i) * 10}
            fill="url(#rippleGradient)"
            filter="url(#waterRipple)"
            initial={{ r: 0, opacity: 0 }}
            animate={{
              r: [0, 15 * intensity, 25 * intensity],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Surface wave distortions */}
        <motion.path
          d="M0,20 Q25,15 50,20 T100,20 L100,0 L0,0 Z"
          fill="rgba(255, 255, 255, 0.05)"
          animate={{
            d: [
              "M0,20 Q25,15 50,20 T100,20 L100,0 L0,0 Z",
              "M0,22 Q25,17 50,22 T100,22 L100,0 L0,0 Z",
              "M0,18 Q25,13 50,18 T100,18 L100,0 L0,0 Z",
              "M0,20 Q25,15 50,20 T100,20 L100,0 L0,0 Z"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Subsurface waves */}
        <motion.path
          d="M0,30 Q25,25 50,30 T100,30 L100,20 Q75,25 50,20 Q25,15 0,20 Z"
          fill="rgba(0, 255, 212, 0.08)"
          animate={{
            d: [
              "M0,30 Q25,25 50,30 T100,30 L100,20 Q75,25 50,20 Q25,15 0,20 Z",
              "M0,32 Q25,27 50,32 T100,32 L100,22 Q75,27 50,22 Q25,17 0,22 Z",
              "M0,28 Q25,23 50,28 T100,28 L100,18 Q75,23 50,18 Q25,13 0,18 Z",
              "M0,30 Q25,25 50,30 T100,30 L100,20 Q75,25 50,20 Q25,15 0,20 Z"
            ]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Deep water currents */}
        <motion.path
          d="M0,60 Q25,55 50,60 T100,60 L100,40 Q75,45 50,40 Q25,35 0,40 Z"
          fill="rgba(0, 150, 255, 0.06)"
          animate={{
            d: [
              "M0,60 Q25,55 50,60 T100,60 L100,40 Q75,45 50,40 Q25,35 0,40 Z",
              "M0,58 Q25,53 50,58 T100,58 L100,38 Q75,43 50,38 Q25,33 0,38 Z",
              "M0,62 Q25,57 50,62 T100,62 L100,42 Q75,47 50,42 Q25,37 0,42 Z",
              "M0,60 Q25,55 50,60 T100,60 L100,40 Q75,45 50,40 Q25,35 0,40 Z"
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>

      {/* Floating water droplets */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/30"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + Math.sin(i) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Caustic light reflections on water surface */}
      <div className="absolute top-0 left-0 w-full h-1/4">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full"
            style={{
              background: `linear-gradient(${90 + i * 15}deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.1) ${30 + i * 10}%, 
                transparent ${60 + i * 10}%)`
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              transform: [
                'translateX(-20px) skewX(10deg)',
                'translateX(20px) skewX(-10deg)',
                'translateX(-20px) skewX(10deg)'
              ]
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
    </div>
  );
};

export default WaterRipples;