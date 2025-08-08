const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runPlaywrightAudit() {
    const url = 'http://localhost:3000';
    const outputDir = path.join(__dirname, 'playwright-audit-results');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    console.log('🚀 Starting Comprehensive Website Audit with Playwright...');
    
    // Launch browser
    const browser = await chromium.launch({ headless: true });
    
    try {
        // Desktop audit
        console.log('🖥️  Running Desktop Analysis...');
        const desktopContext = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        
        const desktopPage = await desktopContext.newPage();
        const desktopResults = await auditPage(desktopPage, url, 'desktop');
        await desktopContext.close();

        // Mobile audit
        console.log('📱 Running Mobile Analysis...');
        const mobileContext = await browser.newContext({
            viewport: { width: 375, height: 667 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        });
        
        const mobilePage = await mobileContext.newPage();
        const mobileResults = await auditPage(mobilePage, url, 'mobile');
        await mobileContext.close();

        const analysis = {
            timestamp,
            url,
            desktop: desktopResults,
            mobile: mobileResults,
            summary: {
                desktopScore: calculateOverallScore(desktopResults),
                mobileScore: calculateOverallScore(mobileResults),
                criticalIssues: [
                    ...desktopResults.issues.filter(i => i.severity === 'critical'),
                    ...mobileResults.issues.filter(i => i.severity === 'critical')
                ],
                recommendations: generateRecommendations(desktopResults, mobileResults)
            }
        };

        // Save results
        fs.writeFileSync(
            path.join(outputDir, `audit-analysis-${timestamp}.json`),
            JSON.stringify(analysis, null, 2)
        );

        console.log('✅ Audit completed successfully!');
        console.log(`Desktop Score: ${analysis.summary.desktopScore}/100`);
        console.log(`Mobile Score: ${analysis.summary.mobileScore}/100`);
        
        return analysis;

    } catch (error) {
        console.error('❌ Error during audit:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function auditPage(page, url, device) {
    const results = {
        device,
        performance: {},
        accessibility: {},
        seo: {},
        bestPractices: {},
        issues: []
    };

    try {
        // Start performance monitoring
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Performance metrics
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                domSize: document.getElementsByTagName('*').length,
                totalScripts: document.querySelectorAll('script').length,
                totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
                totalImages: document.querySelectorAll('img').length
            };
        });

        results.performance = {
            ...performanceMetrics,
            score: calculatePerformanceScore(performanceMetrics)
        };

        // Accessibility audit
        const accessibilityIssues = await page.evaluate(() => {
            const issues = [];
            
            // Check for alt text on images
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
            if (imagesWithoutAlt.length > 0) {
                issues.push({
                    type: 'missing-alt-text',
                    count: imagesWithoutAlt.length,
                    severity: 'high',
                    description: 'Images without alt text found'
                });
            }

            // Check for proper heading hierarchy
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const headingLevels = headings.map(h => parseInt(h.tagName.charAt(1)));
            let hasSkippedLevel = false;
            for (let i = 1; i < headingLevels.length; i++) {
                if (headingLevels[i] - headingLevels[i-1] > 1) {
                    hasSkippedLevel = true;
                    break;
                }
            }
            if (hasSkippedLevel) {
                issues.push({
                    type: 'heading-hierarchy',
                    severity: 'medium',
                    description: 'Heading hierarchy issues found'
                });
            }

            // Check for form labels
            const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
            const unlabeledInputs = Array.from(inputsWithoutLabels).filter(input => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                return !label && input.type !== 'hidden';
            });
            if (unlabeledInputs.length > 0) {
                issues.push({
                    type: 'unlabeled-inputs',
                    count: unlabeledInputs.length,
                    severity: 'high',
                    description: 'Form inputs without proper labels'
                });
            }

            // Check color contrast (basic check)
            const colorContrastIssues = [];
            const elementsToCheck = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
            let lowContrastCount = 0;
            
            Array.from(elementsToCheck).slice(0, 50).forEach(el => {
                const style = window.getComputedStyle(el);
                const color = style.color;
                const bgColor = style.backgroundColor;
                
                // Simple contrast check (this is a basic implementation)
                if (color && bgColor && color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
                    // This would need a proper contrast ratio calculation
                    // For now, just flag potential issues
                    if (color === bgColor) {
                        lowContrastCount++;
                    }
                }
            });

            if (lowContrastCount > 0) {
                issues.push({
                    type: 'color-contrast',
                    count: lowContrastCount,
                    severity: 'medium',
                    description: 'Potential color contrast issues found'
                });
            }

            return issues;
        });

        results.accessibility = {
            issues: accessibilityIssues,
            score: calculateAccessibilityScore(accessibilityIssues)
        };

        // SEO audit
        const seoData = await page.evaluate(() => {
            return {
                title: document.title,
                titleLength: document.title.length,
                metaDescription: document.querySelector('meta[name="description"]')?.content || '',
                metaDescriptionLength: (document.querySelector('meta[name="description"]')?.content || '').length,
                h1Count: document.querySelectorAll('h1').length,
                h1Text: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
                hasViewport: !!document.querySelector('meta[name="viewport"]'),
                hasCanonical: !!document.querySelector('link[rel="canonical"]'),
                hasOgTags: !!document.querySelector('meta[property^="og:"]'),
                hasTwitterTags: !!document.querySelector('meta[name^="twitter:"]'),
                imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
                linksWithoutText: document.querySelectorAll('a:empty, a:not([aria-label]):not([title])').length
            };
        });

        results.seo = {
            ...seoData,
            score: calculateSeoScore(seoData)
        };

        // Best practices audit
        const bestPracticesData = await page.evaluate(() => {
            return {
                hasHttps: location.protocol === 'https:',
                hasServiceWorker: 'serviceWorker' in navigator,
                usesModernImageFormats: Array.from(document.querySelectorAll('img')).some(img => 
                    img.src.includes('.webp') || img.src.includes('.avif')
                ),
                hasConsoleErrors: false, // We'll check this separately
                hasUnusedCss: false, // Complex check, simplified
                hasUnusedJs: false, // Complex check, simplified
                hasLargeDom: document.getElementsByTagName('*').length > 1000,
                hasExternalScripts: document.querySelectorAll('script[src^="http"]').length,
                hasInlineStyles: document.querySelectorAll('[style]').length
            };
        });

        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        bestPracticesData.hasConsoleErrors = consoleErrors.length > 0;
        bestPracticesData.consoleErrorCount = consoleErrors.length;

        results.bestPractices = {
            ...bestPracticesData,
            score: calculateBestPracticesScore(bestPracticesData)
        };

        // Collect all issues
        results.issues = [
            ...accessibilityIssues,
            ...(seoData.titleLength === 0 ? [{ type: 'missing-title', severity: 'critical', description: 'Page title is missing' }] : []),
            ...(seoData.metaDescriptionLength === 0 ? [{ type: 'missing-meta-description', severity: 'high', description: 'Meta description is missing' }] : []),
            ...(seoData.h1Count === 0 ? [{ type: 'missing-h1', severity: 'high', description: 'H1 heading is missing' }] : []),
            ...(seoData.h1Count > 1 ? [{ type: 'multiple-h1', severity: 'medium', description: 'Multiple H1 headings found' }] : []),
            ...(!bestPracticesData.hasHttps ? [{ type: 'no-https', severity: 'critical', description: 'Site not served over HTTPS' }] : []),
            ...(consoleErrors.length > 0 ? [{ type: 'console-errors', severity: 'medium', description: `${consoleErrors.length} console errors found` }] : [])
        ];

    } catch (error) {
        console.error(`❌ Error auditing ${device}:`, error);
        results.error = error.message;
    }

    return results;
}

function calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Penalize slow metrics
    if (metrics.domContentLoaded > 1500) score -= 20;
    if (metrics.loadComplete > 3000) score -= 20;
    if (metrics.firstContentfulPaint > 1800) score -= 15;
    if (metrics.domSize > 1500) score -= 10;
    if (metrics.totalScripts > 10) score -= 10;
    
    return Math.max(0, score);
}

function calculateAccessibilityScore(issues) {
    let score = 100;
    
    issues.forEach(issue => {
        switch (issue.severity) {
            case 'critical': score -= 25; break;
            case 'high': score -= 15; break;
            case 'medium': score -= 10; break;
            case 'low': score -= 5; break;
        }
    });
    
    return Math.max(0, score);
}

function calculateSeoScore(data) {
    let score = 100;
    
    if (!data.title) score -= 30;
    else if (data.titleLength < 30 || data.titleLength > 60) score -= 10;
    
    if (!data.metaDescription) score -= 20;
    else if (data.metaDescriptionLength < 120 || data.metaDescriptionLength > 160) score -= 10;
    
    if (data.h1Count === 0) score -= 20;
    if (data.h1Count > 1) score -= 10;
    if (!data.hasViewport) score -= 15;
    if (data.imagesWithoutAlt > 0) score -= 10;
    
    return Math.max(0, score);
}

function calculateBestPracticesScore(data) {
    let score = 100;
    
    if (!data.hasHttps) score -= 30;
    if (data.hasConsoleErrors) score -= 15;
    if (data.hasLargeDom) score -= 10;
    if (data.hasExternalScripts > 5) score -= 10;
    if (data.hasInlineStyles > 10) score -= 5;
    
    return Math.max(0, score);
}

function calculateOverallScore(results) {
    if (results.error) return 0;
    
    const scores = [
        results.performance.score || 0,
        results.accessibility.score || 0,
        results.seo.score || 0,
        results.bestPractices.score || 0
    ];
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function generateRecommendations(desktopResults, mobileResults) {
    const recommendations = [];
    
    // Performance recommendations
    if (desktopResults.performance.score < 80 || mobileResults.performance.score < 80) {
        recommendations.push({
            category: 'Performance',
            priority: 'High',
            issue: 'Poor performance scores detected',
            solution: 'Optimize images, reduce JavaScript bundle size, implement lazy loading'
        });
    }
    
    // Accessibility recommendations
    const accessibilityIssues = [
        ...desktopResults.accessibility.issues,
        ...mobileResults.accessibility.issues
    ];
    
    if (accessibilityIssues.length > 0) {
        recommendations.push({
            category: 'Accessibility',
            priority: 'High',
            issue: `${accessibilityIssues.length} accessibility issues found`,
            solution: 'Add alt text to images, improve form labels, fix heading hierarchy'
        });
    }
    
    // SEO recommendations
    if (desktopResults.seo.score < 90) {
        recommendations.push({
            category: 'SEO',
            priority: 'Medium',
            issue: 'SEO optimization needed',
            solution: 'Optimize title and meta description, improve heading structure'
        });
    }
    
    return recommendations;
}

if (require.main === module) {
    runPlaywrightAudit()
        .then((results) => {
            console.log('\n🎯 Audit Summary:');
            console.log(`Desktop Score: ${results.summary.desktopScore}/100`);
            console.log(`Mobile Score: ${results.summary.mobileScore}/100`);
            console.log(`Critical Issues: ${results.summary.criticalIssues.length}`);
            console.log(`Recommendations: ${results.summary.recommendations.length}`);
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { runPlaywrightAudit };