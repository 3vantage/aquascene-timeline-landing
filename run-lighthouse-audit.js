const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit() {
    const url = 'http://localhost:3000';
    const outputDir = path.join(__dirname, 'lighthouse-results');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    console.log('🚀 Running Lighthouse Desktop Audit...');
    
    // Desktop audit
    await new Promise((resolve, reject) => {
        const lighthouse = spawn('npx', [
            'lighthouse',
            url,
            '--output=html,json',
            '--output-path=' + path.join(outputDir, `desktop-${timestamp}`),
            '--preset=desktop',
            '--chrome-flags=--headless',
            '--only-categories=performance,accessibility,best-practices,seo,pwa'
        ]);

        lighthouse.stdout.on('data', (data) => {
            console.log('Desktop:', data.toString());
        });

        lighthouse.stderr.on('data', (data) => {
            console.error('Desktop Error:', data.toString());
        });

        lighthouse.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Desktop audit completed');
                resolve();
            } else {
                reject(new Error(`Desktop audit failed with code ${code}`));
            }
        });
    });

    console.log('📱 Running Lighthouse Mobile Audit...');
    
    // Mobile audit
    await new Promise((resolve, reject) => {
        const lighthouse = spawn('npx', [
            'lighthouse',
            url,
            '--output=html,json',
            '--output-path=' + path.join(outputDir, `mobile-${timestamp}`),
            '--preset=mobile',
            '--chrome-flags=--headless',
            '--only-categories=performance,accessibility,best-practices,seo,pwa'
        ]);

        lighthouse.stdout.on('data', (data) => {
            console.log('Mobile:', data.toString());
        });

        lighthouse.stderr.on('data', (data) => {
            console.error('Mobile Error:', data.toString());
        });

        lighthouse.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Mobile audit completed');
                resolve();
            } else {
                reject(new Error(`Mobile audit failed with code ${code}`));
            }
        });
    });

    // Parse results and create analysis
    const desktopJsonPath = path.join(outputDir, `desktop-${timestamp}.report.json`);
    const mobileJsonPath = path.join(outputDir, `mobile-${timestamp}.report.json`);
    
    let analysis = { timestamp, url };
    
    if (fs.existsSync(desktopJsonPath)) {
        const desktopData = JSON.parse(fs.readFileSync(desktopJsonPath, 'utf8'));
        analysis.desktop = parseResults(desktopData);
    }
    
    if (fs.existsSync(mobileJsonPath)) {
        const mobileData = JSON.parse(fs.readFileSync(mobileJsonPath, 'utf8'));
        analysis.mobile = parseResults(mobileData);
    }

    // Save analysis
    fs.writeFileSync(
        path.join(outputDir, `analysis-${timestamp}.json`),
        JSON.stringify(analysis, null, 2)
    );

    console.log('✅ Lighthouse audit completed successfully!');
    
    if (analysis.desktop && analysis.mobile) {
        console.log('\n📊 Quick Summary:');
        console.log('Desktop Scores:', analysis.desktop.scores);
        console.log('Mobile Scores:', analysis.mobile.scores);
    }
    
    return analysis;
}

function parseResults(data) {
    return {
        scores: {
            performance: Math.round(data.categories.performance.score * 100),
            accessibility: Math.round(data.categories.accessibility.score * 100),
            bestPractices: Math.round(data.categories['best-practices'].score * 100),
            seo: Math.round(data.categories.seo.score * 100),
            pwa: Math.round(data.categories.pwa.score * 100)
        },
        metrics: {
            firstContentfulPaint: data.audits['first-contentful-paint']?.displayValue || 'N/A',
            largestContentfulPaint: data.audits['largest-contentful-paint']?.displayValue || 'N/A',
            speedIndex: data.audits['speed-index']?.displayValue || 'N/A',
            timeToInteractive: data.audits['interactive']?.displayValue || 'N/A',
            totalBlockingTime: data.audits['total-blocking-time']?.displayValue || 'N/A',
            cumulativeLayoutShift: data.audits['cumulative-layout-shift']?.displayValue || 'N/A'
        },
        opportunities: data.audits ? Object.keys(data.audits)
            .filter(key => data.audits[key].details?.type === 'opportunity')
            .map(key => ({
                audit: key,
                title: data.audits[key].title,
                description: data.audits[key].description,
                potentialSavings: data.audits[key].details?.overallSavingsMs || 0
            }))
            .sort((a, b) => b.potentialSavings - a.potentialSavings)
            .slice(0, 10) : [],
        diagnostics: data.audits ? Object.keys(data.audits)
            .filter(key => data.audits[key].details?.type === 'diagnostic' && data.audits[key].score !== null && data.audits[key].score < 1)
            .map(key => ({
                audit: key,
                title: data.audits[key].title,
                description: data.audits[key].description,
                score: data.audits[key].score
            }))
            .slice(0, 10) : []
    };
}

if (require.main === module) {
    runLighthouseAudit()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { runLighthouseAudit };