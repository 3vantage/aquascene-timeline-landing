'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface AquariumBackgroundProps {
  depth?: number; // 0-100, affects the background color depth
  className?: string;
}

// Professional aquarium fish component
const Fish: React.FC<{
  id: number;
  size: 'small' | 'medium' | 'large';
  color: string;
  speed: number;
  depth: number;
}> = ({ id, size, color, speed, depth }) => {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const sizeMap = {
    small: { width: 12, height: 8 },
    medium: { width: 20, height: 14 },
    large: { width: 32, height: 22 }
  };

  const fishSize = sizeMap[size];
  const startY = Math.random() * (windowSize.height - 200) + 100;

  return (
    <motion.div
      className="absolute pointer-events-none aquarium-fish"
      style={{
        width: fishSize.width,
        height: fishSize.height,
        zIndex: Math.floor(depth * 10),
      }}
      initial={{
        x: -fishSize.width,
        y: startY,
      }}
      animate={{
        x: windowSize.width + fishSize.width,
        y: startY + (Math.sin(Date.now() / 1000 + id) * 50),
      }}
      transition={{
        duration: 15 / speed,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 10,
      }}
    >
      <svg
        width={fishSize.width}
        height={fishSize.height}
        viewBox="0 0 32 22"
        fill="none"
      >
        {/* Fish body */}
        <ellipse
          cx="16"
          cy="11"
          rx="10"
          ry="6"
          fill={color}
          opacity={0.8}
        />
        {/* Fish tail */}
        <path
          d="M4 11 L0 6 L2 11 L0 16 Z"
          fill={color}
          opacity={0.6}
        />
        {/* Fish eye */}
        <circle
          cx="20"
          cy="9"
          r="2"
          fill="white"
          opacity={0.9}
        />
        <circle
          cx="20"
          cy="9"
          r="1"
          fill="black"
        />
        {/* Fish fin */}
        <path
          d="M16 17 Q12 20 10 17"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity={0.7}
        />
      </svg>
    </motion.div>
  );
};

