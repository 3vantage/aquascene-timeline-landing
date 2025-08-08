'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import WaitlistForm from '@/components/forms/WaitlistForm';
import { staggerContainer, staggerItem } from '@/lib/animation-config';
import { SparklesIcon, UserGroupIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const WaitlistSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    {
      icon: UserGroupIcon,
      value: '2,500+',
      label: 'Early Adopters',
      color: 'from-primary to-accent-emerald'
    },
    {
      icon: GlobeAltIcon,
      value: '12',
      label: 'Countries',
      color: 'from-secondary to-accent'
    },
    {
      icon: SparklesIcon,
      value: '98%',
      label: 'Satisfaction Rate',
      color: 'from-accent-coral to-accent-light'
    }
  ];

  return (
    <section id="waitlist" className="relative section-spacing overflow-hidden section-gap">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/20 via-primary/30 to-secondary-dark/20" />
      
      {/* Animated water current effect */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            skewX: [0, 5, 0, -5, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      <div className="container mx-auto container-padding relative z-10" ref={ref}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            {/* Left side - Content */}
            <div className="lg:sticky lg:top-8">
              <motion.div variants={staggerItem}>
                <div className="inline-flex items-center gap-3 glass-underwater px-6 py-3 rounded-full mb-8">
                  <SparklesIcon className="w-5 h-5 text-accent-emerald" />
                  <span className="text-sm font-semibold text-white tracking-wide">JOIN THE WAITLIST</span>
                </div>
              </motion.div>

              <motion.h2
                variants={staggerItem}
                className="heading-h2 text-white mb-8 text-balance"
              >
                Join 2,500+ Smart Aquascapers
              </motion.h2>

              <motion.p
                variants={staggerItem}
                className="text-lead text-white/80 mb-10 text-pretty"
              >
                Stop guessing. Start designing with confidence.
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={staggerItem}
                className="grid grid-cols-3 gap-8 mb-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="premium-hover glass-underwater p-5 rounded-2xl mb-4 transition-all duration-300">
                      <motion.div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.5
                        }}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-small text-white/70">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Benefits list */}
              <motion.div variants={staggerItem} className="space-y-5">
                {[
                  'Priority access to beta features',
                  'Exclusive aquascaping guides and tips',
                  'Direct feedback channel to our team',
                  'Special launch pricing discounts'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-accent-emerald to-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-body text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social proof */}
              <motion.div
                variants={staggerItem}
                className="mt-10 p-8 premium-hover glass-underwater rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-emerald border-2 border-white/50 flex items-center justify-center"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.2
                        }}
                      >
                        <span className="text-white text-xs font-medium">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Join the Community</div>
                    <div className="text-white/70 text-body">2,500+ aquascapers already signed up</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Form */}
            <motion.div variants={staggerItem} className="lg:pt-20">
              <WaitlistForm />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-accent-emerald/10 to-primary/10 blur-xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default WaitlistSection;