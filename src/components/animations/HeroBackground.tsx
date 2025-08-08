'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Underwater gradient effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(0, 100, 200, 0.1) 0%,
              rgba(0, 150, 255, 0.15) 25%,
              rgba(0, 200, 255, 0.2) 50%,
              rgba(0, 150, 200, 0.25) 75%,
              rgba(0, 100, 150, 0.3) 100%
            )
          `
        }}
        animate={{
          background: [
            `linear-gradient(180deg, 
              rgba(0, 100, 200, 0.1) 0%,
              rgba(0, 150, 255, 0.15) 25%,
              rgba(0, 200, 255, 0.2) 50%,
              rgba(0, 150, 200, 0.25) 75%,
              rgba(0, 100, 150, 0.3) 100%
            )`,
            `linear-gradient(180deg, 
              rgba(0, 120, 220, 0.12) 0%,
              rgba(0, 170, 275, 0.17) 25%,
              rgba(0, 220, 275, 0.22) 50%,
              rgba(0, 170, 220, 0.27) 75%,
              rgba(0, 120, 170, 0.32) 100%
            )`,
            `linear-gradient(180deg, 
              rgba(0, 100, 200, 0.1) 0%,
              rgba(0, 150, 255, 0.15) 25%,
              rgba(0, 200, 255, 0.2) 50%,
              rgba(0, 150, 200, 0.25) 75%,
              rgba(0, 100, 150, 0.3) 100%
            )`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Caustic light patterns */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 300px 150px at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 250px 120px at 70% 40%, rgba(135, 206, 250, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 200px 100px at 50% 70%, rgba(173, 216, 230, 0.06) 0%, transparent 60%)
          `
        }}
        animate={{
          backgroundPosition: [
            '30% 20%, 70% 40%, 50% 70%',
            '35% 25%, 75% 45%, 55% 75%',
            '25% 15%, 65% 35%, 45% 65%',
            '30% 20%, 70% 40%, 50% 70%'
          ],
          opacity: [0.5, 0.8, 0.6, 0.5]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Placeholder for hero aquarium image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-full h-full bg-gradient-to-br from-blue-900/20 to-teal-900/20 rounded-lg border border-cyan-500/20 backdrop-blur-sm"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <motion.div
                className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-16 h-16 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5L15 11.5C15.8 11.8 16.5 12.4 17 13.1L21 9ZM3 9L7 13.1C7.5 12.4 8.2 11.8 9 11.5V7.5L3 7V9ZM9 12C7.9 12 7 12.9 7 14S7.9 16 9 16 11 15.1 11 14 10.1 12 9 12ZM15 12C13.9 12 13 12.9 13 14S13.9 16 15 16 17 15.1 17 14 16.1 12 15 12ZM12 10.5C11.2 10.5 10.5 11.2 10.5 12S11.2 13.5 12 13.5 13.5 12.8 13.5 12 12.8 10.5 12 10.5Z"/>
                </svg>
              </motion.div>
              <p className="text-cyan-300/80 text-sm">Hero Aquarium Background</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBackground;