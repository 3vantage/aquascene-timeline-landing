const { chromium } = require('playwright');
const fs = require('fs');

async function runPerformanceTest() {
  const browser = await chromium.launch();
  
  try {
    const page = await browser.newPage();
    
    console.log('🚀 Starting performance baseline test...');
    
    // Clear any cache
    await page.context().clearCookies();
    
    // Start measuring
    const startTime = Date.now();
    
    // Navigate to the page
    await page.goto('http://localhost:3005', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Get Web Vitals and performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      
      const results = {
        // Navigation timing
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
        ttfb: Math.round(navigation.responseStart - navigation.requestStart),
        
        // Paint timing
        firstPaint: paintEntries.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource analysis
        resources: [],
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        imgSize: 0
      };
      
      // Get resource details
      const resources = performance.getEntriesByType('resource');
      resources.forEach(resource => {
        const size = resource.transferSize || resource.encodedBodySize || 0;
        results.totalSize += size;
        
        if (resource.name.includes('.js')) {
          results.jsSize += size;
        } else if (resource.name.includes('.css')) {
          results.cssSize += size;
        } else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
          results.imgSize += size;
        }
        
        results.resources.push({
          name: resource.name,
          size: size,
          duration: Math.round(resource.duration),
          type: resource.initiatorType
        });
      });
      
      // Memory usage if available
      if ('memory' in performance) {
        results.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      
      return results;
    });
    
    // Test form interaction responsiveness
    console.log('📝 Testing form interaction performance...');
    const interactionStart = Date.now();
    
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    
    const interactionTime = Date.now() - interactionStart;
    
    // Compile results
    const results = {
      timestamp: new Date().toISOString(),
      pageLoad: {
        totalLoadTime: loadTime,
        domContentLoaded: metrics.domContentLoaded,
        loadComplete: metrics.loadComplete,
        ttfb: metrics.ttfb,
        firstPaint: Math.round(metrics.firstPaint),
        firstContentfulPaint: Math.round(metrics.firstContentfulPaint)
      },
      bundleSizes: {
        total: Math.round(metrics.totalSize / 1024),
        javascript: Math.round(metrics.jsSize / 1024),
        css: Math.round(metrics.cssSize / 1024),
        images: Math.round(metrics.imgSize / 1024),
        resourceCount: metrics.resources.length
      },
      memory: metrics.memory,
      interactions: {
        formInteractionTime: interactionTime
      },
      resourceDetails: metrics.resources.map(r => ({
        name: r.name.split('/').pop(),
        size: Math.round(r.size / 1024),
        duration: r.duration,
        type: r.type
      })),
      grades: {
        loadTime: loadTime < 3000 ? 'A' : loadTime < 5000 ? 'B' : loadTime < 8000 ? 'C' : 'D',
        fcp: metrics.firstContentfulPaint < 1800 ? 'A' : metrics.firstContentfulPaint < 3000 ? 'B' : 'C',
        ttfb: metrics.ttfb < 600 ? 'A' : metrics.ttfb < 1200 ? 'B' : 'C'
      }
    };
    
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
      console.log('=================================');
      console.log(`📈 Total Load Time: ${results.pageLoad.totalLoadTime}ms (Grade: ${results.grades.loadTime})`);
      console.log(`⚡ First Contentful Paint: ${results.pageLoad.firstContentfulPaint}ms (Grade: ${results.grades.fcp})`);
      console.log(`🚀 Time to First Byte: ${results.pageLoad.ttfb}ms (Grade: ${results.grades.ttfb})`);
      console.log(`📦 Total Bundle Size: ${results.bundleSizes.total}KB`);
      console.log(`  └── JavaScript: ${results.bundleSizes.javascript}KB`);
      console.log(`  └── CSS: ${results.bundleSizes.css}KB`);
      console.log(`  └── Images: ${results.bundleSizes.images}KB`);
      console.log(`📊 Total Resources: ${results.bundleSizes.resourceCount}`);
      
      if (results.memory) {
        console.log(`💾 Memory Usage: ${results.memory.used}MB`);
      }
      
      console.log(`⌨️ Form Interaction: ${results.interactions.formInteractionTime}ms`);
      
      // Show top heavy resources
      const heavyResources = results.resourceDetails
        .filter(r => r.size > 50)
        .sort((a, b) => b.size - a.size)
        .slice(0, 5);
        
      if (heavyResources.length > 0) {
        console.log('\n🎯 LARGEST RESOURCES:');
        heavyResources.forEach(r => {
          console.log(`  ${r.name}: ${r.size}KB (${r.duration}ms)`);
        });
      }
      
      // Performance recommendations
      console.log('\n💡 QUICK ANALYSIS:');
      if (results.pageLoad.totalLoadTime > 3000) {
        console.log('  ⚠️ Load time is slow - target < 3000ms');
      }
      if (results.bundleSizes.javascript > 200) {
        console.log('  ⚠️ JavaScript bundle is large - consider code splitting');
      }
      if (results.bundleSizes.total > 500) {
        console.log('  ⚠️ Total bundle size is large - optimize assets');
      }
      
      // Save detailed results
      fs.writeFileSync('./baseline-performance-results.json', JSON.stringify(results, null, 2));
      console.log('\n💾 Detailed results saved to baseline-performance-results.json');
    })
    .catch(error => {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    });
}

module.exports = runPerformanceTest;