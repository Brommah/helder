/**
 * AI Intelligence Page - CLEAN Minimal Image Generation
 * Using Gemini 3 Pro Image Preview
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is required');
  console.error('   Get your key at: https://aistudio.google.com/app/apikey');
  process.exit(1);
}
const MODEL = 'gemini-3-pro-image-preview';

const outputDir = path.join(__dirname, '..', 'public', 'images', 'ai');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const IMAGES_TO_GENERATE = [
  // Hero - Clean abstract
  {
    name: 'hero-ai-brain.jpg',
    prompt: `Minimalist abstract visualization. 
    Single glowing golden orb representing AI intelligence, 
    floating in vast dark navy blue (#1a1a2e) empty space.
    Subtle geometric line connecting to a simple house outline below.
    Ultra clean, lots of negative space, zen-like simplicity.
    No clutter, no busy elements. One focal point.
    Premium tech aesthetic like Apple marketing.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'dna-helix.jpg',
    prompt: `Extremely minimal DNA strand visualization.
    Single elegant double helix made of thin golden lines,
    against pure dark navy background.
    Only the helix, nothing else. Clean white space around it.
    Subtle glow effect. Scientific elegance.
    Museum-quality minimalism. No text, no icons, no clutter.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'predictive-dashboard.jpg',
    prompt: `Clean minimal smart home concept.
    Single white modern house silhouette in center,
    with one thin golden circle orbiting around it.
    Dark gradient background from navy to black.
    Extreme minimalism, vast empty space.
    Like a Dieter Rams design. Nothing extra.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'neural-network-house.jpg',
    prompt: `Abstract minimal visualization.
    Simple geometric house shape made of connected dots and lines,
    like a constellation in night sky.
    Dark navy background, golden/amber connection points.
    Very few nodes, very clean. Elegant simplicity.
    No background elements, just the house constellation.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'savings-visualization.jpg',
    prompt: `Ultra minimal finance concept.
    Single golden euro symbol, simple and elegant,
    with subtle upward arrow beside it.
    Clean white background with barely visible gradient.
    Nothing else in frame. Maximum negative space.
    Premium financial brand aesthetic.`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'resale-comparison.jpg',
    prompt: `Clean split composition.
    Left: simple grey house outline, muted.
    Right: same house outline in golden/amber, glowing softly.
    Minimal dividing line in center.
    Dark background. No text, no icons, no charts.
    Just the two houses showing contrast. Elegant simplicity.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'lifecycle-timeline.jpg',
    prompt: `Minimal horizontal timeline.
    Single thin golden line stretching across dark background,
    with 5 small glowing dots evenly spaced.
    Nothing else. No labels, no icons, no complexity.
    Clean like a luxury watch advertisement.
    Vast negative space above and below.`,
    aspectRatio: '21:9',
    resolution: '2K'
  },
  {
    name: 'ai-maintenance-alert.jpg',
    prompt: `Simple notification concept.
    Single small amber/golden bell icon in center,
    with one subtle pulse ring around it.
    Dark navy background, lots of empty space.
    Clean iOS notification aesthetic.
    No house, no text, just the elegant bell.`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'blockchain-verification.jpg',
    prompt: `Minimal security concept.
    Single golden checkmark inside a thin circle,
    against dark navy background.
    Clean, geometric, simple.
    Like a luxury brand verification badge.
    No chains, no blocks, no complexity. Just trust.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'energy-optimization.jpg',
    prompt: `Clean energy concept.
    Single thin lightning bolt in golden/amber,
    elegant and minimal against dark background.
    Subtle glow. No house, no solar panels, no complexity.
    Just the pure symbol of energy efficiency.
    Premium minimalist design.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'warranty-shield.jpg',
    prompt: `Minimal protection concept.
    Single elegant shield outline in golden lines,
    against dark navy background.
    Thin strokes, geometric precision.
    No house inside, no badges, no text.
    Pure symbolic representation. Museum-quality minimal.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'smart-home-cutaway.jpg',
    prompt: `Elegant architectural visualization.
    Simple modern house cross-section, white lines on dark background.
    Clean architectural drawing style, no colors except subtle golden accents.
    Minimal details, focus on clean geometry.
    Like a high-end architecture portfolio piece.
    No people, no furniture clutter.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
];

async function generateImage(imageConfig) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      contents: [{
        parts: [{
          text: imageConfig.prompt
        }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: imageConfig.aspectRatio || '1:1',
          imageSize: imageConfig.resolution || '1K'
        }
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`API Error: ${response.error.message}`));
            return;
          }

          const candidates = response.candidates || [];
          for (const candidate of candidates) {
            const parts = candidate.content?.parts || [];
            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                resolve({
                  data: part.inlineData.data,
                  mimeType: part.inlineData.mimeType
                });
                return;
              }
            }
          }
          
          reject(new Error('No image in response'));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Request error: ${e.message}`));
    });

    req.write(requestBody);
    req.end();
  });
}

function saveImage(base64Data, filePath) {
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Saved: ${filePath}`);
}

async function main() {
  console.log('🎨 CLEAN Minimal Image Generation');
  console.log('==================================');
  console.log(`Total images: ${IMAGES_TO_GENERATE.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < IMAGES_TO_GENERATE.length; i++) {
    const config = IMAGES_TO_GENERATE[i];
    const filePath = path.join(outputDir, config.name);
    
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping: ${config.name}`);
      successCount++;
      continue;
    }

    console.log(`[${i + 1}/${IMAGES_TO_GENERATE.length}] ${config.name}`);
    
    try {
      const result = await generateImage(config);
      saveImage(result.data, filePath);
      successCount++;
      
      if (i < IMAGES_TO_GENERATE.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    } catch (error) {
      console.error(`   ❌ ${error.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Done: ${successCount}/${IMAGES_TO_GENERATE.length}`);
}

main().catch(console.error);
