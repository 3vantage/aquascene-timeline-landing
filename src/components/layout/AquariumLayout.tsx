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

  // Convert scroll depth to aquarium depth sections
  const getAquariumDepth = (depth: number) => {
    if (depth < 20) return 0;  // Surface - bright blue
    if (depth < 40) return 20; // Shallow - medium blue  
    if (depth < 60) return 40; // Mid-water - deeper blue
    if (depth < 80) return 60; // Deep - dark blue
    return 80; // Abyss - deepest blue
  };

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Aquarium Background */}
      <AquariumBackground 
        depth={getAquariumDepth(scrollDepth)} 
        className="z-0" 
      />
      
      {/* Content with backdrop for readability */}
      <div className="relative z-10">
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative backdrop-blur-sm"
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255, 255, 255, ${0.05 - scrollDepth * 0.0003}) 0%,
                rgba(255, 255, 255, ${0.02 - scrollDepth * 0.0001}) 100%
              )`
            }}
          >
            {child}
          </motion.div>
        ))}
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