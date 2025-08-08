'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlantProps {
  type: 'vallisneria' | 'java-fern' | 'anubias' | 'amazon-sword' | 'cabomba';
  height?: number; // 50-200px
  position?: { x: number; y: number };
  swayIntensity?: number; // 0-10
}

const PlantSVG: React.FC<{ type: string; height: number; className: string }> = ({ type, height, className }) => {
  const plantPaths = {
    'vallisneria': (
      <g className={className}>
        <path 
          d={`M20 ${height} Q15 ${height * 0.7} 18 ${height * 0.4} Q22 ${height * 0.2} 20 0`}
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
          opacity="0.8"
        />
        <path 
          d={`M16 ${height} Q12 ${height * 0.8} 14 ${height * 0.5} Q17 ${height * 0.3} 15 0`}
          stroke="currentColor" 
          strokeWidth="2.5" 
          fill="none"
          opacity="0.7"
        />
        <path 
          d={`M24 ${height} Q26 ${height * 0.6} 23 ${height * 0.3} Q20 ${height * 0.1} 22 0`}
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          opacity="0.6"
        />
      </g>
    ),
    'java-fern': (
      <g className={className}>
        <path 
          d={`M20 ${height} Q18 ${height * 0.8} 20 ${height * 0.6} Q22 ${height * 0.4} 20 ${height * 0.2} Q18 ${height * 0.1} 20 0`}
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none"
          opacity="0.8"
        />
        {/* Fern fronds */}
        {Array.from({length: Math.floor(height / 20)}, (_, i) => (
          <g key={i}>
            <path 
              d={`M20 ${height - i * 20} L${15 + Math.sin(i) * 3} ${height - i * 20 - 5} L${25 - Math.sin(i) * 3} ${height - i * 20 - 5}`}
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
              opacity="0.7"
            />
          </g>
        ))}
      </g>
    ),
    'anubias': (
      <g className={className}>
        <path 
          d={`M20 ${height} Q20 ${height * 0.7} 20 ${height * 0.5}`}
          stroke="currentColor" 
          strokeWidth="3" 
          fill="none"
          opacity="0.8"
        />
        {/* Large broad leaves */}
        <ellipse cx="20" cy={height * 0.3} rx="12" ry="8" fill="currentColor" opacity="0.6" />
        <ellipse cx="15" cy={height * 0.5} rx="10" ry="6" fill="currentColor" opacity="0.5" />
        <ellipse cx="25" cy={height * 0.4} rx="8" ry="5" fill="currentColor" opacity="0.4" />
      </g>
    ),
    'amazon-sword': (
      <g className={className}>
        <path 
          d={`M20 ${height} Q20 ${height * 0.8} 20 ${height * 0.6} Q20 ${height * 0.4} 20 0`}
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
          opacity="0.8"
        />
        {/* Sword-like leaves */}
        {Array.from({length: 6}, (_, i) => (
          <path 
            key={i}
            d={`M20 ${height * 0.7} Q${15 + i * 2} ${height * 0.4} ${12 + i * 3} ${height * 0.1 - i * 5}`}
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
            opacity={0.7 - i * 0.1}
          />
        ))}
      </g>
    ),
    'cabomba': (
      <g className={className}>
        <path 
          d={`M20 ${height} Q20 ${height * 0.8} 20 0`}
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.8"
        />
        {/* Feathery leaves */}
        {Array.from({length: Math.floor(height / 15)}, (_, i) => (
          <g key={i}>
            {Array.from({length: 8}, (_, j) => (
              <path 
                key={j}
                d={`M20 ${height - i * 15} L${20 + (j - 4) * 2} ${height - i * 15 - 6}`}
                stroke="currentColor" 
                strokeWidth="0.5" 
                opacity="0.6"
              />
            ))}
          </g>
        ))}
      </g>
    )
  };

  return (
    <svg width="40" height={height + 10} viewBox={`0 0 40 ${height + 10}`}>
      {plantPaths[type as keyof typeof plantPaths]}
    </svg>
  );
};

const AquaticPlant: React.FC<PlantProps> = ({ 
  type, 
  height = 100, 
  position = { x: 0, y: 0 },
  swayIntensity = 3
}) => {
  const colors = {
    'vallisneria': '#44FF44',
    'java-fern': '#00FF88',
    'anubias': '#33AA33', 
    'amazon-sword': '#55FF55',
    'cabomba': '#66DD66'
  };

  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{
        left: position.x,
        bottom: position.y,
        color: colors[type],
        transformOrigin: 'bottom center',
      }}
      animate={{
        rotate: [-swayIntensity, swayIntensity, -swayIntensity],
        scaleX: [1, 1.05, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    >
      <PlantSVG type={type} height={height} className="drop-shadow-md" />
    </motion.div>
  );
};

export default AquaticPlant;