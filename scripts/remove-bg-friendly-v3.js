/**
 * Remove beige/cream background - tuned to exact background color
 */

const sharp = require('sharp');
const path = require('path');

async function removeBackground() {
  const inputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly.jpg');
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly-nobg.png');
  
  console.log('🎨 Removing beige background (v3)...');
  
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();
  
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });
  
  const pixels = new Uint8Array(width * height * 4);
  
  // Target background color: around (215, 203, 193) - warm beige
  const bgR = 215, bgG = 203, bgB = 193;
  const tolerance = 35; // How far from background color to still count as background
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    
    // Calculate distance from background color
    const dist = Math.sqrt(
      Math.pow(r - bgR, 2) + 
      Math.pow(g - bgG, 2) + 
      Math.pow(b - bgB, 2)
    );
    
    // Also check if it's generally light and neutral (catches gradient variations)
    const brightness = (r + g + b) / 3;
    const isLight = brightness > 190;
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;
    const isDesaturated = saturation < 0.15;
    
    const isBackground = dist < tolerance || (isLight && isDesaturated && r > 190);
    
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
