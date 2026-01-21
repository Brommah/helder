/**
 * Remove the beige/gray background from house-dna-friendly.jpg
 */

const sharp = require('sharp');
const path = require('path');

async function removeBackground() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly-nobg.png');
  
  console.log('🎨 Removing background from house-dna-friendly.jpg...');
  
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  
  // Create RGBA buffer
  const pixels = new Uint8Array(width * height * 4);
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    // The background is a light beige/gray color (around RGB 235-245, 230-240, 225-235)
    // Check if pixel is close to that background color
    const isBackground = 
      r > 220 && r < 250 &&
      g > 215 && g < 245 &&
      b > 210 && b < 240 &&
      Math.abs(r - g) < 15 &&
      Math.abs(g - b) < 15;
    
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
