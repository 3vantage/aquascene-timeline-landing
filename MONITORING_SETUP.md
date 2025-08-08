# Performance Monitoring Setup Guide

## Overview

This document provides a comprehensive guide for the automated performance monitoring system implemented in the Aquascene Waitlist Evaluation project. The system includes Lighthouse CI, Real User Monitoring (RUM), error tracking, and performance analytics.

## 🚀 Components

### 1. Lighthouse CI Configuration

**File**: `/lighthouserc.json`

The Lighthouse CI configuration includes:
- 5 runs per audit for statistical accuracy
- Performance budgets and assertions
- Core Web Vitals tracking
- Automated reporting

**Key Performance Budgets**:
- **Performance Score**: ≥ 80% (warning)
- **Accessibility Score**: ≥ 95% (error)
- **Best Practices Score**: ≥ 85% (warning)
- **SEO Score**: ≥ 90% (warning)

**Core Web Vitals Thresholds**:
- **First Contentful Paint (FCP)**: ≤ 1.8s (warning)
- **Largest Contentful Paint (LCP)**: ≤ 2.5s (error)
- **Cumulative Layout Shift (CLS)**: ≤ 0.08 (error)
- **Total Blocking Time (TBT)**: ≤ 200ms (warning)
- **Interaction to Next Paint (INP)**: ≤ 200ms (warning)

### 2. Real User Monitoring (RUM)

**File**: `/src/lib/performance-monitor.ts`

Features:
- Automatic Core Web Vitals tracking using `web-vitals` library
- Custom performance marks and measurements
- User interaction tracking (clicks, form submissions)
- Resource load time monitoring
- Performance observer for detailed metrics

**Usage Example**:
```typescript
import { usePerformanceMonitor } from '@/lib/performance-monitor';

function MyComponent() {
  const { markStart, markEnd, trackEvent } = usePerformanceMonitor();
  
  useEffect(() => {
    const endTiming = markStart('component-render');
    // ... component logic
    return endTiming;
  }, []);
}
```

### 3. Performance Monitor Component

**File**: `/src/components/performance/PerformanceMonitor.tsx`

Visual performance monitoring dashboard that shows:
- Real-time Core Web Vitals
- Performance ratings with color coding
- Expandable metrics display
- Development/production visibility controls

**Integration**:
```tsx
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';

<PerformanceMonitor 
  showInProduction={false}
  position="bottom-right" 
/>
```

### 4. Error Boundary System

**File**: `/src/components/error/ErrorBoundary.tsx`

Comprehensive error handling:
- React error boundary implementation
- Automatic error reporting
- User-friendly error displays
- Error context preservation
- Retry and reload functionality

**Features**:
- Error ID generation for tracking
- Stack trace capture
- User agent and URL logging
- Custom error handlers
- Graceful degradation

### 5. Error Logging System

**File**: `/src/lib/error-logger.ts`

Advanced error tracking:
- Global error handler registration
- Unhandled promise rejection capture
- Console error interception
- Local storage fallback
- Retry mechanism for failed reports

**Logging Levels**:
- **Error**: Critical issues requiring immediate attention
- **Warning**: Potential issues that should be monitored
- **Info**: General information for debugging

## 🔧 GitHub Actions Integration

**File**: `/.github/workflows/ci.yml`

Enhanced CI pipeline with:
- Automatic Lighthouse audits on every PR
- Performance regression detection
- Detailed performance reports in PR comments
- Artifact storage for historical tracking
- Performance budget enforcement

**Workflow Features**:
- Server readiness checks
- Multiple Lighthouse runs for accuracy
- JSON report parsing and formatting
- Automated PR commenting with scores
- Artifact retention for 30 days

## 📊 Performance Budgets

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| **LCP** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | ≤ 100ms | 100ms - 300ms | > 300ms |
| **CLS** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **TBT** | ≤ 200ms | 200ms - 600ms | > 600ms |

### Bundle Size Targets

| Asset Type | Budget | Warning | Error |
|------------|--------|---------|-------|
| **Initial JS** | ≤ 250KB | 300KB | 400KB |
| **Initial CSS** | ≤ 50KB | 75KB | 100KB |
| **Total Assets** | ≤ 1MB | 1.5MB | 2MB |

## 🚨 Alert Configuration

### Error Thresholds

