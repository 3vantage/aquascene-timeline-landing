'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import AquariumBuilderPreview from '@/components/sections/AquariumBuilderPreview';
import { staggerContainer, staggerItem } from '@/lib/animation-config';
import { ArrowRightIcon, SparklesIcon, PlayIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [aquascaperCount, setAquascaperCount] = useState(2487);

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const startDemo = () => {
    setIsDemoActive(true);
  };

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAquascaperCount(prev => prev + Math.floor(Math.random() * 3));
    }, 45000); // Update every 45 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-spacing">
      {/* Professional natural background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent-mint/10" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-accent-light/5 to-primary-dark/10" />
        
        {/* Natural caustic effects */}
        <motion.div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #52B2B2 2px, transparent 2px), radial-gradient(circle at 80% 20%, #2D5A3D 2px, transparent 2px), radial-gradient(circle at 60% 80%, #E76F51 2px, transparent 2px)',
            backgroundSize: '40px 40px, 60px 60px, 80px 80px'
          }}
          animate={{
            backgroundPosition: ['0px 0px, 0px 0px, 0px 0px', '40px 40px, -60px 60px, 80px -80px']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      {/* Dynamic light rays with caustic patterns */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-b from-accent-mint/20 via-accent-light/10 to-transparent"
            style={{
              width: i % 2 === 0 ? '3px' : '1px',
              height: '100vh',
              left: `${15 + i * 10}%`,
              transformOrigin: 'top center',
              filter: 'blur(1px)'
            }}
            animate={{
              rotate: [0, 3, -2, 4, 0],
              opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
              scaleX: [1, 1.5, 0.8, 1.2, 1]
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto container-padding">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                variants={staggerItem}
                className="flex items-center justify-center lg:justify-start mb-8"
              >
                <div className="glass-underwater px-4 sm:px-6 py-3 sm:py-4 rounded-full flex items-center gap-3 sm:gap-4 border border-accent-light/30">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <CubeTransparentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-mint" />
                  </motion.div>
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    <span className="hidden sm:inline">EARLY ACCESS • </span>3D AQUASCAPE DESIGNER
                  </span>
                  <motion.div 
                    className="w-2 h-2 bg-accent-mint rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <motion.h1
                variants={staggerItem}
                className="hero-text-primary heading-display text-white mb-6 sm:mb-8 text-balance"
              >
                <span className="block text-balance">
                  <span className="bg-gradient-to-r from-primary via-accent-mint to-secondary bg-clip-text text-transparent">
                    Design Your
                  </span>
                  <br />
                  <span className="text-white font-light">Dream</span>{' '}
                  <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent relative">
                    Aquascape
                    <motion.div
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-accent to-accent-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                    />
                  </span>
                </span>
              </motion.h1>

              <motion.p
                variants={staggerItem}
                className="text-lead text-neutral-50/90 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 text-pretty"
              >
                Plan Before You Plant <span className="hidden sm:inline">• Save Money, Avoid Mistakes</span> • Join {aquascaperCount}+ <span className="hidden sm:inline">Bulgarian & Hungarian </span>Aquascapers
              </motion.p>

              <motion.div
                variants={staggerItem}
                className="mb-10 sm:mb-12 max-w-xl mx-auto lg:mx-0"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-accent-mint">
                    <div className="w-2 h-2 bg-accent-mint rounded-full flex-shrink-0" />
                    <span>3D Visualization</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-accent-light">
                    <div className="w-2 h-2 bg-accent-light rounded-full flex-shrink-0" />
                    <span>Cost Calculator</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-secondary-light">
                    <div className="w-2 h-2 bg-secondary-light rounded-full flex-shrink-0" />
                    <span>Expert Community</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
              >
                <Button
                  size="xl"
                  onClick={scrollToWaitlist}
                  rightIcon={<ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="button-premium bg-gradient-to-r from-accent to-accent-light hover:from-accent/90 hover:to-accent-light/90 text-white border-0 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation"
                >
                  <span className="hidden sm:inline">Start Designing Now</span>
                  <span className="sm:hidden">Start Designing</span>
                </Button>
                
                <Button
                  variant="secondary"
                  size="xl"
                  onClick={startDemo}
                  className="premium-hover glass-underwater border-accent-light/50 text-white hover:bg-accent-light/20 hover:border-accent-light/70 px-8 sm:px-10 py-4 sm:py-5 min-h-[56px] touch-manipulation"
                  rightIcon={<PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  <span className="hidden sm:inline">Watch 3D Demo</span>
                  <span className="sm:hidden">3D Demo</span>
                </Button>
              </motion.div>

              {/* Enhanced trust indicator with live data */}
              <motion.div
                variants={staggerItem}
                className="mt-12 sm:mt-16 space-y-4 sm:space-y-6"
              >
                <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <div className="flex -space-x-2 sm:-space-x-3">
                    {[
                      { bg: 'from-emerald-500 to-green-600', flag: '🇧🇬' },
                      { bg: 'from-cyan-500 to-blue-600', flag: '🇭🇺' },
                      { bg: 'from-blue-500 to-indigo-600', flag: '🇷🇴' },
                      { bg: 'from-teal-500 to-cyan-600', flag: '🇸🇮' },
                      { bg: 'from-green-500 to-emerald-600', flag: '🇦🇹' }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${item.bg} border-2 sm:border-3 border-white/60 flex items-center justify-center text-sm sm:text-lg shadow-lg`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        {item.flag}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-accent-light text-base sm:text-lg font-semibold">
                      <motion.span
                        key={aquascaperCount}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {aquascaperCount.toLocaleString()}
                      </motion.span>+ <span className="hidden xs:inline">Aquascapers </span>Waiting
                    </div>
                    <div className="text-neutral-100/70 text-xs sm:text-sm">
                      <span className="hidden sm:inline">From Bulgaria, Hungary & </span>Central Europe
                    </div>
                  </div>
                </div>
                
                {/* Recent signups indicator */}
                <motion.div 
                  className="flex items-center justify-center lg:justify-start gap-2 text-accent-mint text-xs sm:text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-accent-mint rounded-full flex-shrink-0"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span><span className="hidden sm:inline">3 aquascapers joined in the last hour</span><span className="sm:hidden">3 joined recently</span></span>
                </motion.div>
              </motion.div>
            </div>

            {/* Revolutionary 3D Aquascape Preview */}
            <motion.div
              variants={staggerItem}
              className="relative mt-12 lg:mt-0"
            >
              <AnimatePresence mode="wait">
                {!isDemoActive ? (
                  <motion.div
                    key="preview"
                    className="relative aspect-[4/3] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {/* 3D Aquarium Container */}
                    <motion.div
                      className="card-hover relative h-full glass-deep-water rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden border border-accent-light/20"
                      animate={{
                        boxShadow: [
                          '0 25px 50px rgba(231, 111, 81, 0.2)',
                          '0 35px 70px rgba(82, 178, 178, 0.25)',
                          '0 25px 50px rgba(231, 111, 81, 0.2)',
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {/* Enhanced aquascape scene */}
                      <div className="relative h-full">
                        {/* Substrate layers */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-800/60 via-stone-700/40 to-transparent rounded-b-xl"
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        
                        {/* Rocks/Hardscape */}
                        <motion.div
                          className="absolute bottom-20 left-12 w-16 h-12 bg-gradient-to-br from-stone-600 to-stone-800 rounded-lg opacity-70"
                          animate={{ 
                            rotateY: [0, 5, 0],
                            rotateX: [0, 2, 0]
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        
                        <motion.div
                          className="absolute bottom-20 right-20 w-20 h-8 bg-gradient-to-br from-stone-500 to-stone-700 rounded-lg opacity-60"
                          animate={{ 
                            rotateY: [0, -3, 0],
                            rotateX: [0, 1, 0]
                          }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        />
                        
                        {/* Advanced plant system */}
                        <motion.div
                          className="absolute bottom-20 left-20 w-6 h-32 bg-gradient-to-t from-primary-dark via-primary to-accent-mint rounded-t-full shadow-lg"
                          animate={{
                            rotate: [0, 3, -2, 4, 0],
                            scaleY: [1, 1.15, 0.95, 1.1, 1],
                            scaleX: [1, 0.9, 1.1, 0.95, 1]
                          }}
                          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        
                        <motion.div
                          className="absolute bottom-20 center-8 w-4 h-28 bg-gradient-to-t from-primary-dark via-primary to-accent-mint rounded-t-full shadow-md"
                          animate={{
                            rotate: [0, -2, 3, -1, 0],
                            scaleY: [1, 0.9, 1.2, 0.85, 1]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        />
                        
                        <motion.div
                          className="absolute bottom-20 right-16 w-5 h-24 bg-gradient-to-t from-accent-wood via-accent to-accent-light rounded-t-full shadow-md"
                          animate={{
                            rotate: [0, 2, -3, 1, 0],
                            scaleY: [1, 1.1, 0.9, 1.05, 1]
                          }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        />
                        
                        {/* Realistic fish school */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-8 h-4 ${i % 2 === 0 ? 'bg-accent' : 'bg-accent-mint'} rounded-full shadow-sm`}
                            animate={{
                              x: [30 + i * 20, 280 - i * 15, 150 + i * 10, 320 - i * 25, 30 + i * 20],
                              y: [60 + i * 8, 90 - i * 5, 130 + i * 3, 70 - i * 8, 60 + i * 8],
                              rotate: [0, 25, -15, 30, 0]
                            }}
                            transition={{ 
                              duration: 18 + i * 2, 
                              repeat: Infinity, 
                              ease: 'easeInOut',
                              delay: i * 0.8
                            }}
                          >
                            <div className={`absolute right-0 top-1/2 w-3 h-3 ${i % 2 === 0 ? 'bg-accent/80' : 'bg-accent-mint/80'} transform -translate-y-1/2 rounded-l-full`} />
                          </motion.div>
                        ))}
                        
                        {/* Bubble effects */}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <motion.div
                            key={`bubble-${i}`}
                            className="absolute w-3 h-3 bg-white/30 rounded-full"
                            style={{
                              left: `${25 + i * 20}%`,
                              bottom: '20px'
                            }}
                            animate={{
                              y: [-20, -300, -20],
                              x: [0, 10, -5, 15, 0],
                              scale: [0.5, 1, 0.3, 0.8, 0.5],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 8 + i,
                              repeat: Infinity,
                              ease: 'easeOut',
                              delay: i * 2
                            }}
                          />
                        ))}
                        
                        {/* Dynamic water surface */}
                        <motion.div
                          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-accent-mint/30 via-white/40 via-accent-mint/30 to-transparent rounded-t-xl"
                          animate={{
                            x: ['-100%', '200%'],
                            scaleX: [1, 1.5, 0.8, 1.2, 1]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    </motion.div>

                    {/* Advanced UI indicators */}
                    <motion.div
                      className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 glass-underwater p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-accent-light/40"
                      animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                        <CubeTransparentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-light" />
                        <span className="hidden xs:inline">3D View</span>
                        <span className="xs:hidden">3D</span>
                      </div>
                      <div className="text-accent-light text-xs hidden sm:block">Real-time</div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 glass-underwater p-2 sm:p-4 rounded-xl sm:rounded-2xl border border-accent-mint/40"
                      animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2">
                        <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-mint" />
                        <span className="hidden xs:inline">Cost: </span>$127
                      </div>
                      <div className="text-accent-mint text-xs hidden sm:block">Auto-calculated</div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute top-1/2 -right-6 sm:-right-8 glass-underwater p-2 sm:p-3 rounded-lg sm:rounded-xl border border-accent/40"
                      animate={{ x: [0, 5, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    >
                      <div className="text-white text-xs font-medium"><span className="hidden xs:inline">CO₂: </span>2.5ppm</div>
                      <div className="text-accent-light text-xs hidden sm:block">Optimal</div>
                    </motion.div>

                    {/* Interactive demo overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl sm:rounded-2xl flex items-end justify-center p-3 sm:p-6 cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                      onClick={startDemo}
                    >
                      <motion.button
                        className="glass-underwater px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 border border-white/30 text-white hover:border-accent-light/70 transition-all min-h-[44px] touch-manipulation"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold text-sm sm:text-base"><span className="hidden sm:inline">Try Interactive Demo</span><span className="sm:hidden">Demo</span></span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  // Interactive demo view would go here
                  <motion.div
                    key="demo"
                    className="relative aspect-[4/3] max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto glass-deep-water rounded-xl sm:rounded-2xl p-4 sm:p-8 flex items-center justify-center border border-accent-light/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-accent-light border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-base sm:text-lg font-semibold mb-2">Loading 3D Aquascape Builder...</p>
                      <p className="text-accent-light text-xs sm:text-sm px-2 sm:px-0">Full interactive demo coming with early access!</p>
                      <button 
                        onClick={() => setIsDemoActive(false)}
                        className="mt-4 text-accent-light hover:text-accent-mint text-sm underline"
                      >
                        Back to preview
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="glass-underwater p-2 sm:p-3 rounded-full border border-accent-light/30">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>

      {/* Interactive Demo Modal */}
      <AnimatePresence>
        {isDemoActive && (
          <AquariumBuilderPreview onClose={() => setIsDemoActive(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

export default HeroSection;