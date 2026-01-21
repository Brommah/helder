/**
 * Generate subtle card background images using Gemini 3 Pro Image Preview
 * (Nano Banana Pro) - Professional asset production with advanced reasoning
 * Theme: Soft, professional home documentation visuals
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

const cards = [
  {
    name: 'card-bg-documenten',
    prompt: `Subtle, soft 3D illustration of floating document papers and folders.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Gentle shadows, modern minimalist style. Documents gently floating/scattered.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-facturen',
    prompt: `Subtle, soft 3D illustration of invoice/receipt papers with euro symbols.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Calculator icon, receipt tape, gentle floating elements.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-garanties',
    prompt: `Subtle, soft 3D illustration of warranty badges and shield icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Certificate ribbons, checkmark badges, protection symbols floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-contacten',
    prompt: `Subtle, soft 3D illustration of contact cards and connection icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Business cards, phone icons, email symbols floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-materialen',
    prompt: `Subtle, soft 3D illustration of construction materials and swatches.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Paint swatches, wood grain samples, tile pieces floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-onderhoud',
    prompt: `Subtle, soft 3D illustration of maintenance tools and calendar icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Wrench, screwdriver, calendar with checkmarks floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  }
];

async function generateImage(card) {
  console.log(`\n🎨 Generating: ${card.name}...`);
  
  // Using Gemini 3 Pro Image Preview (Nano Banana Pro) for professional asset production
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a square 1:1 aspect ratio image: ${card.prompt}`
          }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT']
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ API Error for ${card.name}:`, error);
    return null;
  }

  const data = await response.json();
  
  // Find the image part in the response
  let imageData = null;
  if (data.candidates && data.candidates[0]?.content?.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        break;
      }
    }
  }
  
  if (!imageData) {
    console.error(`❌ No image generated for ${card.name}`);
    console.error('Response:', JSON.stringify(data, null, 2).substring(0, 500));
    return null;
  }
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'cards', `${card.name}.png`);
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
  
  console.log(`✅ Saved: ${outputPath}`);
  return outputPath;
}

async function main() {
  console.log('🏠 Generating card background images...\n');
  
  const results = [];
  for (const card of cards) {
    const result = await generateImage(card);
    if (result) results.push(result);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Generated ${results.length}/${cards.length} images`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('Generated files:');
  results.forEach(r => console.log(`  - ${path.basename(r)}`));
}

main().catch(console.error);