**Critical Alerts** (Immediate Response):
- Error rate > 5%
- Performance score < 60
- Core Web Vitals failures > 20%
- Unhandled errors > 10/hour

**Warning Alerts** (Monitor Closely):
- Error rate > 1%
- Performance score < 80
- Bundle size increase > 20%
- Response time > 3s

### Monitoring Channels

1. **Console Logging**: All events logged to browser console
2. **API Reporting**: POST to `/api/errors` and `/api/metrics`
3. **Local Storage**: Fallback storage for offline scenarios
4. **Analytics Integration**: Google Analytics exception tracking

## 🛠️ Setup Instructions

### 1. Environment Setup

```bash
# Install dependencies
npm install web-vitals

# Verify Lighthouse CLI
npm install -g @lhci/cli

# Test local Lighthouse run
lhci autorun --config=lighthouserc.json
```

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token
VERCEL_TOKEN=your_vercel_token (if using Vercel)
```

### 3. Integration in Next.js App

**Root Layout** (`/src/app/layout.tsx`):
```tsx
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
          <PerformanceMonitor showInProduction={false} />
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

**Performance Tracking Hook**:
```tsx
import { usePerformanceTracking } from '@/components/performance/PerformanceMonitor';

function MyComponent() {
  const { trackEvent, trackTiming } = usePerformanceTracking();
  
  const handleSubmit = () => {
    trackEvent('form-submit', { formType: 'waitlist' });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form content */}
    </form>
  );
}
```

## 📈 Monitoring Dashboards

### Local Development

1. **Performance Monitor Component**: Real-time metrics in bottom-right corner
2. **Browser DevTools**: Core Web Vitals in Performance tab
3. **Console Logs**: Detailed performance and error information

### Production Monitoring

1. **Lighthouse CI Reports**: Automated via GitHub Actions
2. **Error Tracking API**: Custom endpoint for error aggregation
3. **Analytics Integration**: Google Analytics enhanced ecommerce

## 🔍 Debugging Guide

### Performance Issues

1. **Check Core Web Vitals**:
   ```javascript
   console.log(performanceMonitor.generateReport());
   ```

2. **Analyze Bundle Size**:
   ```bash
   npm run build:analyze
   ```

3. **Review Lighthouse Report**:
   ```bash
   lhci autorun --config=lighthouserc.json
   ```

### Error Investigation

1. **View Error Logs**:
   ```javascript
   console.log(errorLogger.exportLogs());
   ```

2. **Check Local Storage**:
   ```javascript
   JSON.parse(localStorage.getItem('errorLogs') || '[]')
   ```

3. **Review Error Boundary State**:
   - Error ID for correlation
   - Stack traces for root cause
   - User context for reproduction

## 📋 Maintenance Tasks

### Daily
- [ ] Review error rates in console/dashboard
- [ ] Check performance monitor alerts
- [ ] Monitor Core Web Vitals trends

### Weekly
- [ ] Analyze Lighthouse CI trends
- [ ] Review bundle size changes
- [ ] Update performance budgets if needed
- [ ] Clean up old error logs

### Monthly
- [ ] Review and update alert thresholds
- [ ] Analyze performance improvement opportunities
- [ ] Update monitoring documentation
- [ ] Optimize error tracking configuration

## 🚀 Performance Optimization Checklist

### Images
- [ ] Implement next/image with optimization
- [ ] Use modern formats (WebP, AVIF)
- [ ] Implement lazy loading
- [ ] Set appropriate sizes and srcSet

### JavaScript
- [ ] Code splitting by route
- [ ] Dynamic imports for heavy components
- [ ] Bundle analysis and optimization
- [ ] Remove unused dependencies

### CSS
- [ ] Critical CSS inlining
- [ ] Remove unused CSS
- [ ] Optimize CSS delivery
- [ ] Use CSS-in-JS efficiently

### Network
- [ ] Implement service worker
- [ ] Enable compression (gzip/brotli)
- [ ] Optimize API responses
- [ ] Use CDN for static assets

## 📚 Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Error Boundary Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## 🤝 Contributing

When adding new monitoring features:

1. Follow the established patterns in existing components
2. Add comprehensive TypeScript types
3. Include error handling and fallbacks
4. Update this documentation
5. Add tests for new monitoring functionality
6. Consider performance impact of monitoring code itself

---

**Last Updated**: August 8, 2025
**Version**: 1.0.0