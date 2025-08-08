const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeConversionFunnel() {
    const url = 'http://localhost:3000';
    const outputDir = path.join(__dirname, 'conversion-analysis-results');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎯 Starting Conversion Funnel Analysis...');
    
    const browser = await chromium.launch({ headless: false });
    
    try {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        
        const page = await context.newPage();
        
        // Step 1: Landing Page Analysis
        console.log('📊 Analyzing Landing Page...');
        await page.goto(url, { waitUntil: 'networkidle' });
        
        await page.screenshot({ 
            path: path.join(outputDir, 'funnel-step1-landing.png'),
            fullPage: true 
        });

        const landingAnalysis = await page.evaluate(() => {
            // Analyze above-the-fold content
            const viewportHeight = window.innerHeight;
            const aboveFoldElements = Array.from(document.querySelectorAll('*')).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.top < viewportHeight;
            });

            // Count conversion elements above the fold
            const aboveFoldCTAs = aboveFoldElements.filter(el => 
                el.tagName === 'BUTTON' || 
                el.classList.contains('button') || 
                el.classList.toString().includes('btn') ||
                (el.tagName === 'A' && el.classList.toString().includes('cta'))
            );

            // Analyze value proposition clarity
            const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
                level: h.tagName,
                text: h.textContent.trim(),
                aboveFold: h.getBoundingClientRect().top < viewportHeight
            }));

            // Trust signals analysis
            const trustSignals = {
                testimonials: document.querySelectorAll('[class*="testimonial"], .review, [class*="review"]').length,
                logos: document.querySelectorAll('[class*="logo"], [alt*="logo"]').length,
                badges: document.querySelectorAll('[class*="badge"], [class*="award"], [class*="certification"]').length,
                securityIndicators: document.querySelectorAll('[class*="secure"], [class*="ssl"], [class*="verified"]').length,
                socialProof: document.querySelectorAll('[class*="users"], [class*="customers"], [class*="members"]').length
            };

            // Friction analysis
            const friction = {
                formFields: document.querySelectorAll('input, select, textarea').length,
                requiredFields: document.querySelectorAll('[required]').length,
                formSteps: document.querySelectorAll('[class*="step"], .progress, [class*="progress"]').length,
                loadingElements: document.querySelectorAll('[class*="loading"], [class*="spinner"]').length,
                popups: document.querySelectorAll('.modal, .popup, [class*="modal"], [class*="popup"]').length
            };

            // CTA analysis
            const ctas = Array.from(document.querySelectorAll('button, .button, [class*="btn"], input[type="submit"]')).map(cta => ({
                text: cta.textContent.trim() || cta.value || 'No text',
                type: cta.tagName,
                position: {
                    aboveFold: cta.getBoundingClientRect().top < viewportHeight,
                    distanceFromTop: cta.getBoundingClientRect().top
                },
                style: {
                    backgroundColor: window.getComputedStyle(cta).backgroundColor,
                    color: window.getComputedStyle(cta).color,
                    fontSize: window.getComputedStyle(cta).fontSize,
                    padding: window.getComputedStyle(cta).padding
                },
                isVisible: cta.offsetWidth > 0 && cta.offsetHeight > 0
            }));

            // Distraction analysis
            const distractions = {
                externalLinks: Array.from(document.querySelectorAll('a')).filter(link => 
                    link.href.startsWith('http') && !link.href.includes(window.location.hostname)
                ).length,
                navigationLinks: document.querySelectorAll('nav a, .nav a, [role="navigation"] a').length,
                socialMediaLinks: document.querySelectorAll('[href*="facebook"], [href*="twitter"], [href*="instagram"], [href*="linkedin"]').length,
                totalLinks: document.querySelectorAll('a').length
            };

            return {
                aboveFoldCTAs: aboveFoldCTAs.length,
                totalCTAs: ctas.length,
                headings,
                trustSignals,
                friction,
                ctas,
                distractions,
                pageStats: {
                    totalElements: document.getElementsByTagName('*').length,
                    totalText: document.body.innerText.length,
                    readingTime: Math.ceil(document.body.innerText.split(' ').length / 200) // WPM average
                }
            };
        });

        // Step 2: Form Interaction Analysis
        console.log('📝 Analyzing Form Interactions...');
        
        const formElements = await page.locator('input, select, textarea').all();
        const formAnalysis = {
            totalFields: formElements.length,
            fieldTypes: [],
            interactionFlow: [],
            validationBehavior: [],
            completionTime: 0
        };

        const startTime = Date.now();

        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            try {
                const fieldInfo = await element.evaluate(el => ({
                    type: el.type || el.tagName,
                    name: el.name,
                    placeholder: el.placeholder,
                    required: el.required,
                    id: el.id
                }));

                formAnalysis.fieldTypes.push(fieldInfo);

                // Test interaction
                await element.focus();
                await page.waitForTimeout(200);
                
                // Take screenshot of focused state
                if (i === 0) {
                    await page.screenshot({ 
                        path: path.join(outputDir, 'funnel-step2-form-focus.png'),
                        fullPage: false 
                    });
                }

                // Test input if applicable
                if (fieldInfo.type === 'email') {
                    await element.fill('test@example.com');
                    await page.waitForTimeout(200);
                } else if (fieldInfo.type === 'text' || fieldInfo.type === 'INPUT') {
                    await element.fill('Test Input');
                    await page.waitForTimeout(200);
                }

                // Check for validation
                const validationMessage = await page.evaluate((elementId) => {
                    const el = document.getElementById(elementId) || document.querySelector(`[name="${elementId}"]`);
                    return el ? el.validationMessage : '';
                }, fieldInfo.id || fieldInfo.name);

                formAnalysis.validationBehavior.push({
                    field: fieldInfo.name,
                    hasValidation: validationMessage.length > 0,
                    message: validationMessage
                });

                formAnalysis.interactionFlow.push({
                    step: i + 1,
                    field: fieldInfo.name,
                    interactionSuccessful: true,
                    timeSpent: 200 // Simulated
                });

            } catch (error) {
                formAnalysis.interactionFlow.push({
                    step: i + 1,
                    field: 'unknown',
                    interactionSuccessful: false,
                    error: error.message
                });
            }
        }

        const endTime = Date.now();
        formAnalysis.completionTime = endTime - startTime;

        // Step 3: Mobile Conversion Analysis
        console.log('📱 Analyzing Mobile Conversion...');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
            path: path.join(outputDir, 'funnel-step3-mobile.png'),
            fullPage: true 
        });

        const mobileAnalysis = await page.evaluate(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Touch target analysis
            const touchTargets = Array.from(document.querySelectorAll('button, a, input, [role="button"]')).map(el => {
                const rect = el.getBoundingClientRect();
                return {
                    element: el.tagName,
                    width: rect.width,
                    height: rect.height,
                    area: rect.width * rect.height,
                    meetsMobileStandards: rect.width >= 44 && rect.height >= 44,
                    position: {
                        top: rect.top,
                        left: rect.left
                    }
                };
            });

            // Mobile-specific friction
            const mobileFriction = {
                horizontalScrollNeeded: document.documentElement.scrollWidth > viewportWidth,
                elementsOffScreen: Array.from(document.querySelectorAll('*')).filter(el => 
                    el.getBoundingClientRect().right > viewportWidth
                ).length,
                textTooSmall: Array.from(document.querySelectorAll('*')).filter(el => {
                    const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
                    return fontSize < 14 && el.innerText && el.innerText.trim().length > 0;
                }).length
            };

            // Above-fold mobile analysis
            const mobileAboveFold = {
                visibleCTAs: touchTargets.filter(target => 
                    target.position.top >= 0 && target.position.top < viewportHeight
                ).length,
                visibleFormFields: Array.from(document.querySelectorAll('input, select, textarea')).filter(el =>
                    el.getBoundingClientRect().top >= 0 && el.getBoundingClientRect().top < viewportHeight
                ).length
            };

            return {
                touchTargets,
                mobileFriction,
                mobileAboveFold,
                viewport: { width: viewportWidth, height: viewportHeight }
            };
        });

        // Step 4: Success State Analysis
        console.log('✅ Analyzing Success State...');
        
        // Try to complete the form to see success state
        let successAnalysis = { attempted: false, successful: false };
        
        try {
            // Reset viewport to desktop
            await page.setViewportSize({ width: 1920, height: 1080 });
            
            // Fill out form with test data
            const emailField = page.locator('input[type="email"]').first();
            if (await emailField.count() > 0) {
                await emailField.fill('test@conversiontest.com');
                await page.waitForTimeout(500);
            }

            const nameField = page.locator('input[type="text"]').first();
            if (await nameField.count() > 0) {
                await nameField.fill('Test User');
                await page.waitForTimeout(500);
            }

            // Look for submit button
            const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Join"), button:has-text("Sign"), button:has-text("Submit")').first();
            if (await submitButton.count() > 0) {
                await submitButton.click();
                await page.waitForTimeout(2000);
                
                successAnalysis.attempted = true;
                
                await page.screenshot({ 
                    path: path.join(outputDir, 'funnel-step4-success.png'),
                    fullPage: true 
                });

                // Analyze success state
                const successStateAnalysis = await page.evaluate(() => {
                    return {
                        hasSuccessMessage: !!document.querySelector('[class*="success"], .thank, [class*="thank"], .confirmation, [class*="confirm"]'),
                        hasNextSteps: !!document.querySelector('[class*="next"], [class*="step"], .instructions'),
                        hasShareOptions: !!document.querySelector('[class*="share"], [href*="twitter"], [href*="facebook"]'),
                        currentUrl: window.location.href,
                        pageTitle: document.title,
                        successContent: Array.from(document.querySelectorAll('h1, h2, h3, p')).slice(0, 5).map(el => el.textContent.trim())
                    };
                });

                successAnalysis = { ...successAnalysis, ...successStateAnalysis, successful: true };
            }
        } catch (error) {
            successAnalysis.error = error.message;
        }

        // Compile comprehensive funnel analysis
        const funnelAnalysis = {
            timestamp: new Date().toISOString(),
            url,
            
            // Funnel Performance Metrics
            funnelMetrics: {
                landingPageScore: calculateLandingScore(landingAnalysis),
                formOptimizationScore: calculateFormScore(formAnalysis),
                mobileConversionScore: calculateMobileScore(mobileAnalysis),
                successStateScore: calculateSuccessScore(successAnalysis),
                overallConversionScore: 0 // Will be calculated
            },

            // Detailed Analysis
            landingPage: landingAnalysis,
            formExperience: formAnalysis,
            mobileExperience: mobileAnalysis,
            successState: successAnalysis,

            // Conversion Optimization Opportunities
            conversionOpportunities: [],
            frictionPoints: [],
            trustSignalGaps: [],
            mobileBarriers: []
        };

        // Calculate overall score
        const scores = Object.values(funnelAnalysis.funnelMetrics).filter(score => typeof score === 'number');
        funnelAnalysis.funnelMetrics.overallConversionScore = Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
        );

        // Identify opportunities and friction points
        funnelAnalysis.conversionOpportunities = identifyOpportunities(landingAnalysis, formAnalysis, mobileAnalysis);
        funnelAnalysis.frictionPoints = identifyFrictionPoints(landingAnalysis, formAnalysis, mobileAnalysis);
        funnelAnalysis.trustSignalGaps = identifyTrustGaps(landingAnalysis);
        funnelAnalysis.mobileBarriers = identifyMobileBarriers(mobileAnalysis);

        // Save results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(
            path.join(outputDir, `conversion-funnel-analysis-${timestamp}.json`),
            JSON.stringify(funnelAnalysis, null, 2)
        );

        console.log('✅ Conversion Funnel Analysis completed!');
        console.log(`Overall Conversion Score: ${funnelAnalysis.funnelMetrics.overallConversionScore}/100`);
        console.log(`Opportunities Identified: ${funnelAnalysis.conversionOpportunities.length}`);
        console.log(`Friction Points: ${funnelAnalysis.frictionPoints.length}`);
        
        return funnelAnalysis;

    } catch (error) {
        console.error('❌ Error during conversion funnel analysis:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Scoring functions
function calculateLandingScore(analysis) {
    let score = 100;
    
    // Penalize if no above-fold CTAs
    if (analysis.aboveFoldCTAs === 0) score -= 30;
    
    // Penalize weak trust signals
    const trustCount = Object.values(analysis.trustSignals).reduce((sum, count) => sum + count, 0);
    if (trustCount === 0) score -= 20;
    
    // Penalize too many distractions
    if (analysis.distractions.externalLinks > 5) score -= 15;
    if (analysis.distractions.totalLinks > 20) score -= 10;
    
    // Bonus for clear value prop
    const hasH1AboveFold = analysis.headings.some(h => h.level === 'H1' && h.aboveFold);
    if (hasH1AboveFold) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function calculateFormScore(analysis) {
    let score = 100;
    
    // Penalize too many fields
    if (analysis.totalFields > 5) score -= 20;
    if (analysis.totalFields > 8) score -= 30;
    
    // Penalize long completion time
    if (analysis.completionTime > 30000) score -= 15; // 30 seconds
    
    // Bonus for good validation
    const validationRatio = analysis.validationBehavior.filter(v => v.hasValidation).length / analysis.totalFields;
    if (validationRatio > 0.8) score += 10;
    
    // Penalize interaction failures
    const failureCount = analysis.interactionFlow.filter(i => !i.interactionSuccessful).length;
    score -= failureCount * 10;
    
    return Math.max(0, Math.min(100, score));
}

function calculateMobileScore(analysis) {
    let score = 100;
    
    // Penalize poor touch targets
    const poorTargets = analysis.touchTargets.filter(t => !t.meetsMobileStandards).length;
    score -= poorTargets * 10;
    
    // Penalize mobile friction
    if (analysis.mobileFriction.horizontalScrollNeeded) score -= 25;
    score -= analysis.mobileFriction.elementsOffScreen * 2;
    score -= analysis.mobileFriction.textTooSmall * 3;
    
    // Bonus for mobile-optimized above-fold
    if (analysis.mobileAboveFold.visibleCTAs > 0) score += 10;
    if (analysis.mobileAboveFold.visibleFormFields > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function calculateSuccessScore(analysis) {
    if (!analysis.attempted) return 50; // Neutral if couldn't test
    if (!analysis.successful) return 20; // Low if form submission failed
    
    let score = 80; // Base score for successful submission
    
    if (analysis.hasSuccessMessage) score += 10;
    if (analysis.hasNextSteps) score += 5;
    if (analysis.hasShareOptions) score += 5;
    
    return Math.min(100, score);
}

// Opportunity identification functions
function identifyOpportunities(landing, form, mobile) {
    const opportunities = [];
    
    if (landing.aboveFoldCTAs === 0) {
        opportunities.push({
            type: 'Above-fold CTA',
            priority: 'High',
            impact: 'High',
            description: 'Add prominent call-to-action above the fold',
            expectedLift: '15-25%'
        });
    }
    
    if (landing.trustSignals.testimonials === 0) {
        opportunities.push({
            type: 'Social Proof',
            priority: 'High',
            impact: 'Medium',
            description: 'Add customer testimonials or reviews',
            expectedLift: '10-15%'
        });
    }
    
    if (form.totalFields > 5) {
        opportunities.push({
            type: 'Form Simplification',
            priority: 'Medium',
            impact: 'High',
            description: 'Reduce form fields to essential only',
            expectedLift: '20-30%'
        });
    }
    
    const poorMobileTargets = mobile.touchTargets.filter(t => !t.meetsMobileStandards).length;
    if (poorMobileTargets > 0) {
        opportunities.push({
            type: 'Mobile Touch Targets',
            priority: 'High',
            impact: 'Medium',
            description: 'Increase touch target sizes for mobile',
            expectedLift: '5-10%'
        });
    }
    
    return opportunities;
}

function identifyFrictionPoints(landing, form, mobile) {
    const friction = [];
    
    if (landing.distractions.externalLinks > 3) {
        friction.push({
            type: 'Attention Leakage',
            severity: 'Medium',
            description: `${landing.distractions.externalLinks} external links creating distractions`,
            solution: 'Remove or minimize external links'
        });
    }
    
    if (form.totalFields > 6) {
        friction.push({
            type: 'Form Length',
            severity: 'High',
            description: `${form.totalFields} form fields may overwhelm users`,
            solution: 'Reduce to 3-5 essential fields'
        });
    }
    
    if (mobile.mobileFriction.horizontalScrollNeeded) {
        friction.push({
            type: 'Mobile Layout',
            severity: 'High',
            description: 'Horizontal scrolling required on mobile',
            solution: 'Fix responsive design layout'
        });
    }
    
    return friction;
}

function identifyTrustGaps(landing) {
    const gaps = [];
    
    if (landing.trustSignals.testimonials === 0) {
        gaps.push('No customer testimonials');
    }
    
    if (landing.trustSignals.securityIndicators === 0) {
        gaps.push('No security/trust badges');
    }
    
    if (landing.trustSignals.socialProof === 0) {
        gaps.push('No social proof indicators');
    }
    
    return gaps;
}

function identifyMobileBarriers(mobile) {
    const barriers = [];
    
    const poorTargets = mobile.touchTargets.filter(t => !t.meetsMobileStandards);
    if (poorTargets.length > 0) {
        barriers.push(`${poorTargets.length} touch targets too small for mobile`);
    }
    
    if (mobile.mobileFriction.elementsOffScreen > 0) {
        barriers.push(`${mobile.mobileFriction.elementsOffScreen} elements extending off-screen`);
    }
    
    if (mobile.mobileFriction.textTooSmall > 0) {
        barriers.push(`${mobile.mobileFriction.textTooSmall} text elements too small to read`);
    }
    
    return barriers;
}

if (require.main === module) {
    analyzeConversionFunnel()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { analyzeConversionFunnel };