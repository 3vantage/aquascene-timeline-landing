'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { staggerContainer, staggerItem } from '@/lib/animation-config';
import { FeatureCardsGrid } from '@/components/animations/FeatureCards';
import { 
  CubeIcon, 
  CalculatorIcon, 
  UsersIcon,
  SparklesIcon,
  BeakerIcon,
  LightBulbIcon,
  BuildingStorefrontIcon,
  TagIcon,
  UserGroupIcon as HandshakeIcon
} from '@heroicons/react/24/outline';

// Define interface for feature objects
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  benefit: string;
  color: string;
  delay: number;
  isPartnership?: boolean; // Optional partnership flag
}

const FeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Show Green Aqua partnership feature for all users
  const isHungarian = true;

  const baseFeatures: Feature[] = [
    {
      icon: CubeIcon,
      title: '3D Reality Preview',
      description: 'See your exact tank with real plant growth patterns. Know if plants will thrive in your specific conditions.',
      benefit: 'Save 60% on plant costs',
      color: 'from-cyan-500 to-emerald-500',
      delay: 0
    },
    {
      icon: CalculatorIcon,
      title: 'Smart Cost Calculator',
      description: 'Get precise pricing from Bulgarian and Hungarian suppliers. No more guessing or overspending.',
      benefit: 'Plan your exact budget',
      color: 'from-emerald-500 to-green-500',
      delay: 0.2
    },
    {
      icon: UsersIcon,
      title: 'Regional Expert Network',
      description: 'Connect with top aquascapers in Sofia, Budapest, and across Central Europe. Get local advice that works.',
      benefit: 'Learn from the best nearby',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.4
    }
  ];

  // Add Green Aqua feature for Hungarian users
  const features: Feature[] = isHungarian ? [
    ...baseFeatures,
    {
      icon: HandshakeIcon,
      title: 'Green Aqua Partnership',
      description: 'Direct integration with Europe\'s leading aquascaping store. Get exclusive discounts and priority access to new plants.',
      benefit: '10% discount for members',
      color: 'from-orange-500 to-red-500',
      delay: 0.6,
      isPartnership: true
    }
  ] : baseFeatures;
  
  // Convert features for FeatureCardsGrid
  const featureCardsData = features.map(feature => ({
    title: feature.title,
    description: feature.description,
    icon: feature.title.includes('3D') ? 'plant' as const : 
          feature.title.includes('Calculator') ? 'calculator' as const :
          feature.title.includes('Community') ? 'fish' as const :
          feature.title.includes('Partnership') ? 'fish' as const :
          'ai' as const
  }));

  const floatingIcons = [
    { icon: SparklesIcon, x: '10%', y: '20%', delay: 0 },
    { icon: BeakerIcon, x: '85%', y: '15%', delay: 2 },
    { icon: LightBulbIcon, x: '15%', y: '80%', delay: 4 },
    { icon: CubeIcon, x: '90%', y: '75%', delay: 1.5 },
  ];

  return (
    <section className="relative section-spacing overflow-hidden section-gap">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent" />
      
      {/* Floating background icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute w-8 h-8 text-emerald-500/10"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay
          }}
        >
          <item.icon className="w-full h-full" />
        </motion.div>
      ))}

      <div className="container mx-auto container-padding" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="max-w-7xl mx-auto"
        >
          {/* Enhanced section header */}
          <motion.div
            variants={staggerItem}
            className="text-center mb-20 lg:mb-24"
          >
            <motion.div
              className="inline-flex items-center gap-2 glass-underwater px-6 py-3 rounded-full mb-6 border border-cyan-400/30"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <SparklesIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white tracking-wide">WHY CHOOSE US</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </motion.div>
            
            <h2 className="heading-h2 text-white mb-8 text-balance">
              Stop Wasting Money on Failed Aquascapes
            </h2>
            
            <p className="text-lead text-cyan-100/80 max-w-3xl mx-auto text-pretty">
              See exactly what works before you spend a single lev or forint
            </p>
          </motion.div>

          {/* Enhanced features grid with new FeatureCards */}
          <motion.div variants={staggerItem}>
            <FeatureCardsGrid 
              features={featureCardsData}
              className="gap-8 lg:gap-10"
            />
          </motion.div>

          {/* Regional partnership showcase for Hungarian users */}
          {isHungarian && (
            <motion.div
              variants={staggerItem}
              className="mt-16 lg:mt-20"
            >
              <div className="glass-underwater p-8 rounded-2xl border border-orange-400/30 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="text-3xl">🤝</span>
                    <h3 className="text-2xl font-bold text-white">Official Green Aqua Partnership</h3>
                    <span className="text-3xl">🇭🇺</span>
                  </div>
                  <p className="text-orange-200 text-lg">
                    Exclusive benefits for Hungarian aquascapers through Europe's leading aquascaping store
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-400/30">
                    <TagIcon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold mb-2">15% Discount</h4>
                    <p className="text-orange-200 text-sm">On your first Green Aqua order</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-400/30">
                    <BuildingStorefrontIcon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold mb-2">Priority Access</h4>
                    <p className="text-orange-200 text-sm">To new plants and products</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-400/30">
                    <UsersIcon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold mb-2">Expert Support</h4>
                    <p className="text-orange-200 text-sm">Direct line to Green Aqua team</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced bottom CTA section */}
          <motion.div
            variants={staggerItem}
            className="text-center mt-20 lg:mt-24"
          >
            <div className="premium-hover glass-underwater p-10 rounded-3xl max-w-4xl mx-auto border border-cyan-400/30">
              <h3 className="heading-h3 text-white mb-6">
                Ready to Stop Wasting Money on Failed Aquascapes?
              </h3>
              <p className="text-lead text-cyan-100/80 mb-8">
                Join 2,500+ smart aquascapers who design with confidence and save 60% on plant costs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  className="button-premium inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const waitlistSection = document.getElementById('waitlist');
                    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <SparklesIcon className="w-5 h-5" />
                  Start Designing Now
                </motion.button>

                {isHungarian && (
                  <div className="flex items-center gap-2 text-orange-300 text-sm">
                    <TagIcon className="w-4 h-4" />
                    <span>+ 15% Green Aqua discount included</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;