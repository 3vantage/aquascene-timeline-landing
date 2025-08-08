const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runPerformanceTest() {
  // Try to find Chrome in common locations
  const chromePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];
  
  let executablePath;
  for (const path of chromePaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(path)) {
        executablePath = path;
        break;
      }
    } catch (e) {
      // Continue searching
    }
  }
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();
    
    // Enable performance metrics
    await page.setCacheEnabled(false);
    
    const metrics = [];
    
    console.log('🚀 Starting performance baseline test...');
    
    // Test 1: Initial page load
    console.log('📊 Testing initial page load...');
    const loadStart = Date.now();
    
    await page.goto('http://localhost:3006', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const loadEnd = Date.now();
    const loadTime = loadEnd - loadStart;
    
    // Get Web Vitals using browser APIs
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Get FCP (First Contentful Paint)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.FCP = Math.round(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Get LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = Math.round(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Get CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.CLS = Math.round(clsValue * 1000) / 1000;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Get performance navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        vitals.TTFB = Math.round(navigation.responseStart - navigation.requestStart);
        vitals.DOMContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
        vitals.LoadComplete = Math.round(navigation.loadEventEnd - navigation.navigationStart);
        
        // Wait a bit for metrics to be collected
        setTimeout(() => {
          resolve(vitals);
        }, 2000);
      });
    });
    
    // Get JavaScript bundle size information
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const sizes = {
        totalJS: 0,
        totalCSS: 0,
        totalImages: 0,
        totalFonts: 0,
        resourceCount: resources.length
      };
      
      resources.forEach(resource => {
        const size = resource.transferSize || resource.encodedBodySize || 0;
        
        if (resource.name.includes('.js')) {
          sizes.totalJS += size;
        } else if (resource.name.includes('.css')) {
          sizes.totalCSS += size;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
          sizes.totalImages += size;
        } else if (resource.name.match(/\.(woff|woff2|ttf|eot)$/)) {
          sizes.totalFonts += size;
        }
      });
      
      return sizes;
    });
    
    // Get memory usage
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    // Test form interaction performance
    console.log('📝 Testing form interaction performance...');
    const interactionStart = Date.now();
    
    await page.click('input[name="name"]');
    await page.type('input[name="name"]', 'John Doe');
    await page.click('input[name="email"]');
    await page.type('input[name="email"]', 'john@example.com');
    
    const interactionEnd = Date.now();
    const interactionTime = interactionEnd - interactionStart;
    
    // Compile results
    const results = {
      timestamp: new Date().toISOString(),
      pageLoad: {
        totalLoadTime: loadTime,
        TTFB: webVitals.TTFB,
        FCP: webVitals.FCP,
        LCP: webVitals.LCP,
        CLS: webVitals.CLS,
        DOMContentLoaded: webVitals.DOMContentLoaded,
        LoadComplete: webVitals.LoadComplete
      },
      bundleSizes: {
        javascript: Math.round(resourceSizes.totalJS / 1024),
        css: Math.round(resourceSizes.totalCSS / 1024),
        images: Math.round(resourceSizes.totalImages / 1024),
        fonts: Math.round(resourceSizes.totalFonts / 1024),
        resourceCount: resourceSizes.resourceCount
      },
      memoryUsage: memoryUsage ? {
        used: Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memoryUsage.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memoryUsage.jsHeapSizeLimit / 1024 / 1024)
      } : null,
      interactions: {
        formInteractionTime: interactionTime
      },
      grades: {
        loadTime: loadTime < 3000 ? 'A' : loadTime < 5000 ? 'B' : loadTime < 8000 ? 'C' : 'D',
        FCP: webVitals.FCP < 1800 ? 'A' : webVitals.FCP < 3000 ? 'B' : webVitals.FCP < 4000 ? 'C' : 'D',
        LCP: webVitals.LCP < 2500 ? 'A' : webVitals.LCP < 4000 ? 'B' : webVitals.LCP < 6000 ? 'C' : 'D',
        CLS: webVitals.CLS < 0.1 ? 'A' : webVitals.CLS < 0.25 ? 'B' : webVitals.CLS < 0.5 ? 'C' : 'D'
      }
    };
    
    console.log('✅ Performance test completed');
    return results;
    
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  runPerformanceTest()
    .then(results => {
      console.log('\n📊 PERFORMANCE BASELINE RESULTS:');
      console.log('================================');
      console.log(`📈 Total Load Time: ${results.pageLoad.totalLoadTime}ms (Grade: ${results.grades.loadTime})`);
      console.log(`⚡ First Contentful Paint: ${results.pageLoad.FCP}ms (Grade: ${results.grades.FCP})`);
      console.log(`🎯 Largest Contentful Paint: ${results.pageLoad.LCP}ms (Grade: ${results.grades.LCP})`);
      console.log(`📏 Cumulative Layout Shift: ${results.pageLoad.CLS} (Grade: ${results.grades.CLS})`);
      console.log(`🚀 Time to First Byte: ${results.pageLoad.TTFB}ms`);
      console.log(`📦 JavaScript Bundle: ${results.bundleSizes.javascript}KB`);
      console.log(`🎨 CSS Bundle: ${results.bundleSizes.css}KB`);
      console.log(`🖼️ Images: ${results.bundleSizes.images}KB`);
      console.log(`🔤 Fonts: ${results.bundleSizes.fonts}KB`);
      console.log(`📊 Total Resources: ${results.bundleSizes.resourceCount}`);
      
      if (results.memoryUsage) {
        console.log(`💾 Memory Usage: ${results.memoryUsage.used}MB / ${results.memoryUsage.total}MB`);
      }
      
      console.log(`⌨️ Form Interaction Time: ${results.interactions.formInteractionTime}ms`);
      
      // Save detailed results to file
      fs.writeFileSync('./baseline-performance-results.json', JSON.stringify(results, null, 2));
      console.log('\n💾 Detailed results saved to baseline-performance-results.json');
    })
    .catch(error => {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    });
}

module.exports = runPerformanceTest;