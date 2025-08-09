const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920
};

const QUALITY = {
  webp: 85,
  jpeg: 90
};

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  console.log(`🎨 Optimizing ${filename}...`);
  
  // Create output directories
  for (const size of Object.keys(BREAKPOINTS)) {
    await fs.mkdir(path.join(outputDir, size), { recursive: true });
  }
  
  // Process each breakpoint
  for (const [sizeName, width] of Object.entries(BREAKPOINTS)) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Don't upscale images
    const targetWidth = Math.min(width, metadata.width);
    
    // WebP version
    await image
      .resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputDir, sizeName, `${filename}.webp`));
    
    // JPEG fallback
    await image
      .resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: QUALITY.jpeg, progressive: true })
      .toFile(path.join(outputDir, sizeName, `${filename}.jpg`));
    
    // Get file sizes
    const webpStats = await fs.stat(path.join(outputDir, sizeName, `${filename}.webp`));
    const jpegStats = await fs.stat(path.join(outputDir, sizeName, `${filename}.jpg`));
    
    console.log(`  ✅ ${sizeName}: WebP ${(webpStats.size / 1024).toFixed(0)}KB, JPEG ${(jpegStats.size / 1024).toFixed(0)}KB`);
  }
  
  // Get original size
  const originalStats = await fs.stat(inputPath);
  console.log(`  📊 Original: ${(originalStats.size / 1024 / 1024).toFixed(2)}MB`);
}

// Process all images in aquascaping folder
async function optimizeAllImages() {
  const inputDir = path.join(__dirname, '../public/images/aquascaping');
  const outputDir = path.join(__dirname, '../public/images/optimized');
  
  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    
    console.log(`Found ${imageFiles.length} images to optimize\n`);
    
    for (const file of imageFiles) {
      await optimizeImage(
        path.join(inputDir, file),
        outputDir
      );
      console.log('');
    }
    
    console.log('✨ All images optimized successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeAllImages();
}

module.exports = { optimizeImage, optimizeAllImages };