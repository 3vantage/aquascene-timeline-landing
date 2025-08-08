'use client';

import { useState, useEffect } from 'react';
import { performanceMonitor, type PerformanceMetric } from '@/lib/performance-monitor';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({ 
  showInProduction = false,
  position = 'bottom-right'
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return;
    }

    setIsVisible(true);

    const unsubscribe = performanceMonitor.subscribe((metric) => {
      setMetrics(prev => [...prev.slice(-9), metric]); // Keep last 10 metrics
    });

    // Load initial metrics
    setMetrics(performanceMonitor.getMetrics().slice(-10));

    return unsubscribe;
  }, [showInProduction]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const coreVitals = metrics.filter(m => 
    ['CLS', 'FCP', 'LCP', 'TTFB', 'INP'].includes(m.name)
  );

  const formatValue = (metric: PerformanceMetric) => {
    if (metric.name === 'CLS') {
      return metric.value.toFixed(3);
    }
    return `${Math.round(metric.value)}ms`;
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRatingBg = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-100';
      case 'needs-improvement': return 'bg-yellow-100';
      case 'poor': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 max-w-sm">
        <div 
          className="p-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Performance Monitor
            </span>
          </div>
          <svg 
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isExpanded && (
          <div className="p-3 space-y-3">
            {coreVitals.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-800 mb-2">
                  Core Web Vitals
                </h4>
                <div className="space-y-2">
                  {coreVitals.map((metric, index) => (
                    <div 
                      key={`${metric.name}-${index}`}
                      className={`p-2 rounded text-xs ${getRatingBg(metric.rating)}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.name}</span>
                        <span className={`font-mono ${getRatingColor(metric.rating)}`}>
                          {formatValue(metric)}
                        </span>
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Rating: <span className={getRatingColor(metric.rating)}>{metric.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => console.log(performanceMonitor.generateReport())}
                className="w-full px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Log Full Report
              </button>
              <button
                onClick={() => setMetrics([])}
                className="w-full px-3 py-1.5 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Metrics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for easier usage
export function usePerformanceTracking() {
  useEffect(() => {
    // Track component mount time
    const startTime = performance.now();
    
    return () => {
      // Track component unmount time
      const mountTime = performance.now() - startTime;
      performanceMonitor.addCustomMetric('component-lifecycle', mountTime);
    };
  }, []);

  return {
    trackEvent: (name: string, metadata?: Record<string, any>) => {
      performanceMonitor.markEvent(name, metadata);
    },
    trackTiming: (name: string) => {
      const mark = performanceMonitor.markStart(name);
      return () => performanceMonitor.markEnd(name);
    }
  };
}