const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeDesignSystem() {
    const url = 'http://localhost:3000';
    const outputDir = path.join(__dirname, 'design-system-analysis');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🎨 Starting Design System Analysis...');
    
    const browser = await chromium.launch({ headless: false });
    
    try {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Take full page screenshot for visual analysis
        await page.screenshot({ 
            path: path.join(outputDir, 'design-system-overview.png'),
            fullPage: true 
        });

        // Comprehensive design system analysis
        const designAnalysis = await page.evaluate(() => {
            // Color palette extraction
            const extractColors = () => {
                const colors = new Set();
                const elements = Array.from(document.querySelectorAll('*'));
                
                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const bgColor = style.backgroundColor;
                    const textColor = style.color;
                    const borderColor = style.borderColor;
                    
                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                        colors.add(bgColor);
                    }
                    if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
                        colors.add(textColor);
                    }
                    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
                        colors.add(borderColor);
                    }
                });
                
                return Array.from(colors);
            };

            // Typography analysis
            const analyzeTypography = () => {
                const typography = {
                    fontFamilies: new Set(),
                    fontSizes: new Set(),
                    fontWeights: new Set(),
                    lineHeights: new Set(),
                    headings: [],
                    bodyText: []
                };

                // Analyze headings
                const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                headings.forEach(heading => {
                    const style = window.getComputedStyle(heading);
                    typography.headings.push({
                        tag: heading.tagName,
                        text: heading.textContent.trim().substring(0, 50),
                        fontFamily: style.fontFamily,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight,
                        lineHeight: style.lineHeight,
                        color: style.color,
                        marginTop: style.marginTop,
                        marginBottom: style.marginBottom
                    });
                    
                    typography.fontFamilies.add(style.fontFamily);
                    typography.fontSizes.add(style.fontSize);
                    typography.fontWeights.add(style.fontWeight);
                    typography.lineHeights.add(style.lineHeight);
                });

                // Analyze body text
                const bodyElements = document.querySelectorAll('p, span, div, li');
                Array.from(bodyElements).slice(0, 20).forEach(el => {
                    if (el.textContent.trim().length > 10) {
                        const style = window.getComputedStyle(el);
                        typography.bodyText.push({
                            tag: el.tagName,
                            text: el.textContent.trim().substring(0, 50),
                            fontFamily: style.fontFamily,
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            lineHeight: style.lineHeight,
                            color: style.color
                        });
                        
                        typography.fontFamilies.add(style.fontFamily);
                        typography.fontSizes.add(style.fontSize);
                        typography.fontWeights.add(style.fontWeight);
                        typography.lineHeights.add(style.lineHeight);
                    }
                });

                return {
                    ...typography,
                    fontFamilies: Array.from(typography.fontFamilies),
                    fontSizes: Array.from(typography.fontSizes),
                    fontWeights: Array.from(typography.fontWeights),
                    lineHeights: Array.from(typography.lineHeights)
                };
            };

            // Spacing and layout analysis
            const analyzeSpacing = () => {
                const spacing = {
                    margins: new Set(),
                    paddings: new Set(),
                    gaps: new Set(),
                    borderRadius: new Set()
                };

                const elements = document.querySelectorAll('*');
                Array.from(elements).slice(0, 100).forEach(el => {
                    const style = window.getComputedStyle(el);
                    
                    // Collect margin values
                    spacing.margins.add(style.marginTop);
                    spacing.margins.add(style.marginBottom);
                    spacing.margins.add(style.marginLeft);
                    spacing.margins.add(style.marginRight);
                    
                    // Collect padding values
                    spacing.paddings.add(style.paddingTop);
                    spacing.paddings.add(style.paddingBottom);
                    spacing.paddings.add(style.paddingLeft);
                    spacing.paddings.add(style.paddingRight);
                    
                    // Collect gap values
                    if (style.gap && style.gap !== 'normal') {
                        spacing.gaps.add(style.gap);
                    }
                    
                    // Collect border radius values
                    if (style.borderRadius && style.borderRadius !== '0px') {
                        spacing.borderRadius.add(style.borderRadius);
                    }
                });

                return {
                    margins: Array.from(spacing.margins).filter(m => m !== '0px'),
                    paddings: Array.from(spacing.paddings).filter(p => p !== '0px'),
                    gaps: Array.from(spacing.gaps),
                    borderRadius: Array.from(spacing.borderRadius)
                };
            };

            // Component analysis
            const analyzeComponents = () => {
                return {
                    buttons: Array.from(document.querySelectorAll('button, .button, [class*="btn"]')).map(btn => {
                        const style = window.getComputedStyle(btn);
                        return {
                            text: btn.textContent.trim(),
                            classes: btn.className,
                            backgroundColor: style.backgroundColor,
                            color: style.color,
                            borderRadius: style.borderRadius,
                            padding: style.padding,
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            border: style.border,
                            cursor: style.cursor
                        };
                    }),
                    
                    inputs: Array.from(document.querySelectorAll('input, textarea, select')).map(input => {
                        const style = window.getComputedStyle(input);
                        return {
                            type: input.type || input.tagName,
                            placeholder: input.placeholder,
                            classes: input.className,
                            backgroundColor: style.backgroundColor,
                            color: style.color,
                            borderRadius: style.borderRadius,
                            padding: style.padding,
                            fontSize: style.fontSize,
                            border: style.border,
                            width: style.width,
                            height: style.height
                        };
                    }),
                    
                    cards: Array.from(document.querySelectorAll('.card, [class*="card"], .panel, [class*="panel"]')).map(card => {
                        const style = window.getComputedStyle(card);
                        return {
                            classes: card.className,
                            backgroundColor: style.backgroundColor,
                            borderRadius: style.borderRadius,
                            padding: style.padding,
                            margin: style.margin,
                            boxShadow: style.boxShadow,
                            border: style.border
                        };
                    })
                };
            };

            // Layout analysis
            const analyzeLayout = () => {
                const bodyStyle = window.getComputedStyle(document.body);
                const mainContent = document.querySelector('main, .container, .wrapper') || document.body;
                const mainStyle = window.getComputedStyle(mainContent);

                return {
                    layoutMethod: {
                        flexbox: Array.from(document.querySelectorAll('*')).some(el => 
                            window.getComputedStyle(el).display.includes('flex')
                        ),
                        grid: Array.from(document.querySelectorAll('*')).some(el => 
                            window.getComputedStyle(el).display.includes('grid')
                        ),
                        float: Array.from(document.querySelectorAll('*')).some(el => 
                            window.getComputedStyle(el).float !== 'none'
                        )
                    },
                    
                    bodyStyles: {
                        backgroundColor: bodyStyle.backgroundColor,
                        fontFamily: bodyStyle.fontFamily,
                        fontSize: bodyStyle.fontSize,
                        lineHeight: bodyStyle.lineHeight,
                        color: bodyStyle.color,
                        margin: bodyStyle.margin,
                        padding: bodyStyle.padding
                    },
                    
                    mainContainer: {
                        maxWidth: mainStyle.maxWidth,
                        width: mainStyle.width,
                        margin: mainStyle.margin,
                        padding: mainStyle.padding,
                        display: mainStyle.display
                    },
                    
                    breakpoints: {
                        hasMediaQueries: document.styleSheets.length > 0 // Simplified check
                    }
                };
            };

            // Accessibility analysis
            const analyzeAccessibility = () => {
                return {
                    colorContrast: {
                        // This would need a proper contrast calculation
                        potentialIssues: Array.from(document.querySelectorAll('*')).slice(0, 20).map(el => {
                            const style = window.getComputedStyle(el);
                            return {
                                element: el.tagName,
                                backgroundColor: style.backgroundColor,
                                color: style.color,
                                // Note: Real contrast calculation would go here
                                needsAnalysis: true
                            };
                        })
                    },
                    
                    focusIndicators: {
                        customFocusStyles: Array.from(document.querySelectorAll('*')).some(el => {
                            const style = window.getComputedStyle(el);
                            return style.outline !== 'none' && style.outline !== 'invert none medium';
                        }),
                        focusableElements: document.querySelectorAll('input, button, select, textarea, a, [tabindex]').length
                    },
                    
                    semanticStructure: {
                        landmarks: document.querySelectorAll('header, nav, main, section, aside, footer, [role]').length,
                        headingHierarchy: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
                            level: h.tagName,
                            text: h.textContent.trim().substring(0, 30)
                        }))
                    }
                };
            };

            return {
                colors: extractColors(),
                typography: analyzeTypography(),
                spacing: analyzeSpacing(),
                components: analyzeComponents(),
                layout: analyzeLayout(),
                accessibility: analyzeAccessibility(),
                
                // Meta information
                meta: {
                    totalElements: document.getElementsByTagName('*').length,
                    totalStylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
                    totalInlineStyles: document.querySelectorAll('[style]').length,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
            };
        });

        // Test responsive behavior
        console.log('📱 Testing responsive design...');
        const breakpoints = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1920, height: 1080 }
        ];

        const responsiveAnalysis = {};

        for (const breakpoint of breakpoints) {
            await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(outputDir, `responsive-${breakpoint.name.toLowerCase()}.png`),
                fullPage: false 
            });

            const viewportAnalysis = await page.evaluate((bp) => {
                return {
                    breakpoint: bp.name,
                    viewport: { width: window.innerWidth, height: window.innerHeight },
                    elementsOffScreen: Array.from(document.querySelectorAll('*')).filter(el => 
                        el.getBoundingClientRect().right > window.innerWidth ||
                        el.getBoundingClientRect().left < 0
                    ).length,
                    horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
                    verticalScroll: document.documentElement.scrollHeight > window.innerHeight,
                    touchTargets: Array.from(document.querySelectorAll('button, a, input, [role="button"]')).map(el => {
                        const rect = el.getBoundingClientRect();
                        return {
                            width: rect.width,
                            height: rect.height,
                            meetsMobileStandards: rect.width >= 44 && rect.height >= 44
                        };
                    })
                };
            }, breakpoint);

            responsiveAnalysis[breakpoint.name] = viewportAnalysis;
        }

        // Compile comprehensive design system analysis
        const comprehensiveAnalysis = {
            timestamp: new Date().toISOString(),
            url,
            designSystem: designAnalysis,
            responsive: responsiveAnalysis,
            
            // Design System Evaluation Scores
            scores: {
                colorConsistency: evaluateColorConsistency(designAnalysis.colors),
                typographyConsistency: evaluateTypographyConsistency(designAnalysis.typography),
                spacingConsistency: evaluateSpacingConsistency(designAnalysis.spacing),
                componentConsistency: evaluateComponentConsistency(designAnalysis.components),
                responsiveDesign: evaluateResponsiveDesign(responsiveAnalysis),
                accessibilityCompliance: evaluateAccessibilityCompliance(designAnalysis.accessibility),
                overallDesignSystemScore: 0 // Will be calculated
            }
        };

        // Calculate overall design system score
        const scores = Object.values(comprehensiveAnalysis.scores).filter(score => typeof score === 'number');
        comprehensiveAnalysis.scores.overallDesignSystemScore = Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
        );

        // Save results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.writeFileSync(
            path.join(outputDir, `design-system-analysis-${timestamp}.json`),
            JSON.stringify(comprehensiveAnalysis, null, 2)
        );

        console.log('✅ Design System Analysis completed!');
        console.log(`Overall Design System Score: ${comprehensiveAnalysis.scores.overallDesignSystemScore}/100`);
        
        return comprehensiveAnalysis;

    } catch (error) {
        console.error('❌ Error during design system analysis:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Evaluation functions
function evaluateColorConsistency(colors) {
    let score = 100;
    
    // Penalize too many colors (suggests inconsistency)
    if (colors.length > 15) score -= 20;
    if (colors.length > 25) score -= 30;
    
    // Bonus for reasonable color palette
    if (colors.length >= 5 && colors.length <= 12) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function evaluateTypographyConsistency(typography) {
    let score = 100;
    
    // Penalize too many font families
    if (typography.fontFamilies.length > 3) score -= 20;
    
    // Penalize too many font sizes (suggests inconsistency)
    if (typography.fontSizes.length > 8) score -= 15;
    
    // Penalize too many font weights
    if (typography.fontWeights.length > 4) score -= 10;
    
    // Bonus for good heading hierarchy
    if (typography.headings.length > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function evaluateSpacingConsistency(spacing) {
    let score = 100;
    
    // Penalize too many unique spacing values
    const totalUniqueValues = spacing.margins.length + spacing.paddings.length;
    if (totalUniqueValues > 20) score -= 20;
    if (totalUniqueValues > 30) score -= 30;
    
    // Bonus for border radius consistency
    if (spacing.borderRadius.length <= 5) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

function evaluateComponentConsistency(components) {
    let score = 100;
    
    // Analyze button consistency
    const buttonStyles = components.buttons.map(b => `${b.backgroundColor}-${b.color}-${b.borderRadius}`);
    const uniqueButtonStyles = new Set(buttonStyles);
    if (buttonStyles.length > 0 && uniqueButtonStyles.size > buttonStyles.length * 0.7) {
        score -= 15; // Too many different button styles
    }
    
    // Analyze input consistency
    const inputStyles = components.inputs.map(i => `${i.backgroundColor}-${i.borderRadius}-${i.border}`);
    const uniqueInputStyles = new Set(inputStyles);
    if (inputStyles.length > 0 && uniqueInputStyles.size > inputStyles.length * 0.8) {
        score -= 10; // Too many different input styles
    }
    
    return Math.max(0, Math.min(100, score));
}

function evaluateResponsiveDesign(responsive) {
    let score = 100;
    
    Object.values(responsive).forEach(analysis => {
        // Penalize horizontal scrolling
        if (analysis.horizontalScroll) score -= 20;
        
        // Penalize elements off-screen
        score -= analysis.elementsOffScreen * 2;
        
        // Penalize poor touch targets on mobile
        if (analysis.breakpoint === 'Mobile') {
            const poorTargets = analysis.touchTargets.filter(t => !t.meetsMobileStandards);
            score -= poorTargets.length * 5;
        }
    });
    
    return Math.max(0, Math.min(100, score));
}

function evaluateAccessibilityCompliance(accessibility) {
    let score = 100;
    
    // Check focus indicators
    if (!accessibility.focusIndicators.customFocusStyles) score -= 15;
    
    // Check semantic structure
    if (accessibility.semanticStructure.landmarks < 3) score -= 10;
    if (accessibility.semanticStructure.headingHierarchy.length === 0) score -= 15;
    
    return Math.max(0, Math.min(100, score));
}

if (require.main === module) {
    analyzeDesignSystem()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { analyzeDesignSystem };