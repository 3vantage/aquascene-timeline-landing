'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

function BenefitIcon({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
      highlight 
        ? 'bg-gradient-to-br from-primary to-secondary text-white' 
        : 'bg-gradient-to-br from-accent/20 to-accent/10 text-primary'
    }`}>
      {children}
    </div>
  );
}

function BenefitCard({ benefit, index, inView }: { benefit: Benefit; index: number; inView: boolean }) {
  return (
    <div 
      className={`flex items-start space-x-4 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 hover:shadow-xl transition-all duration-300 ${
        inView ? 'animate-fadeInUp' : 'opacity-0'
      } ${benefit.highlight ? 'ring-2 ring-primary/20' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <BenefitIcon highlight={benefit.highlight}>
        {benefit.icon}
      </BenefitIcon>
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-neutral-800 mb-2">
          {benefit.title}
          {benefit.highlight && (
            <span className="ml-2 inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </h3>
        <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
      </div>
    </div>
  );
}

function ValuePropositionHero() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Primary Headline */}
        <h1 className={`text-5xl md:text-7xl font-bold text-neutral-800 mb-6 leading-tight ${
          inView ? 'animate-fadeInUp' : 'opacity-0'
        }`}>
          Design Your Dream
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            Aquascape in 3D
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed ${
          inView ? 'animate-fadeInUp' : 'opacity-0'
        }`} style={{ animationDelay: '200ms' }}>
          Join the waitlist for early access to the most advanced aquascaping tool. 
          <span className="text-primary font-semibold"> Plan before you plant. Save money, avoid mistakes.</span>
        </p>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-6 mb-8 ${
          inView ? 'animate-fadeInUp' : 'opacity-0'
        }`} style={{ animationDelay: '400ms' }}>
          <div className="flex items-center space-x-2 bg-white/90 rounded-full px-4 py-2 shadow-md">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white" />
              ))}
            </div>
            <span className="text-sm font-medium text-neutral-700">2,500+ users waiting</span>
          </div>

          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">No credit card required</span>
          </div>

          <div className="flex items-center space-x-2 text-yellow-500">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-medium text-neutral-700">4.9/5 from 500+ reviews</span>
          </div>
        </div>

        {/* Key Value Props */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto ${
          inView ? 'animate-fadeInUp' : 'opacity-0'
        }`} style={{ animationDelay: '600ms' }}>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-neutral-800 mb-1">Save Money</h3>
            <p className="text-sm text-neutral-600">Avoid costly plant and equipment mistakes</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-semibold text-neutral-800 mb-1">Save Time</h3>
            <p className="text-sm text-neutral-600">Plan layouts 10x faster than traditional methods</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-neutral-800 mb-1">Perfect Results</h3>
            <p className="text-sm text-neutral-600">Professional-grade tools for stunning aquascapes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailedBenefits() {
  const { ref, inView } = useInView({ triggerOnce: true });

  const benefits: Benefit[] = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "3D Visualization Engine",
      description: "Design your aquascape in stunning 3D. See exactly how your layout will look before you start planting. Rotate, zoom, and explore every angle.",
      highlight: true
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Smart Plant Database",
      description: "Access 500+ aquatic plants with detailed care requirements, growth patterns, and compatibility data. Never choose the wrong plant again."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lighting & CO2 Calculator",
      description: "Get precise lighting and CO2 recommendations based on your tank size, plant selection, and desired growth rate. Optimize for success."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Cost Estimation Tool",
      description: "Know exactly how much your aquascape will cost before you buy. Compare prices from multiple suppliers and stay within budget."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Growth Simulation",
      description: "See how your aquascape will evolve over time. Simulate plant growth, trimming schedules, and long-term maintenance needs."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community Sharing",
      description: "Share your designs with the aquascaping community. Get feedback, inspiration, and connect with fellow enthusiasts worldwide."
    }
  ];

  return (
    <section ref={ref} className="py-16 px-4 bg-gradient-to-br from-neutral-50 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">
            Everything You Need for <span className="text-primary">Perfect Aquascapes</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Professional-grade tools that eliminate guesswork and guarantee stunning results every time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index} 
              benefit={benefit} 
              index={index} 
              inView={inView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 ${
          inView ? 'animate-fadeInUp' : 'opacity-0'
        }`} style={{ animationDelay: '800ms' }}>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-accent/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">
              Ready to Transform Your Aquascaping?
            </h3>
            <p className="text-neutral-600 mb-6">
              Join 2,500+ aquascapers who are already planning their dream aquascapes with our revolutionary 3D tools.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">100% Free to Join</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">No Spam, Ever</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Early Access Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ValueProposition() {
  return (
    <div className="relative">
      <ValuePropositionHero />
      <DetailedBenefits />
    </div>
  );
}

export { ValuePropositionHero, DetailedBenefits, BenefitCard };