'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AquariumBackground from '@/components/animations/AquariumBackground';

interface AquariumLayoutProps {
  children: React.ReactNode;
}

const AquariumLayout: React.FC<AquariumLayoutProps> = ({ children }) => {
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.min(100, (scrollTop / documentHeight) * 100);
      setScrollDepth(depth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Convert scroll depth to aquarium depth sections with smooth transitions
  const getAquariumDepth = (depth: number) => {
    return Math.min(100, depth); // Use actual scroll percentage for smooth transitions
  };

  // Dynamic text contrast based on aquarium zones
  const getZoneStyles = (depth: number) => {
    if (depth < 12) {
      return {
        textColor: 'rgba(25, 25, 112, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(25, 25, 112, 0.3)'
      };
    } else if (depth < 25) {
      return {
        textColor: 'rgba(255, 255, 255, 0.95)',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderColor: 'rgba(255, 255, 255, 0.25)'
      };
    } else {
      return {
        textColor: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      };
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Aquarium Background */}
      <AquariumBackground 
        depth={getAquariumDepth(scrollDepth)} 
        className="z-0" 
      />
      
      {/* Content with dynamic contrast management */}
      <div className="relative z-10">
        {React.Children.map(children, (child, index) => {
          const sectionDepth = (scrollDepth + index * 20) % 100; // Each section has slightly different depth
          const zoneStyles = getZoneStyles(sectionDepth);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
              style={{
                background: `linear-gradient(135deg, 
                  ${zoneStyles.backgroundColor} 0%, 
                  ${zoneStyles.backgroundColor.replace(/[\d.]+\)/, (match) => {
                    const opacity = parseFloat(match.slice(0, -1));
                    return `${opacity * 0.7})`;
                  })} 100%
                )`,
                backdropFilter: 'blur(12px)',
                borderTop: `1px solid ${zoneStyles.borderColor}`,
                borderBottom: `1px solid ${zoneStyles.borderColor}`,
                color: zoneStyles.textColor
              }}
            >
              {/* Dynamic content styling provider */}
              <div 
                className="aquarium-content"
                style={{
                  '--dynamic-text-color': zoneStyles.textColor,
                  '--dynamic-bg-color': zoneStyles.backgroundColor,
                  '--dynamic-border-color': zoneStyles.borderColor
                } as React.CSSProperties}
              >
                {child}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Depth indicator for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-black/70 text-white p-2 rounded text-xs">
          Scroll: {Math.round(scrollDepth)}% | Aquarium Depth: {getAquariumDepth(scrollDepth)}%
        </div>
      )}
    </div>
  );
};

export default AquariumLayout;