'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SwimmingFish from './SwimmingFish';
import AquaticPlant from './AquaticPlants';
import BubbleSystem from './BubbleSystem';

interface AquariumBackgroundProps {
  depth?: number; // 0-100, affects the background color depth
  className?: string;
}

const AquariumBackground: React.FC<AquariumBackgroundProps> = ({ depth = 0, className }) => {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Dynamic background colors based on depth
  const getAquariumColors = (depth: number) => {
    const colors = [
      { stop: 0, color: 'rgba(135, 206, 250, 0.3)' }, // Light blue surface
      { stop: 20, color: 'rgba(70, 130, 180, 0.4)' }, // Steel blue
      { stop: 40, color: 'rgba(25, 80, 120, 0.5)' },  // Deeper blue
      { stop: 60, color: 'rgba(15, 50, 80, 0.6)' },   // Deep ocean
      { stop: 80, color: 'rgba(10, 30, 50, 0.7)' },   // Abyss blue
      { stop: 100, color: 'rgba(5, 15, 25, 0.8)' }    // Deep abyss
    ];
    
    const currentColor = colors.find((c, i) => depth <= c.stop) || colors[colors.length - 1];
    return currentColor.color;
  };

  // Generate random fish
  const fishTypes = ['neon-tetra', 'angelfish', 'guppy', 'betta', 'goldfish'] as const;
  const fishSizes = ['small', 'medium', 'large'] as const;
  
  const generateFish = () => {
    return Array.from({ length: 8 + Math.floor(depth / 20) }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      size: fishSizes[Math.floor(Math.random() * fishSizes.length)],
      startDelay: Math.random() * 10,
      depth: Math.random() * 100
    }));
  };

  // Generate plants at the bottom
  const plantTypes = ['vallisneria', 'java-fern', 'anubias', 'amazon-sword', 'cabomba'] as const;
  
  const generatePlants = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      type: plantTypes[Math.floor(Math.random() * plantTypes.length)],
      height: 60 + Math.random() * 140,
      position: {
        x: (windowSize.width / 12) * i + Math.random() * 50,
        y: Math.random() * 20
      },
      swayIntensity: 2 + Math.random() * 4
    }));
  };

  const [fish] = useState(generateFish());
  const [plants] = useState(generatePlants());

  if (!mounted) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(135, 206, 250, 0.1) 0%,
            ${getAquariumColors(depth * 0.3)} 30%,
            ${getAquariumColors(depth * 0.6)} 60%,
            ${getAquariumColors(depth)} 100%
          )`
        }}
        animate={{
          background: [
            `linear-gradient(180deg, rgba(135, 206, 250, 0.1) 0%, ${getAquariumColors(depth * 0.3)} 30%, ${getAquariumColors(depth * 0.6)} 60%, ${getAquariumColors(depth)} 100%)`,
            `linear-gradient(180deg, rgba(135, 206, 250, 0.15) 0%, ${getAquariumColors(depth * 0.3 + 5)} 30%, ${getAquariumColors(depth * 0.6 + 5)} 60%, ${getAquariumColors(depth + 5)} 100%)`,
            `linear-gradient(180deg, rgba(135, 206, 250, 0.1) 0%, ${getAquariumColors(depth * 0.3)} 30%, ${getAquariumColors(depth * 0.6)} 60%, ${getAquariumColors(depth)} 100%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles/debris */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: Math.random() * windowSize.width,
              top: Math.random() * windowSize.height,
            }}
            animate={{
              y: [0, -windowSize.height * 1.2],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: Math.random() * 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Light rays from surface */}
      {depth < 50 && (
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-px bg-gradient-to-b from-yellow-200/40 to-transparent"
              style={{
                left: `${20 + i * 15}%`,
                height: '60%',
                transformOrigin: 'top'
              }}
              animate={{
                rotate: [2, -2, 2],
                scaleY: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Bubble System */}
      <BubbleSystem count={20} />

      {/* Swimming Fish */}
      {fish.map((fishData) => (
        <SwimmingFish
          key={fishData.id}
          type={fishData.type}
          size={fishData.size}
          startDelay={fishData.startDelay}
          depth={fishData.depth}
        />
      ))}

      {/* Aquatic Plants */}
      {plants.map((plant) => (
        <AquaticPlant
          key={plant.id}
          type={plant.type}
          height={plant.height}
          position={plant.position}
          swayIntensity={plant.swayIntensity}
        />
      ))}

      {/* Coral formations in corners */}
      <div className="absolute bottom-0 left-0">
        <motion.div
          className="w-24 h-32"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 100 130" className="w-full h-full">
            <path
              d="M20 130 Q30 100 25 80 Q35 60 30 40 Q40 20 35 0"
              stroke="#FF6BB3"
              strokeWidth="4"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M40 130 Q50 110 45 90 Q55 70 50 50 Q60 30 55 10"
              stroke="#00FFD4"
              strokeWidth="3"
              fill="none"
              opacity="0.5"
            />
            <circle cx="25" cy="40" r="3" fill="#FF4081" opacity="0.7" />
            <circle cx="45" cy="60" r="2" fill="#00FF88" opacity="0.6" />
            <circle cx="35" cy="80" r="2.5" fill="#00D4FF" opacity="0.8" />
          </svg>
        </motion.div>
      </div>

      <div className="absolute bottom-0 right-0">
        <motion.div
          className="w-20 h-28"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <svg viewBox="0 0 80 110" className="w-full h-full">
            <path
              d="M60 110 Q50 85 55 65 Q45 45 50 25 Q40 10 45 0"
              stroke="#00FF88"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M40 110 Q30 90 35 70 Q25 50 30 30 Q20 15 25 5"
              stroke="#FFD700"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <circle cx="55" cy="25" r="2" fill="#FF4081" opacity="0.6" />
            <circle cx="35" cy="45" r="1.5" fill="#00FFD4" opacity="0.7" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default AquariumBackground;