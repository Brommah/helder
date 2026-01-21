/**
 * Generate House DNA image variations using Google Imagen 4
 * Multiple soft, friendly variations with clean/white backgrounds
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

const variations = [
  {
    name: 'house-dna-v1-helix',
    prompt: `A soft, friendly 3D illustration of a glowing DNA helix made of home-related icons: keys, documents, lightbulbs, tools, warranty badges. 
The helix floats elegantly with soft ambient lighting. 
Pastel colors: soft blue (#93b9e6), warm cream, gentle amber glow.
Style: modern 3D render, soft shadows, rounded friendly shapes.
PURE WHITE BACKGROUND - completely clean, no gradient, no floor, no shadows on background.
No text, no people. Minimalist and elegant.`
  },
  {
    name: 'house-dna-v2-floating',
    prompt: `Soft 3D illustration of organized floating home documents and icons arranged in a gentle spiral pattern.
Elements include: glowing folder icons, key icons, certificate badges, small house icon in center.
Everything feels organized, findable, peaceful.
Soft pastel blue (#93b9e6), cream white, touch of warm amber.
Modern 3D clay render style, rounded corners, soft lighting.
PURE WHITE BACKGROUND - completely clean and empty.
No text, no people, no floor shadows.`
  },
  {
    name: 'house-dna-v3-house',
    prompt: `A cute, friendly 3D isometric house with transparent walls showing organized glowing elements inside.
Small floating document icons, keys, and certificates orbit gently around the house.
Soft warm light emanating from within.
Colors: soft blue (#93b9e6), warm white, cream, gentle amber.
Style: modern 3D illustration, soft clay render, very friendly and approachable.
PURE WHITE BACKGROUND - no ground, no shadows, completely clean.
No text, no people.`
  },
  {
    name: 'house-dna-v4-abstract',
    prompt: `Abstract 3D visualization of a home's digital memory - soft glowing orbs connected by gentle light trails.
Each orb contains a tiny icon: document, key, warranty, photo, certificate.
Arranged in an organic, flowing pattern suggesting organization and accessibility.
Colors: primary soft blue (#93b9e6), secondary warm cream, accents of gentle amber.
Style: modern abstract 3D, soft focus, dreamy but clear.
PURE WHITE BACKGROUND - completely empty and clean.
No text, no people, no hard shadows.`
  }
];

async function generateImage(variation) {
  console.log(`\n🎨 Generating: ${variation.name}...`);
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: variation.prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '4:3',
          personGeneration: 'dont_allow',
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ API Error for ${variation.name}:`, error);
    return null;
  }

  const data = await response.json();
  
  if (!data.predictions || data.predictions.length === 0) {
    console.error(`❌ No image generated for ${variation.name}`);
    return null;
  }

  const imageData = data.predictions[0].bytesBase64Encoded;
  const outputPath = path.join(__dirname, '..', 'public', 'images', `${variation.name}.jpg`);
  
  fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
  
  console.log(`✅ Saved: ${outputPath}`);
  return outputPath;
}

async function main() {
  console.log('🏠 Generating House DNA image variations...\n');
  
  const results = [];
  for (const variation of variations) {
    const result = await generateImage(variation);
    if (result) results.push(result);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Generated ${results.length}/${variations.length} images`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('Generated files:');
  results.forEach(r => console.log(`  - ${path.basename(r)}`));
  
  console.log('\n📝 To use in page.tsx, change the image src to one of:');
  variations.forEach(v => console.log(`  - /images/${v.name}.jpg`));
}

main().catch(console.error);
