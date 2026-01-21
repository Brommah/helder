/**
 * Remove white/near-white backgrounds from images
 * Converts white pixels to transparent
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'house-dna-v1-helix.jpg',
  'house-dna-v2-floating.jpg', 
  'house-dna-v3-house.jpg',
  'house-dna-v4-abstract.jpg',
  'house-dna-friendly.jpg'
];

async function removeWhiteBackground(inputPath, outputPath) {
  console.log(`Processing: ${path.basename(inputPath)}...`);
  
  try {
    // Read the image
    const image = sharp(inputPath);
    const { width, height } = await image.metadata();
    
    // Get raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Create alpha channel - make white/near-white pixels transparent
    const pixels = new Uint8Array(width * height * 4);
    
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 3];
      const g = data[i * 3 + 1];
      const b = data[i * 3 + 2];
      
      // Check if pixel is white or near-white (threshold: 245)
      const isWhite = r > 245 && g > 245 && b > 245;
      // Also check for light gray backgrounds
      const isLightGray = r > 235 && g > 235 && b > 235 && 
                          Math.abs(r - g) < 10 && Math.abs(g - b) < 10;
      
      pixels[i * 4] = r;
      pixels[i * 4 + 1] = g;
      pixels[i * 4 + 2] = b;
      pixels[i * 4 + 3] = (isWhite || isLightGray) ? 0 : 255; // Alpha: 0 = transparent
    }
    
    // Create new image with alpha channel
    await sharp(pixels, {
      raw: {
        width,
        height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log(`✅ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🎨 Removing white backgrounds from images...\n');
  
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  let processed = 0;
  
  for (const imageName of images) {
    const inputPath = path.join(imagesDir, imageName);
    const outputName = imageName.replace('.jpg', '.png');
    const outputPath = path.join(imagesDir, outputName);
    
    if (fs.existsSync(inputPath)) {
      const success = await removeWhiteBackground(inputPath, outputPath);
      if (success) processed++;
    } else {
      console.log(`⚠️ Not found: ${imageName}`);
    }
  }
  
  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ Processed ${processed}/${images.length} images`);
  console.log(`═══════════════════════════════════════\n`);
  
  console.log('📝 PNG files with transparent backgrounds:');
  images.forEach(img => {
    const pngName = img.replace('.jpg', '.png');
    console.log(`  - /images/${pngName}`);
  });
}

main().catch(console.error);
