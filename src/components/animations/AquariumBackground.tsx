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

  // Rich 8-zone depth system with premium aquascaping colors
  const getAquariumZone = (depth: number) => {
    const zones = [
      { 
        name: 'Surface', 
        range: [0, 12], 
        background: 'linear-gradient(180deg, rgba(173, 216, 230, 0.9) 0%, rgba(135, 206, 250, 0.8) 40%, rgba(100, 149, 237, 0.7) 100%)',
        textColor: 'rgba(25, 25, 112, 0.9)',
        accentColor: '#1E3A8A'
      },
      { 
        name: 'Shallow Waters', 
        range: [12, 25], 
        background: 'linear-gradient(180deg, rgba(100, 149, 237, 0.8) 0%, rgba(70, 130, 180, 0.7) 50%, rgba(65, 105, 225, 0.6) 100%)',
        textColor: 'rgba(255, 255, 255, 0.95)',
        accentColor: '#3B82F6'
      },
      { 
        name: 'Coral Gardens', 
        range: [25, 37], 
        background: 'linear-gradient(180deg, rgba(65, 105, 225, 0.7) 0%, rgba(30, 144, 255, 0.6) 30%, rgba(0, 191, 255, 0.5) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#0EA5E9'
      },
      { 
        name: 'Plant Forest', 
        range: [37, 50], 
        background: 'linear-gradient(180deg, rgba(0, 191, 255, 0.6) 0%, rgba(32, 178, 170, 0.5) 50%, rgba(0, 139, 139, 0.4) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#06B6D4'
      },
      { 
        name: 'Mid Waters', 
        range: [50, 62], 
        background: 'linear-gradient(180deg, rgba(0, 139, 139, 0.5) 0%, rgba(25, 25, 112, 0.4) 50%, rgba(72, 61, 139, 0.3) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#8B5CF6'
      },
      { 
        name: 'Deep Reef', 
        range: [62, 75], 
        background: 'linear-gradient(180deg, rgba(72, 61, 139, 0.4) 0%, rgba(75, 0, 130, 0.3) 50%, rgba(25, 25, 112, 0.2) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#7C3AED'
      },
      { 
        name: 'Twilight Zone', 
        range: [75, 87], 
        background: 'linear-gradient(180deg, rgba(25, 25, 112, 0.3) 0%, rgba(16, 16, 64, 0.2) 50%, rgba(8, 8, 32, 0.1) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#6366F1'
      },
      { 
        name: 'Abyssal Plains', 
        range: [87, 100], 
        background: 'linear-gradient(180deg, rgba(8, 8, 32, 0.2) 0%, rgba(4, 4, 16, 0.1) 50%, rgba(2, 2, 8, 0.05) 100%)',
        textColor: 'rgba(255, 255, 255, 1)',
        accentColor: '#4F46E5'
      }
    ];

    return zones.find(zone => depth >= zone.range[0] && depth < zone.range[1]) || zones[zones.length - 1];
  };

  // Generate dense fish population for rich aquarium feel
  const fishTypes = ['neon-tetra', 'angelfish', 'guppy', 'betta', 'goldfish'] as const;
  const fishSizes = ['small', 'medium', 'large'] as const;
  
  const generateFish = () => {
    const baseFishCount = 25; // Much more fish for dense population
    const depthBonus = Math.floor(depth / 15) * 5; // More fish as we go deeper
    const totalFish = baseFishCount + depthBonus;
    
    return Array.from({ length: totalFish }, (_, i) => ({
      id: i,
      type: fishTypes[Math.floor(Math.random() * fishTypes.length)],
      size: fishSizes[Math.floor(Math.random() * fishSizes.length)],
      startDelay: Math.random() * 15, // Spread out timing more
      depth: Math.random() * 100,
      speed: 0.8 + Math.random() * 0.6, // Vary swimming speeds
      verticalRange: 100 + Math.random() * 200 // Different vertical movement ranges
    }));
  };

  // Generate dense plant forest
  const plantTypes = ['vallisneria', 'java-fern', 'anubias', 'amazon-sword', 'cabomba'] as const;
  
  const generatePlants = () => {
    const plantDensity = 35; // Much denser plant coverage
    
    return Array.from({ length: plantDensity }, (_, i) => {
      const clusterIndex = Math.floor(i / 5); // Group plants in clusters
      const withinCluster = i % 5;
      const baseX = (windowSize.width / 7) * clusterIndex;
      
      return {
        id: i,
        type: plantTypes[Math.floor(Math.random() * plantTypes.length)],
        height: 40 + Math.random() * 180, // Much more height variation
        position: {
          x: baseX + withinCluster * (30 + Math.random() * 40), // Clustered positioning
          y: Math.random() * 30
        },
        swayIntensity: 1 + Math.random() * 5,
        scale: 0.7 + Math.random() * 0.6 // Varying plant sizes
      };
    });
  };

  const [fish] = useState(generateFish());
  const [plants] = useState(generatePlants());
  
  const currentZone = getAquariumZone(depth);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Rich aquarium background with zone-based colors */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: currentZone.background
        }}
        animate={{
          background: [
            currentZone.background,
            currentZone.background.replace(/0\.\d+\)/g, (match) => {
              const opacity = parseFloat(match.slice(0, -1));
              return `${Math.min(1, opacity + 0.1)})`;
            }),
            currentZone.background
          ]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Volumetric lighting effects */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 150% 100% at 50% -20%, 
            rgba(255, 255, 255, ${Math.max(0, 0.15 - depth * 0.002)}) 0%, 
            transparent 70%)`
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Dynamic caustic light patterns */}
      {depth < 50 && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 200px 100px at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 150px 80px at 70% 20%, rgba(135, 206, 250, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 180px 120px at 40% 60%, rgba(173, 216, 230, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 220px 150px at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
          animate={{
            backgroundPosition: [
              '20% 30%, 70% 20%, 40% 60%, 80% 80%',
              '25% 35%, 75% 25%, 45% 65%, 85% 85%',
              '15% 25%, 65% 15%, 35% 55%, 75% 75%',
              '20% 30%, 70% 20%, 40% 60%, 80% 80%'
            ],
            opacity: [0.1, 0.3, 0.15, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

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

      {/* Dense Swimming Fish Population */}
      {fish.map((fishData) => (
        <SwimmingFish
          key={fishData.id}
          type={fishData.type}
          size={fishData.size}
          startDelay={fishData.startDelay}
          depth={fishData.depth}
        />
      ))}

      {/* Dense Aquatic Plant Forest */}
      {plants.map((plant) => (
        <AquaticPlant
          key={plant.id}
          type={plant.type}
          height={plant.height}
          position={plant.position}
          swayIntensity={plant.swayIntensity}
        />
      ))}

      {/* Additional ecosystem elements */}
      <div className="absolute inset-0">
        {/* Floating algae particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-green-400/40 rounded-full"
            style={{
              left: Math.random() * windowSize.width,
              top: Math.random() * windowSize.height,
            }}
            animate={{
              y: [0, -windowSize.height * 0.3, 0],
              x: [0, (Math.random() - 0.5) * 100, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              delay: Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Sediment particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`sediment-${i}`}
            className="absolute w-0.5 h-0.5 bg-yellow-600/30 rounded-full"
            style={{
              left: Math.random() * windowSize.width,
              bottom: Math.random() * 100,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              delay: Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

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