/**
 * AI Intelligence Page Image Generation
 * Using Gemini 3 Pro Image Preview (Nano Banana Pro 3)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyCTKCGdOJ8FxaBRLbOUKGlSZhLRQL7-uno';
const MODEL = 'gemini-3-pro-image-preview';

const outputDir = path.join(__dirname, '..', 'public', 'images', 'ai');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

const IMAGES_TO_GENERATE = [
  // Hero Section
  {
    name: 'hero-ai-brain.jpg',
    prompt: `Stunning 3D visualization of artificial intelligence meeting architecture.
    A glowing translucent human brain made of golden light particles and neural networks,
    seamlessly morphing into a beautiful modern Dutch home silhouette.
    Deep navy blue (#1a1a2e) background with ambient glow effects.
    Floating data points, golden amber (#f59e0b) accent highlights,
    ethereal light rays connecting brain neurons to house structure,
    ultra premium tech visualization, cinematic lighting,
    Behance featured quality, 8K render feel, futuristic yet warm.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'dna-helix.jpg',
    prompt: `Breathtaking 3D visualization of a DNA double helix transforming into building blueprints.
    The DNA strands are made of glowing teal and emerald light,
    with base pairs showing tiny house icons, document symbols, and data nodes.
    Dark gradient background from deep navy to black.
    Golden amber highlights on key connection points.
    Floating holographic construction elements around the helix.
    Ultra-modern, premium tech aesthetic, glass morphism effects,
    cinematic depth of field, award-winning 3D art style.`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'predictive-dashboard.jpg',
    prompt: `Sleek futuristic smart home dashboard hologram floating in space.
    Transparent glass UI panels showing maintenance predictions, energy graphs, and cost forecasts.
    A beautiful modern house 3D model in the center, surrounded by orbiting data visualizations.
    Glowing amber (#f59e0b) progress bars and emerald green (#10b981) status indicators.
    Deep navy blue background with subtle grid pattern.
    Premium tech product visualization, Apple-level design quality,
    soft ambient lighting, photorealistic 3D render.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'neural-network-house.jpg',
    prompt: `Abstract artistic visualization of a neural network shaped like a modern home.
    Thousands of interconnected golden light nodes forming the outline of a Dutch villa.
    Data streams flowing through the network like electricity.
    Deep space background with subtle purple and blue nebula effects.
    Some nodes pulse with emerald green (representing AI decisions).
    Ultra-premium digital art, trending on ArtStation,
    ethereal and intelligent feeling, 4K quality.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'savings-visualization.jpg',
    prompt: `Elegant 3D infographic showing money savings concept.
    A beautiful glass piggy bank filled with glowing golden coins,
    next to a sleek modern house model with holographic cost projections.
    Floating euro symbols transforming into home improvements.
    Clean white and light gray background with subtle gradients.
    Emerald green upward arrows showing growth.
    Premium financial visualization, minimalist yet impactful,
    soft studio lighting, commercial photography quality.`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'resale-comparison.jpg',
    prompt: `Split-screen 3D visualization comparing two homes for sale.
    Left side: dim, uncertain house with question marks floating around it, grey tones.
    Right side: bright, confident house with golden glow, floating verified badges and data charts.
    The right house has a premium "SOLD" holographic banner with +23% indicator.
    Clean professional real estate visualization,
    dramatic lighting contrast between the two sides,
    modern 3D render quality, compelling and clear message.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'lifecycle-timeline.jpg',
    prompt: `Beautiful horizontal timeline visualization showing a home's 20-year journey.
    Starts with a 3D house blueprint, evolving through construction phases,
    to a glowing smart home at the end with value appreciation indicators.
    Timeline made of flowing golden light with milestone markers.
    Key moments shown as floating holographic icons (wrench, energy bolt, trophy).
    Dark navy gradient background, premium infographic style,
    Apple keynote presentation quality, clean and inspiring.`,
    aspectRatio: '21:9',
    resolution: '2K'
  },
  {
    name: 'ai-maintenance-alert.jpg',
    prompt: `Futuristic smart home notification visualization.
    A beautiful modern Dutch home with transparent walls showing internal systems.
    AI assistant hologram highlighting a heating system with amber warning glow.
    Floating prediction panel showing "14 months until service needed".
    Soft blue ambient lighting, premium tech product photography style,
    clean and professional, reassuring rather than alarming,
    Apple HomeKit aesthetic quality.`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'blockchain-verification.jpg',
    prompt: `Elegant visualization of blockchain document verification.
    A floating holographic document with golden seal and checkmark,
    connected by glowing chains to multiple verification nodes.
    Each node shows a small house icon and timestamp.
    Deep navy background with subtle hexagonal pattern.
    Emerald green verified badges glowing softly.
    Premium fintech visualization style, trustworthy and sophisticated,
    high-end corporate presentation quality.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'energy-optimization.jpg',
    prompt: `Stunning visualization of home energy flow optimization.
    Cross-section of a modern sustainable home showing energy pathways.
    Solar panels with golden energy streams flowing into battery storage.
    AI brain icon at the center orchestrating the flow.
    Heat pump, floor heating, and appliances connected by glowing lines.
    Clean technical illustration style with artistic flair,
    emerald green for efficiency, amber for solar energy,
    educational yet beautiful, premium infographic quality.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'warranty-shield.jpg',
    prompt: `3D visualization of warranty protection concept.
    A beautiful modern house inside a translucent golden protective shield bubble.
    Small warranty document icons orbiting around the shield.
    Timer/countdown elements showing years remaining.
    Soft emerald glow indicating active protection.
    Dark gradient background, premium insurance/protection visualization,
    trustworthy and reassuring aesthetic, high-end 3D render.`,
    aspectRatio: '1:1',
    resolution: '2K'
  },
  {
    name: 'smart-home-cutaway.jpg',
    prompt: `Architectural cutaway visualization of a smart AI-powered home.
    Beautiful cross-section showing all rooms and systems.
    Glowing data connections between smart devices.
    Central AI hub in the living room with holographic display.
    Each system (HVAC, electrical, plumbing) color-coded and labeled.
    Clean white background, technical illustration meets lifestyle photography,
    Dwell magazine quality, aspirational and achievable.`,
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
  console.log('🎨 AI Intelligence Page Image Generation');
  console.log('=========================================');
  console.log(`Using model: ${MODEL}`);
  console.log(`Total images to generate: ${IMAGES_TO_GENERATE.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < IMAGES_TO_GENERATE.length; i++) {
    const config = IMAGES_TO_GENERATE[i];
    const filePath = path.join(outputDir, config.name);
    
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping (exists): ${config.name}`);
      successCount++;
      continue;
    }

    console.log(`\n[${i + 1}/${IMAGES_TO_GENERATE.length}] Generating: ${config.name}`);
    console.log(`   Aspect: ${config.aspectRatio}, Resolution: ${config.resolution}`);
    
    try {
      const result = await generateImage(config);
      saveImage(result.data, filePath);
      successCount++;
      
      if (i < IMAGES_TO_GENERATE.length - 1) {
        console.log('   ⏳ Waiting 3s for rate limiting...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n=========================================');
  console.log(`✅ Success: ${successCount}/${IMAGES_TO_GENERATE.length}`);
  console.log(`❌ Failed: ${failCount}/${IMAGES_TO_GENERATE.length}`);
  console.log('=========================================');
}

main().catch(console.error);
