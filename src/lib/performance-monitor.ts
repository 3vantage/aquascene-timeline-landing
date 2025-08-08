import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  id: string;
  delta: number;
}

export interface CustomPerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: CustomPerformanceMark[] = [];
  private observers: ((metric: PerformanceMetric) => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // Track Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));

    // Track custom metrics
    this.trackPageLoadTime();
    this.trackResourceLoadTimes();
    this.trackUserInteractions();

    this.isInitialized = true;
  }

  private handleMetric(metric: Metric) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now(),
      id: metric.id,
      delta: metric.delta
    };

    this.metrics.push(performanceMetric);
    this.notifyObservers(performanceMetric);
    this.reportToConsole(performanceMetric);
    this.reportToAPI(performanceMetric);
  }

  private trackPageLoadTime() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.addCustomMetric('page-load-time', loadTime);
    });
  }

  private trackResourceLoadTimes() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.addCustomMetric(`resource-load-${resourceEntry.name}`, resourceEntry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private trackUserInteractions() {
    if (typeof window === 'undefined') return;

    // Track click interactions
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const elementInfo = this.getElementInfo(target);
      this.markEvent('user-click', { element: elementInfo });
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLFormElement;
      this.markEvent('form-submit', { form: target.id || target.className });
    });
  }

  private getElementInfo(element: HTMLElement) {
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.slice(0, 50)
    };
  }

  public addCustomMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor' = 'good') {
    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      id: `${name}-${Date.now()}`,
      delta: 0
    };

    this.metrics.push(metric);
    this.notifyObservers(metric);
    this.reportToConsole(metric);
  }

  public markStart(name: string, metadata?: Record<string, any>) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }

    const mark: CustomPerformanceMark = {
      name,
      startTime: Date.now(),
      metadata
    };

    this.marks.push(mark);
    return mark;
  }

  public markEnd(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          this.addCustomMetric(`custom-${name}`, measure.duration);
        }
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error);
      }
    }

    const mark = this.marks.find(m => m.name === name && !m.duration);
    if (mark) {
      mark.duration = Date.now() - mark.startTime;
    }
  }

  public markEvent(eventName: string, metadata?: Record<string, any>) {
    const mark: CustomPerformanceMark = {
      name: eventName,
      startTime: Date.now(),
      duration: 0,
      metadata
    };

    this.marks.push(mark);
    console.log(`Event: ${eventName}`, metadata);
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMarks(): CustomPerformanceMark[] {
    return [...this.marks];
  }

  public subscribe(callback: (metric: PerformanceMetric) => void) {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(metric: PerformanceMetric) {
    this.observers.forEach(callback => callback(metric));
  }

  private reportToConsole(metric: PerformanceMetric) {
    const color = metric.rating === 'good' ? 'green' : metric.rating === 'needs-improvement' ? 'orange' : 'red';
    console.log(
      `%c${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }

  private reportToAPI(metric: PerformanceMetric) {
    // In a real application, you would send this to your analytics endpoint
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon('/api/metrics', JSON.stringify(metric));
      } catch (error) {
        // Fallback to fetch if sendBeacon fails
        fetch('/api/metrics', {
          method: 'POST',
          body: JSON.stringify(metric),
          headers: {
            'Content-Type': 'application/json'
          }
        }).catch(() => {
          // Silently fail - we don't want to break the app
        });
      }
    }
  }

  public generateReport(): string {
    const coreVitals = this.metrics.filter(m => 
      ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'].includes(m.name)
    );

    const customMetrics = this.metrics.filter(m => 
      !['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'].includes(m.name)
    );

    let report = '=== Performance Report ===\n\n';
    
    if (coreVitals.length > 0) {
      report += 'Core Web Vitals:\n';
      coreVitals.forEach(metric => {
        report += `  ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})\n`;
      });
      report += '\n';
    }

    if (customMetrics.length > 0) {
      report += 'Custom Metrics:\n';
      customMetrics.forEach(metric => {
        report += `  ${metric.name}: ${metric.value.toFixed(2)}ms\n`;
      });
      report += '\n';
    }

    if (this.marks.length > 0) {
      report += 'Performance Marks:\n';
      this.marks.forEach(mark => {
        report += `  ${mark.name}: ${mark.duration ? `${mark.duration}ms` : 'ongoing'}\n`;
      });
    }

    return report;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for using performance monitoring
export function usePerformanceMonitor() {
  return {
    markStart: performanceMonitor.markStart.bind(performanceMonitor),
    markEnd: performanceMonitor.markEnd.bind(performanceMonitor),
    markEvent: performanceMonitor.markEvent.bind(performanceMonitor),
    addCustomMetric: performanceMonitor.addCustomMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getMarks: performanceMonitor.getMarks.bind(performanceMonitor),
    subscribe: performanceMonitor.subscribe.bind(performanceMonitor),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor)
  };
}