// Professional seaweed plant component
const Seaweed: React.FC<{
  height: number;
  x: number;
  color: string;
  swayIntensity: number;
}> = ({ height, x, color, swayIntensity }) => {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none origin-bottom aquarium-plant"
      style={{
        left: x,
        zIndex: 5,
      }}
      animate={{
        rotate: [
          -swayIntensity,
          swayIntensity,
          -swayIntensity,
        ],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="8"
        height={height}
        viewBox={`0 0 8 ${height}`}
        fill="none"
      >
        <path
          d={`M4 ${height} Q2 ${height * 0.7} 4 ${height * 0.4} Q6 ${height * 0.2} 4 0`}
          stroke={color}
          strokeWidth="4"
          fill="none"
          opacity={0.7}
        />
        <path
          d={`M4 ${height} Q6 ${height * 0.8} 4 ${height * 0.5} Q2 ${height * 0.3} 4 ${height * 0.1}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity={0.5}
        />
      </svg>
    </motion.div>
  );
};

// Professional coral formation component
const Coral: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
}> = ({ x, y, size, color }) => {
  return (
    <motion.div
      className="absolute pointer-events-none aquarium-coral"
      style={{
        left: x,
        bottom: y,
        zIndex: 3,
      }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        {/* Coral branches */}
        <circle cx={size/2} cy={size/2} r={size/6} fill={color} opacity={0.8} />
        <circle cx={size/3} cy={size/3} r={size/8} fill={color} opacity={0.6} />
        <circle cx={size*2/3} cy={size/4} r={size/10} fill={color} opacity={0.7} />
        <circle cx={size/4} cy={size*3/4} r={size/12} fill={color} opacity={0.5} />
        <circle cx={size*3/4} cy={size*2/3} r={size/9} fill={color} opacity={0.6} />
      </svg>
    </motion.div>
  );
};

// Bubble component
const Bubble: React.FC<{
  id: number;
  startX: number;
  size: number;
}> = ({ id, startX, size }) => {
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <motion.div
      className="absolute pointer-events-none rounded-full bg-white/20 border border-white/30 aquarium-bubble"
      style={{
        width: size,
        height: size,
        left: startX,
        zIndex: 20,
      }}
      initial={{
        y: windowHeight + size,
        opacity: 0,
      }}
      animate={{
        y: -size,
        opacity: [0, 0.6, 0],
        x: startX + (Math.sin(Date.now() / 1000 + id) * 30),
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeOut",
        delay: Math.random() * 5,
      }}
    />
  );
};

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

  // Professional color palette inspired by Ride Engine's high contrast design
  const fishColors = [
    '#00D4FF', // Bright cyan - modern aqua
    '#FF6B6B', // Coral red
    '#4ECDC4', // Teal
    '#FFE66D', // Golden yellow
    '#95E1D3', // Mint green
    '#A8E6CF', // Light green
    '#FF8A80', // Light coral
    '#81C784', // Green
  ];

  const plantColors = [
    '#2E8B57', // Sea green
    '#3CB371', // Medium sea green  
    '#20B2AA', // Light sea green
    '#008B8B', // Dark cyan
    '#4682B4', // Steel blue
  ];

  const coralColors = [
    '#FF7F50', // Coral
    '#FF6347', // Tomato
    '#FFB347', // Peach
    '#DDA0DD', // Plum
    '#98FB98', // Pale green
  ];

  // Generate marine life with performance optimization
  const marineLife = useMemo(() => {
    // Reduce complexity on mobile devices
    const isMobile = windowSize.width < 768;
    
    const fish = Array.from({ length: isMobile ? 8 : 15 }, (_, i) => ({
      id: i,
      size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large',
      color: fishColors[Math.floor(Math.random() * fishColors.length)],
      speed: 0.7 + Math.random() * 0.8,
      depth: Math.random(),
    }));

    const plants = Array.from({ length: isMobile ? 15 : 25 }, (_, i) => ({
      id: i,
      height: 60 + Math.random() * 140,
      x: Math.random() * windowSize.width,
      color: plantColors[Math.floor(Math.random() * plantColors.length)],
      swayIntensity: 2 + Math.random() * 4,
    }));

    const corals = Array.from({ length: isMobile ? 4 : 8 }, (_, i) => ({
      id: i,
      x: Math.random() * windowSize.width,
      y: Math.random() * 80,
      size: 20 + Math.random() * 40,
      color: coralColors[Math.floor(Math.random() * coralColors.length)],
    }));

    const bubbles = Array.from({ length: isMobile ? 6 : 12 }, (_, i) => ({
      id: i,
      startX: Math.random() * windowSize.width,
      size: 4 + Math.random() * 8,
    }));

    return { fish, plants, corals, bubbles };
  }, [windowSize.width, fishColors, plantColors, coralColors]);

  // Professional gradient background
  const backgroundGradient = `
    linear-gradient(180deg, 
      rgba(0, 47, 75, 0.95) 0%,     /* Deep ocean blue */
      rgba(0, 84, 122, 0.9) 25%,    /* Medium ocean */
      rgba(0, 119, 149, 0.85) 50%,  /* Lighter ocean */
      rgba(0, 150, 179, 0.8) 75%,   /* Surface water */
      rgba(135, 206, 250, 0.7) 100% /* Light blue surface */
    )
  `;

  if (!mounted) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden aquarium-background ${className}`}>
      {/* Professional aquarium background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: backgroundGradient,
        }}
        animate={{
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Caustic lighting effects - professional and subtle */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 300px 150px at 30% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse 200px 100px at 70% 10%, rgba(135, 206, 250, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 250px 120px at 50% 30%, rgba(173, 216, 230, 0.2) 0%, transparent 60%)
          `,
        }}
        animate={{
          backgroundPosition: [
            '30% 20%, 70% 10%, 50% 30%',
            '35% 25%, 75% 15%, 55% 35%',
            '25% 15%, 65% 5%, 45% 25%',
            '30% 20%, 70% 10%, 50% 30%',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light rays from surface */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-0.5 bg-gradient-to-b from-yellow-200/60 to-transparent"
            style={{
              left: `${15 + i * 12}%`,
              height: '70%',
              transformOrigin: 'top',
            }}
            animate={{
              rotate: [1, -1, 1],
              scaleY: [1, 1.2, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: windowSize.width < 768 ? 10 : 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full aquarium-particle"
            style={{
              left: Math.random() * windowSize.width,
              top: Math.random() * windowSize.height,
            }}
            animate={{
              y: [0, -windowSize.height * 0.3, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Seaweed forest */}
      {marineLife.plants.map((plant) => (
        <Seaweed
          key={plant.id}
          height={plant.height}
          x={plant.x}
          color={plant.color}
          swayIntensity={plant.swayIntensity}
        />
      ))}

      {/* Coral formations */}
      {marineLife.corals.map((coral) => (
        <Coral
          key={coral.id}
          x={coral.x}
          y={coral.y}
          size={coral.size}
          color={coral.color}
        />
      ))}

      {/* Swimming fish */}
      {marineLife.fish.map((fish) => (
        <Fish
          key={fish.id}
          id={fish.id}
          size={fish.size}
          color={fish.color}
          speed={fish.speed}
          depth={fish.depth}
        />
      ))}

      {/* Bubble system */}
      {marineLife.bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          id={bubble.id}
          startX={bubble.startX}
          size={bubble.size}
        />
      ))}

      {/* Sand/substrate at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 opacity-60"
        style={{
          background: 'linear-gradient(0deg, rgba(139, 119, 101, 0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default AquariumBackground;