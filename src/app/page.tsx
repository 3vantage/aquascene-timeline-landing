'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getImagePath } from '@/lib/utils';
import { OptimizedImage, HeroImage, GalleryImage } from '@/components/ui/OptimizedImage';
import AquaticScene from '@/components/animations/AquaticScene';
import UnderwaterLightRays from '@/components/animations/UnderwaterLightRays';
import ParallaxContainer from '@/components/animations/ParallaxContainer';
import ScrollReveal from '@/components/animations/ScrollReveal';
import WaterRippleEffect from '@/components/animations/WaterRippleEffect';
import Lightbox from '@/components/ui/Lightbox';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { buttonHover, buttonTap } from '@/lib/animation-config';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, -500]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Gallery images with detailed information - featuring real aquascaping artistry
  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Dutch Style Planted Aquarium',
      caption: 'Dutch Masterpiece',
      description: 'A stunning example of Dutch-style aquascaping with terraced plant arrangements, vibrant colors, and perfect symmetry showcasing the art of underwater gardening.'
    },
    {
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Iwagumi Rock Formation Aquascape',
      caption: 'Zen Minimalism',
      description: 'Classic Iwagumi style featuring carefully positioned stones and carpet plants, embodying the Japanese philosophy of simplicity and natural harmony.'
    },
    {
      src: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Nature Aquarium Takashi Amano Style',
      caption: 'Natural Wonder',
      description: 'Takashi Amano inspired nature aquarium showcasing the beauty of recreating natural landscapes underwater with driftwood, stones, and lush vegetation.'
    },
    {
      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Biotope Aquarium Ecosystem',
      caption: 'Living Ecosystem',
      description: 'Authentic biotope aquarium replicating a specific natural habitat with native plants, substrate, and water parameters from the original ecosystem.'
    },
    {
      src: 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Paludarium Setup',
      caption: 'Land Meets Water',
      description: 'Spectacular paludarium combining terrestrial and aquatic elements, featuring both submerged aquatic plants and emerged tropical vegetation.'
    },
    {
      src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Jungle Style Dense Planted Tank',
      caption: 'Tropical Jungle',
      description: 'Dense jungle-style aquascape with wild, untamed plant growth creating a lush underwater forest teeming with natural beauty and life.'
    },
    {
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Minimalist Zen Aquascape',
      caption: 'Peaceful Serenity',
      description: 'Minimalist zen aquascape featuring clean lines, negative space, and carefully chosen elements to create a sense of tranquility and meditation.'
    },
    {
      src: 'https://images.unsplash.com/photo-1586997721684-2f5b882583b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=90',
      alt: 'Competition Winning Show Tank',
      caption: 'Award Winner',
      description: 'Competition-winning show tank displaying masterful aquascaping techniques with perfect plant health, stunning composition, and flawless execution.'
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const smoothScrollTo = (selector: string) => {
    const element = document.querySelector(selector);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-600 flex items-center justify-center">
        <div className="text-center">
          <LoadingAnimation type="bubbles" size="large" className="mb-8" />
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Aquascene
          </motion.h1>
          <motion.p 
            className="text-cyan-200 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Creating underwater masterpieces...
          </motion.p>
        </div>
        <AquaticScene intensity="subtle" className="opacity-30" />
      </div>
    );
  }

  return (
    <main className="bg-white relative">
      {/* Aquatic Scene - Global animations */}
      <AquaticScene intensity="dramatic" className="z-0" />

      {/* Hero Section - Full screen with stunning effects */}
      <motion.section 
        className="relative h-screen overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Hero Background with Parallax */}
        <ParallaxContainer speed={0.3} className="absolute inset-0">
          <div className="absolute inset-0">
            <HeroImage
              src="hero-aquascaped-tank-kazuend"
              alt="Professional Aquascape"
            />
          </div>
          {/* Underwater Light Rays */}
          <UnderwaterLightRays intensity="dramatic" />
        </ParallaxContainer>

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        
        {/* Animated content */}
        <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl">
            <ScrollReveal direction="up" delay={0.2}>
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Master the Art of
                <motion.span 
                  className="block text-cyan-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Aquascaping
                </motion.span>
              </motion.h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.6}>
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Join Bulgaria's premier aquascaping platform. Design, learn, and create stunning underwater landscapes that bring nature into your home.
              </motion.p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={1}>
              <div className="flex flex-col sm:flex-row gap-4">
                <WaterRippleEffect 
                  className="inline-block"
                  onClick={() => smoothScrollTo('section:has(form)')}
                >
                  <motion.button 
                    className="px-8 py-4 bg-cyan-500 text-white font-semibold text-lg relative overflow-hidden group"
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)',
                      background: 'linear-gradient(45deg, #06b6d4, #0891b2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="relative z-10">START YOUR JOURNEY</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </WaterRippleEffect>
                
                <WaterRippleEffect 
                  className="inline-block"
                  onClick={() => smoothScrollTo('[data-gallery="community-showcase"]')}
                >
                  <motion.button 
                    className="px-8 py-4 border-2 border-white text-white font-semibold text-lg relative overflow-hidden group"
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: '#06b6d4',
                      color: '#06b6d4',
                      boxShadow: '0 20px 40px rgba(255, 255, 255, 0.2)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="relative z-10">VIEW GALLERY</span>
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </WaterRippleEffect>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white cursor-pointer"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => smoothScrollTo('[data-section="styles"]')}
        >
          <motion.div
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Aquascaping Styles Grid - Enhanced with animations */}
      <section className="py-24 px-8 md:px-16 lg:px-24 relative" data-section="styles">
        <ParallaxContainer speed={0.1} className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                Explore Aquascaping Styles
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                From minimalist Iwagumi to lush Dutch styles, discover the perfect aesthetic for your aquarium
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Nature Style */}
            <ScrollReveal direction="up" delay={0.1}>
              <WaterRippleEffect className="group cursor-pointer h-full">
                <motion.div 
                  className="relative h-80 overflow-hidden bg-gray-100 rounded-lg"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={getImagePath('images/aquascaping/green-aquatic-plants-gabor.jpg')}
                    alt="Nature Style Aquascape"
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <motion.div 
                    className="absolute bottom-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold mb-2 text-white">Nature Style</h3>
                    <p className="text-gray-200">Recreate natural landscapes underwater</p>
                  </motion.div>
                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </WaterRippleEffect>
            </ScrollReveal>

            {/* Iwagumi Style */}
            <ScrollReveal direction="up" delay={0.2}>
              <WaterRippleEffect className="group cursor-pointer h-full">
                <motion.div 
                  className="relative h-80 overflow-hidden bg-gray-100 rounded-lg"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={getImagePath('images/aquascaping/iwagumi-style-aquascape.jpg')}
                    alt="Iwagumi Style"
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <motion.div 
                    className="absolute bottom-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold mb-2 text-white">Iwagumi Style</h3>
                    <p className="text-gray-200">Minimalist stone arrangements</p>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </WaterRippleEffect>
            </ScrollReveal>

            {/* Dutch Style */}
            <ScrollReveal direction="up" delay={0.3}>
              <WaterRippleEffect className="group cursor-pointer h-full">
                <motion.div 
                  className="relative h-80 overflow-hidden bg-gray-100 rounded-lg"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src={getImagePath('images/aquascaping/dutch-style-planted-tank.jpg')}
                    alt="Dutch Style"
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <motion.div 
                    className="absolute bottom-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold mb-2 text-white">Dutch Style</h3>
                    <p className="text-gray-200">Dense, colorful plant arrangements</p>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </WaterRippleEffect>
            </ScrollReveal>
          </div>
        </ParallaxContainer>
      </section>

      {/* Feature Section with Split Layout */}
      <section className="bg-gray-50">
        <div className="grid lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative h-96 lg:h-auto">
            <Image
              src={getImagePath('images/aquascaping/person-working-on-aquarium.jpg')}
              alt="Professional Aquascaper at Work"
              fill
              className="object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="py-16 px-8 md:px-16 lg:px-24 flex items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Professional Tools for Every Aquascaper
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From beginners to experts, our platform provides everything you need to create and maintain stunning aquascapes.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">3D Design Studio</strong>
                    <p className="text-gray-600">Visualize your aquascape before you build</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Plant Database</strong>
                    <p className="text-gray-600">600+ species with care guides</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900">Cost Calculator</strong>
                    <p className="text-gray-600">Budget your project accurately</p>
                  </div>
                </li>
              </ul>

              <button className="px-8 py-4 bg-black hover:bg-gray-800 text-white font-semibold transition-colors inline-flex items-center gap-2">
                EXPLORE FEATURES
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery - Enhanced with Lightbox */}
      <section className="py-24 px-8 md:px-16 lg:px-24 relative" data-gallery="community-showcase">
        <ParallaxContainer speed={0.2}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Community Showcase
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Get inspired by stunning aquascapes from our Bulgarian and Hungarian community
                </motion.p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <WaterRippleEffect 
                    className="relative h-64 group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => openLightbox(index)}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Hover overlay with water effect */}
                      <motion.div 
                        className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                      
                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <motion.h3 
                          className="text-white font-semibold text-sm mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ y: 20 }}
                          whileHover={{ y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {image.caption}
                        </motion.h3>
                      </div>
                      
                      {/* View button */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.button 
                          className="px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-900 font-semibold rounded-lg shadow-lg"
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 1)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          VIEW DETAILS
                        </motion.button>
                      </motion.div>

                      {/* Bubble effect on hover */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {[...Array(3)].map((_, bubbleIndex) => (
                          <motion.div
                            key={bubbleIndex}
                            className="absolute w-2 h-2 bg-white/40 rounded-full"
                            style={{
                              left: `${20 + bubbleIndex * 25}%`,
                              bottom: '20px',
                            }}
                            animate={{
                              y: [-5, -40],
                              opacity: [0.4, 0],
                              scale: [0.8, 1.2]
                            }}
                            transition={{
                              duration: 2,
                              delay: bubbleIndex * 0.3,
                              repeat: Infinity,
                              ease: 'easeOut'
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </WaterRippleEffect>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="up" delay={0.5}>
              <div className="text-center mt-12">
                <WaterRippleEffect className="inline-block">
                  <motion.button 
                    className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold transition-all relative overflow-hidden group"
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      backgroundColor: '#111827',
                      color: '#ffffff',
                      boxShadow: '0 20px 40px rgba(17, 24, 39, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="relative z-10">VIEW ALL SUBMISSIONS</span>
                    <motion.div
                      className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </WaterRippleEffect>
              </div>
            </ScrollReveal>
          </div>
        </ParallaxContainer>
      </section>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrevious={previousImage}
      />

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">2,487+</div>
              <div className="text-gray-400">Active Aquascapers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">15</div>
              <div className="text-gray-400">Partner Stores</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">600+</div>
              <div className="text-gray-400">Plant Species</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">89%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Essential Equipment & Materials
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access curated equipment recommendations from professional aquascapers. We partner with trusted suppliers across Bulgaria and Hungary.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Hardscape</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Dragon Stone</li>
                    <li>• Seiryu Stone</li>
                    <li>• Manzanita Wood</li>
                    <li>• ADA Aqua Soil</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Equipment</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• CO2 Systems</li>
                    <li>• LED Lighting</li>
                    <li>• Filtration</li>
                    <li>• Maintenance Tools</li>
                  </ul>
                </div>
              </div>

              <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition-colors">
                BROWSE EQUIPMENT GUIDE
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48">
                  <Image
                    src={getImagePath('images/aquascaping/aquascaping-hardscape-stones.jpg')}
                    alt="Hardscape Materials"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64">
                  <Image
                    src={getImagePath('images/aquascaping/aquarium-tools-equipment.jpg')}
                    alt="Aquascaping Tools"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64">
                  <Image
                    src={getImagePath('images/aquascaping/aquarium-plants-detail.jpg')}
                    alt="Aquatic Plants"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48">
                  <Image
                    src={getImagePath('images/aquascaping/aquarium-maintenance-setup.jpg')}
                    alt="Maintenance Setup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-96 flex items-center justify-center">
        <Image
          src={getImagePath('images/aquascaping/underwater-view-karl.jpg')}
          alt="Join Aquascene"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Aquascaping Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join Bulgaria's fastest-growing aquascaping community and transform your vision into reality
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 text-lg border-2 border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:border-cyan-400"
            />
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold whitespace-nowrap transition-colors">
              GET STARTED
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Aquascene</h3>
            <p className="text-sm">
              Bulgaria's premier platform for aquascaping enthusiasts
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Getting Started</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plant Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Troubleshooting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contests</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>© 2024 Aquascene. All rights reserved. | Sofia, Bulgaria</p>
        </div>
      </footer>
    </main>
  );
}