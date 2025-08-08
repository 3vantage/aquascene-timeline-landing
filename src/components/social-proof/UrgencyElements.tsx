'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownTimer({ targetDate, onComplete }: { targetDate: Date; onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsExpired(true);
        if (onComplete) onComplete();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-semibold">Early Access Period Has Ended</p>
        <p className="text-sm text-red-500">Join the waitlist for the next opportunity!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 text-center shadow-lg">
      <h3 className="text-lg font-bold text-orange-800 mb-2">⏰ Early Access Ends In:</h3>
      
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map((unit, index) => (
          <div key={index} className="bg-white rounded-lg p-3 shadow-md">
            <div className="text-2xl font-bold text-orange-600 animate-pulse">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-orange-500 font-medium">{unit.label}</div>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-orange-600 mt-4 font-medium">
        Don't miss your chance to be among the first users!
      </p>
    </div>
  );
}

function ScarcityIndicator() {
  const [spotsLeft, setSpotsLeft] = useState(47);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setSpotsLeft(prev => {
        const decrease = Math.random() < 0.3 ? 1 : 0; // 30% chance to decrease
        return Math.max(prev - decrease, 12); // Don't go below 12
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [inView]);

  const urgencyLevel = spotsLeft <= 20 ? 'high' : spotsLeft <= 35 ? 'medium' : 'low';
  const urgencyColors = {
    high: 'from-red-500 to-pink-500',
    medium: 'from-orange-500 to-red-500',
    low: 'from-yellow-500 to-orange-500'
  };

  const urgencyBorder = {
    high: 'border-red-300',
    medium: 'border-orange-300',
    low: 'border-yellow-300'
  };

  const urgencyText = {
    high: 'Only',
    medium: 'Just',
    low: 'Limited'
  };

  return (
    <div ref={ref} className={`bg-white/95 backdrop-blur-sm border-2 ${urgencyBorder[urgencyLevel]} rounded-xl p-4 shadow-lg max-w-sm mx-auto`}>
      <div className="text-center">
        <div className={`inline-block bg-gradient-to-r ${urgencyColors[urgencyLevel]} text-white px-3 py-1 rounded-full text-sm font-bold mb-2`}>
          🔥 LIMITED SPOTS
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-neutral-800">
            {urgencyText[urgencyLevel]} {spotsLeft}
          </span>
          <span className="text-lg text-neutral-600">spots remaining</span>
        </div>
        
        <div className="mt-3">
          <div className="bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${urgencyColors[urgencyLevel]} transition-all duration-1000`}
              style={{ width: `${Math.max((100 - spotsLeft) / 100 * 100, 20)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Be among the first 500 early access users
          </p>
        </div>
      </div>
    </div>
  );
}

function FOMOMessaging() {
  const messages = [
    {
      icon: '🚨',
      text: 'Early access spots are filling up fast',
      subtext: 'Join now to secure your place'
    },
    {
      icon: '⚡',
      text: 'Don\'t miss out on exclusive features',
      subtext: 'Available only to first 500 users'
    },
    {
      icon: '🎯',
      text: 'Be part of the aquascaping revolution',
      subtext: 'Shape the future of the platform'
    },
    {
      icon: '💎',
      text: 'Exclusive beta access privilege',
      subtext: 'Test features before anyone else'
    }
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="text-center">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-lg max-w-md mx-auto">
        <div className="text-3xl mb-3">{messages[currentMessage].icon}</div>
        <h3 className="text-lg font-bold text-purple-800 mb-2">
          {messages[currentMessage].text}
        </h3>
        <p className="text-sm text-purple-600">
          {messages[currentMessage].subtext}
        </p>
        
        {/* Message indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {messages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMessage ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EarlyBirdBenefits() {
  const benefits = [
    { icon: '🎁', title: 'Free Premium Templates', description: 'Worth $49 value' },
    { icon: '🏆', title: 'Lifetime 50% Discount', description: 'On all premium features' },
    { icon: '👥', title: 'Exclusive Community Access', description: 'Private Discord channel' },
    { icon: '📞', title: 'Direct Support Line', description: 'Priority customer support' },
    { icon: '🔬', title: 'Beta Feature Access', description: 'Test new features first' },
    { icon: '📚', title: 'Complete Masterclass', description: 'Professional aquascaping course' }
  ];

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-2">
          🌟 EARLY BIRD EXCLUSIVE
        </div>
        <h3 className="text-2xl font-bold text-green-800">First 500 Users Get:</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 ${
              inView ? 'animate-fadeInUp' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-2xl mb-2">{benefit.icon}</div>
            <h4 className="font-semibold text-green-800 mb-1">{benefit.title}</h4>
            <p className="text-sm text-green-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-green-700 font-medium">
          Total value: <span className="text-xl font-bold">$297</span> - 
          <span className="text-green-600"> Yours FREE as an early user!</span>
        </p>
      </div>
    </div>
  );
}

function SocialProofBadges() {
  const badges = [
    { text: 'As seen on AquaScaping Weekly', logo: '📰' },
    { text: 'Featured by Aquarium Co-Op', logo: '🏪' },
    { text: 'Recommended by Green Aqua', logo: '🌱' },
    { text: 'IAPLC Community Approved', logo: '🏆' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 py-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-accent/20 hover:shadow-lg transition-shadow"
        >
          <span className="text-lg">{badge.logo}</span>
          <span className="text-sm font-medium text-neutral-700">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function UrgencyElements() {
  // Set countdown to 7 days from now
  const countdownTarget = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-8 py-8">
      {/* Countdown Timer */}
      <CountdownTimer targetDate={countdownTarget} />
      
      {/* Scarcity Indicator */}
      <ScarcityIndicator />
      
      {/* FOMO Messaging */}
      <FOMOMessaging />
      
      {/* Early Bird Benefits */}
      <EarlyBirdBenefits />
      
      {/* Social Proof Badges */}
      <SocialProofBadges />
    </div>
  );
}

// Export individual components for flexible usage
export { 
  CountdownTimer, 
  ScarcityIndicator, 
  FOMOMessaging, 
  EarlyBirdBenefits,
  SocialProofBadges 
};