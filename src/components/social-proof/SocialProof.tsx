'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface SignupCounterProps {
  initialCount?: number;
  incrementRate?: number;
  maxIncrement?: number;
}

function SignupCounter({ initialCount = 1247, incrementRate = 3000, maxIncrement = 3 }: SignupCounterProps) {
  const [count, setCount] = useState(initialCount);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * maxIncrement) + 1);
    }, incrementRate);

    return () => clearInterval(interval);
  }, [inView, incrementRate, maxIncrement]);

  return (
    <div ref={ref} className="flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-accent/20">
      <div className="flex -space-x-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white flex items-center justify-center text-white text-xs font-bold"
          >
            {String.fromCharCode(65 + i - 1)}
          </div>
        ))}
        <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-white flex items-center justify-center text-accent text-lg">
          +
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-600">Join</p>
        <p className="font-bold text-primary text-lg animate-pulse">
          {count.toLocaleString()}
        </p>
        <p className="text-xs text-neutral-500">aquascaping enthusiasts</p>
      </div>
    </div>
  );
}

interface RecentActivity {
  name: string;
  location: string;
  timeAgo: string;
  action: string;
}

function RecentActivityFeed() {
  const [activities, setActivities] = useState<RecentActivity[]>([
    { name: 'Sarah M.', location: 'California', timeAgo: '2 minutes ago', action: 'joined the waitlist' },
    { name: 'Alex K.', location: 'Budapest', timeAgo: '5 minutes ago', action: 'joined the waitlist' },
    { name: 'Maria S.', location: 'Sofia', timeAgo: '8 minutes ago', action: 'joined the waitlist' },
    { name: 'John D.', location: 'Prague', timeAgo: '12 minutes ago', action: 'joined the waitlist' },
    { name: 'Elena R.', location: 'Bucharest', timeAgo: '15 minutes ago', action: 'joined the waitlist' }
  ]);

  const { ref, inView } = useInView({ triggerOnce: true });

  const names = ['David C.', 'Lisa P.', 'Michael B.', 'Anna K.', 'Peter H.', 'Diana M.', 'Robert F.', 'Sofia L.'];
  const locations = ['Vienna', 'Prague', 'Warsaw', 'Bratislava', 'Ljubljana', 'Zagreb', 'Skopje', 'Thessaloniki'];

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      const newActivity: RecentActivity = {
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timeAgo: 'just now',
        action: 'joined the waitlist'
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev];
        // Update time stamps
        return updated.slice(0, 5).map((activity, index) => ({
          ...activity,
          timeAgo: index === 0 ? 'just now' : `${(index + 1) * 3} minutes ago`
        }));
      });
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-accent/20 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-sm font-semibold text-neutral-700">Recent Activity</h3>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-hidden">
        {activities.map((activity, index) => (
          <div
            key={`${activity.name}-${activity.timeAgo}`}
            className={`flex items-start space-x-2 p-2 rounded-lg transition-all duration-500 ${
              index === 0 ? 'bg-accent/10 scale-105' : 'bg-transparent'
            }`}
            style={{
              opacity: Math.max(1 - index * 0.2, 0.3),
              transform: `translateY(${index * 2}px)`
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
              {activity.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-600">
                <span className="font-medium">{activity.name}</span> from{' '}
                <span className="text-primary">{activity.location}</span>{' '}
                {activity.action}
              </p>
              <p className="text-xs text-neutral-400">{activity.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustBadges() {
  const badges = [
    { text: 'Featured in AquaScaping Weekly', icon: '🏆' },
    { text: '4.9★ from 500+ reviews', icon: '⭐' },
    { text: 'Used by 50+ aquarium stores', icon: '🏪' },
    { text: 'SSL Secured', icon: '🔒' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-accent/10 hover:shadow-md transition-shadow"
        >
          <span className="text-sm">{badge.icon}</span>
          <span className="text-xs font-medium text-neutral-700">{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

function CommunityStats() {
  const stats = [
    { value: '2,500+', label: 'Active Users', growth: '+12% this week' },
    { value: '15,000+', label: 'Designs Created', growth: '+8% this week' },
    { value: '98%', label: 'Success Rate', growth: 'Consistent' },
    { value: '4.9/5', label: 'User Rating', growth: '+0.2 this month' }
  ];

  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`text-center p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 hover:shadow-xl transition-all duration-300 ${
            inView ? 'animate-fadeInUp' : 'opacity-0'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
          <div className="text-sm text-neutral-600 mb-2">{stat.label}</div>
          <div className="text-xs text-green-600 font-medium">{stat.growth}</div>
        </div>
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <div className="space-y-8">
      {/* Live Signup Counter */}
      <div className="flex justify-center">
        <SignupCounter />
      </div>

      {/* Recent Activity Feed */}
      <div className="flex justify-center">
        <RecentActivityFeed />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Community Stats */}
      <CommunityStats />
    </div>
  );
}

// Export individual components for flexible usage
export { SignupCounter, RecentActivityFeed, TrustBadges, CommunityStats };