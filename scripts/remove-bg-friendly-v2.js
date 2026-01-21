/**
 * Remove background more aggressively - handles gradient backgrounds
 */

const sharp = require('sharp');
const path = require('path');

async function removeBackground() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly-nobg.png');
  
  console.log('🎨 Removing background (v2 - more aggressive)...');
  
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  
  const pixels = new Uint8Array(width * height * 4);
  
  // Sample corner pixels to get background color range
  // Top-left, top-right, bottom-left corners
  const samplePositions = [
    0, // top-left
    width - 1, // top-right
    (height - 1) * width, // bottom-left
    width * 10, // 10 pixels down on left
    width * 10 + width - 1, // 10 pixels down on right
  ];
  
  let bgSamples = samplePositions.map(pos => ({
    r: data[pos * 3],
    g: data[pos * 3 + 1],
    b: data[pos * 3 + 2]
  }));
  
  console.log('Background samples:', bgSamples);
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    // More aggressive: check if pixel is in the beige/cream/gray range
    // The background seems to be around 230-240 RGB with slight warmth
    const brightness = (r + g + b) / 3;
    const isLightEnough = brightness > 200;
    
    // Check if it's a neutral/warm gray (background color)
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const isNeutral = maxDiff < 25; // Allow some color variation
    
    // Background is light and relatively neutral
    const isBackground = isLightEnough && isNeutral && r > 200 && g > 195 && b > 190;
    
    pixels[i * 4] = r;
    pixels[i * 4 + 1] = g;
    pixels[i * 4 + 2] = b;
    pixels[i * 4 + 3] = isBackground ? 0 : 255;
  }
  
  await sharp(pixels, {
    raw: { width, height, channels: 4 }
  })
  .png()
  .toFile(outputPath);
  
  console.log(`✅ Saved: ${outputPath}`);
}

removeBackground().catch(console.error);
