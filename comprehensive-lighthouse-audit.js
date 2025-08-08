const puppeteer = require('puppeteer');
const { lighthouse } = require('lighthouse/lighthouse-core/fraggle-rock/api.js');
const fs = require('fs');
const path = require('path');

async function runComprehensiveLighthouseAudit() {
    const url = 'http://localhost:3000';
    const outputDir = path.join(__dirname, 'lighthouse-results');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        console.log('🚀 Starting Comprehensive Lighthouse Audit...');
        
        // Desktop audit configuration
        const desktopConfig = {
            logLevel: 'info',
            output: ['html', 'json'],
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
            port: browser.wsEndpoint().split(':')[2].split('/')[0],
            formFactor: 'desktop',
            screenEmulation: {
                mobile: false,
                width: 1350,
                height: 940,
                deviceScaleFactor: 1,
                disabled: false
            },
            throttling: {
                rttMs: 40,
                throughputKbps: 10240,
                cpuSlowdownMultiplier: 1,
                requestLatencyMs: 0,
                downloadThroughputKbps: 0,
                uploadThroughputKbps: 0
            }
        };

        // Mobile audit configuration
        const mobileConfig = {
            logLevel: 'info',
            output: ['html', 'json'],
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
            port: browser.wsEndpoint().split(':')[2].split('/')[0],
            formFactor: 'mobile',
            screenEmulation: {
                mobile: true,
                width: 375,
                height: 667,
                deviceScaleFactor: 2,
                disabled: false
            },
            throttling: {
                rttMs: 150,
                throughputKbps: 1638.4,
                cpuSlowdownMultiplier: 4,
                requestLatencyMs: 0,
                downloadThroughputKbps: 0,
                uploadThroughputKbps: 0
            }
        };

        console.log('📱 Running Desktop Audit...');
        const desktopResults = await lighthouse(url, desktopConfig);
        
        console.log('📱 Running Mobile Audit...');
        const mobileResults = await lighthouse(url, mobileConfig);

        // Save results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Desktop results
        fs.writeFileSync(
            path.join(outputDir, `desktop-report-${timestamp}.html`),
            desktopResults.report[0]
        );
        fs.writeFileSync(
            path.join(outputDir, `desktop-report-${timestamp}.json`),
            desktopResults.report[1]
        );

        // Mobile results
        fs.writeFileSync(
            path.join(outputDir, `mobile-report-${timestamp}.html`),
            mobileResults.report[0]
        );
        fs.writeFileSync(
            path.join(outputDir, `mobile-report-${timestamp}.json`),
            mobileResults.report[1]
        );

        // Parse and analyze results
        const desktopData = JSON.parse(desktopResults.report[1]);
        const mobileData = JSON.parse(mobileResults.report[1]);

        const analysis = {
            timestamp,
            url,
            desktop: {
                scores: {
                    performance: Math.round(desktopData.categories.performance.score * 100),
                    accessibility: Math.round(desktopData.categories.accessibility.score * 100),
                    bestPractices: Math.round(desktopData.categories['best-practices'].score * 100),
                    seo: Math.round(desktopData.categories.seo.score * 100),
                    pwa: Math.round(desktopData.categories.pwa.score * 100)
                },
                metrics: {
                    firstContentfulPaint: desktopData.audits['first-contentful-paint']?.displayValue || 'N/A',
                    largestContentfulPaint: desktopData.audits['largest-contentful-paint']?.displayValue || 'N/A',
                    speedIndex: desktopData.audits['speed-index']?.displayValue || 'N/A',
                    timeToInteractive: desktopData.audits['interactive']?.displayValue || 'N/A',
                    totalBlockingTime: desktopData.audits['total-blocking-time']?.displayValue || 'N/A',
                    cumulativeLayoutShift: desktopData.audits['cumulative-layout-shift']?.displayValue || 'N/A'
                },
                opportunities: desktopData.audits ? Object.keys(desktopData.audits)
                    .filter(key => desktopData.audits[key].details?.type === 'opportunity')
                    .map(key => ({
                        audit: key,
                        title: desktopData.audits[key].title,
                        description: desktopData.audits[key].description,
                        potentialSavings: desktopData.audits[key].details?.overallSavingsMs || 0
                    }))
                    .sort((a, b) => b.potentialSavings - a.potentialSavings) : [],
                diagnostics: desktopData.audits ? Object.keys(desktopData.audits)
                    .filter(key => desktopData.audits[key].details?.type === 'diagnostic' && desktopData.audits[key].score < 1)
                    .map(key => ({
                        audit: key,
                        title: desktopData.audits[key].title,
                        description: desktopData.audits[key].description,
                        score: desktopData.audits[key].score
                    })) : []
            },
            mobile: {
                scores: {
                    performance: Math.round(mobileData.categories.performance.score * 100),
                    accessibility: Math.round(mobileData.categories.accessibility.score * 100),
                    bestPractices: Math.round(mobileData.categories['best-practices'].score * 100),
                    seo: Math.round(mobileData.categories.seo.score * 100),
                    pwa: Math.round(mobileData.categories.pwa.score * 100)
                },
                metrics: {
                    firstContentfulPaint: mobileData.audits['first-contentful-paint']?.displayValue || 'N/A',
                    largestContentfulPaint: mobileData.audits['largest-contentful-paint']?.displayValue || 'N/A',
                    speedIndex: mobileData.audits['speed-index']?.displayValue || 'N/A',
                    timeToInteractive: mobileData.audits['interactive']?.displayValue || 'N/A',
                    totalBlockingTime: mobileData.audits['total-blocking-time']?.displayValue || 'N/A',
                    cumulativeLayoutShift: mobileData.audits['cumulative-layout-shift']?.displayValue || 'N/A'
                },
                opportunities: mobileData.audits ? Object.keys(mobileData.audits)
                    .filter(key => mobileData.audits[key].details?.type === 'opportunity')
                    .map(key => ({
                        audit: key,
                        title: mobileData.audits[key].title,
                        description: mobileData.audits[key].description,
                        potentialSavings: mobileData.audits[key].details?.overallSavingsMs || 0
                    }))
                    .sort((a, b) => b.potentialSavings - a.potentialSavings) : [],
                diagnostics: mobileData.audits ? Object.keys(mobileData.audits)
                    .filter(key => mobileData.audits[key].details?.type === 'diagnostic' && mobileData.audits[key].score < 1)
                    .map(key => ({
                        audit: key,
                        title: mobileData.audits[key].title,
                        description: mobileData.audits[key].description,
                        score: mobileData.audits[key].score
                    })) : []
            }
        };

        // Save comprehensive analysis
        fs.writeFileSync(
            path.join(outputDir, `comprehensive-analysis-${timestamp}.json`),
            JSON.stringify(analysis, null, 2)
        );

        console.log('✅ Lighthouse audit completed successfully!');
        console.log('\n📊 Quick Summary:');
        console.log('Desktop Scores:', analysis.desktop.scores);
        console.log('Mobile Scores:', analysis.mobile.scores);
        
        return analysis;

    } catch (error) {
        console.error('❌ Error running Lighthouse audit:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runComprehensiveLighthouseAudit()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { runComprehensiveLighthouseAudit };