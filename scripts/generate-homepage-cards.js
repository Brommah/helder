/**
 * Generate card background images for homepage using Gemini 3 Pro Image Preview
 * Same theme as woningpaspoort cards - soft, professional, subtle
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

const cards = [
  // Services Section (3 cards)
  {
    name: 'card-bg-woningpaspoort-service',
    prompt: `Subtle, soft 3D illustration of a house blueprint with floating document icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Home DNA concept, certificates, keys floating gently around a small house silhouette.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-ai-service',
    prompt: `Subtle, soft 3D illustration of AI brain with neural network connections.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Gentle glowing nodes, circuit patterns, brain-like structure floating.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-wkb-service',
    prompt: `Subtle, soft 3D illustration of compliance badges and checkmarks.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Official stamps, certificate ribbons, verification seals floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },

  // AI Section feature cards (4 cards)
  {
    name: 'card-bg-ai-planning',
    prompt: `Subtle, soft 3D illustration of a futuristic crystal ball with calendar icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Predictive elements, timeline arrows, future-looking visuals.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-ai-energy',
    prompt: `Subtle, soft 3D illustration of lightning bolt with energy efficiency icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Battery icons, power symbols, eco-friendly elements floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-ai-monitoring',
    prompt: `Subtle, soft 3D illustration of a protective shield with radar waves.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
24/7 monitoring concept, gentle pulse waves, watchful eye elements.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-ai-value',
    prompt: `Subtle, soft 3D illustration of rising graph with house icon.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Upward trending arrows, growth charts, value increase concept.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },

  // Process/Steps Section (4 cards)
  {
    name: 'card-bg-step-assessment',
    prompt: `Subtle, soft 3D illustration of a questionnaire with sparkle icons.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Clipboard, checkbox elements, discovery concept floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-step-design',
    prompt: `Subtle, soft 3D illustration of architectural blueprints and pencil.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Design tools, ruler, compass, creative elements floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-step-build',
    prompt: `Subtle, soft 3D illustration of construction crane and building blocks.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Hard hat, tools, rising structure elements floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-step-handover',
    prompt: `Subtle, soft 3D illustration of golden key with ribbon bow.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
House key, celebration confetti, completion badge floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },

  // Testimonials Section (3 cards)
  {
    name: 'card-bg-testimonial-1',
    prompt: `Subtle, soft 3D illustration of a happy home with hearts.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Cozy house, satisfaction elements, positive vibes floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-testimonial-2',
    prompt: `Subtle, soft 3D illustration of a piggy bank with coins.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Savings concept, money protection, financial security floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
  {
    name: 'card-bg-testimonial-3',
    prompt: `Subtle, soft 3D illustration of trust handshake with stars.
Very light, almost watermark-like opacity. Soft blue (#93b9e6) and white tones.
Partnership concept, reliability badge, quality assurance floating gently.
PURE WHITE BACKGROUND. Very subtle, meant as a decorative card background.
No text, no people. Elegant, professional, clean.`
  },
];

async function generateImage(card) {
  console.log(`\n🎨 Generating: ${card.name}...`);
  
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
    console.error(`❌ API Error for ${card.name}:`, error.substring(0, 200));
    return null;
  }

  const data = await response.json();
  
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
    return null;
  }

  const outputPath = path.join(__dirname, '..', 'public', 'images', 'cards', `${card.name}.png`);
  
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
  
  console.log(`✅ Saved: ${card.name}.png`);
  return outputPath;
}

async function main() {
  console.log('🏠 Generating homepage card background images...');
  console.log(`📝 Total cards to generate: ${cards.length}\n`);
  
  const results = [];
  for (const card of cards) {
    const result = await generateImage(card);
    if (result) results.push(result);
    await new Promise(r => setTimeout(r, 1500)); // Rate limiting
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Generated ${results.length}/${cards.length} images`);
  console.log('═══════════════════════════════════════\n');
}

main().catch(console.error);
