'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: 'plant' | 'fish' | 'calculator' | 'mobile' | 'ai';
  className?: string;
  delay?: number;
}

const FeatureIcons = {
  plant: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,15.5C2,15.5 2,16.83 2,16.83C2,16.83 2.93,15.09 7,13.5C8,13 8.5,12.5 8.5,11.5C8.5,10.5 7.5,10 7,9.5C10,8.5 17,8 17,8Z"/>
    </svg>
  ),
  fish: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2ZM21,9V7L15,7.5V9.5C15.8,9.8 16.5,10.4 17,11.1L21,9ZM3,9L7,11.1C7.5,10.4 8.2,9.8 9,9.5V7.5L3,7V9ZM9,12C7.9,12 7,12.9 7,14S7.9,16 9,16 11,15.1 11,14 10.1,12 9,12ZM15,12C13.9,12 13,12.9 13,14S13.9,16 15,16 17,15.1 17,14 16.1,12 15,12Z"/>
    </svg>
  ),
  calculator: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z"/>
    </svg>
  ),
  mobile: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.11 5.89,23 7,23H17C18.11,23 19,22.11 19,21V3C19,1.89 18.11,1 17,1Z"/>
    </svg>
  ),
  ai: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2ZM7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13ZM16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
    </svg>
  )
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon = 'plant', 
  className = '',
  delay = 0 
}) => {
  return (
    <motion.div
      className={`glass-deep-water p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.6, -0.05, 0.01, 0.99]
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 255, 255, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Aquatic Plant Icon Placeholder */}
      <motion.div
        className="mb-4 text-emerald-400"
        animate={{ 
          rotateY: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {FeatureIcons[icon]}
      </motion.div>

      {/* Floating particles around the card */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-cyan-200/80 text-sm leading-relaxed">{description}</p>

      {/* Underwater effect indicator */}
      <motion.div
        className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-500/30 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

interface FeatureCardsGridProps {
  features: Array<{
    title: string;
    description: string;
    icon?: 'plant' | 'fish' | 'calculator' | 'mobile' | 'ai';
  }>;
  className?: string;
}

const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({ features, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          delay={index * 0.2}
        />
      ))}
    </div>
  );
};

export { FeatureCard, FeatureCardsGrid };
export default FeatureCardsGrid;