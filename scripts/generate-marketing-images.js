/**
 * Marketing Calendar - Social Media Image Generation
 * Using Gemini 3 Pro Image Preview (Nano Banana Pro)
 * 
 * Generates realistic images for Instagram, LinkedIn, Twitter posts
 * based on the marketing calendar content
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Use environment variable (required)
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable is required');
  console.error('   Get your key at: https://aistudio.google.com/app/apikey');
  console.error('   Run: GEMINI_API_KEY=your_key npm run generate:marketing');
  process.exit(1);
}
const MODEL = 'gemini-3-pro-image-preview';

const outputDir = path.join(__dirname, '..', 'public', 'images', 'marketing');

// Create output directory structure
const dirs = [
  outputDir,
  path.join(outputDir, 'instagram'),
  path.join(outputDir, 'linkedin'),
  path.join(outputDir, 'twitter'),
  path.join(outputDir, 'reels'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
});

/**
 * Marketing Content Images to Generate
 * Based on the CONTENT_CALENDAR from the marketing-calendar page
 */
const MARKETING_IMAGES = [
  // =====================
  // WEEK 1 - PRE-LAUNCH
  // =====================
  {
    id: 'w1-linkedin-transparency',
    name: 'week1-linkedin-transparency.jpg',
    folder: 'linkedin',
    week: 1,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Professional construction site photograph for LinkedIn.
    Dramatic black and white image with high contrast.
    Single beam of golden morning light illuminating stacked building materials.
    Dust particles visible in the light beam.
    Brutalist industrial aesthetic.
    Cinematic composition with strong diagonal shadows.
    Premium documentary photography style.
    No people, focus on materials and light.`,
  },
  {
    id: 'w1-instagram-carousel-1',
    name: 'week1-instagram-68jaar.jpg',
    folder: 'instagram',
    week: 1,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Bold typography poster design.
    The number "68" in massive industrial stencil font.
    Concrete texture background with visible aggregate.
    Subtle orange construction tape stripe across corner.
    Distressed, weathered look like it's been on a construction site.
    Raw, brutalist design aesthetic.
    High contrast, moody lighting.`,
  },
  {
    id: 'w1-instagram-carousel-2',
    name: 'week1-instagram-19000.jpg',
    folder: 'instagram',
    week: 1,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Bold typography poster design.
    The number "19.000" in massive industrial stencil font.
    Raw concrete texture background.
    Construction dust overlay effect.
    Minimalist brutalist design.
    Off-white text on dark grey concrete.
    Industrial warehouse aesthetic.`,
  },
  {
    id: 'w1-instagram-carousel-3',
    name: 'week1-instagram-transparantie.jpg',
    folder: 'instagram',
    week: 1,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Bold typography poster design.
    The word "TRANSPARANTIE WINT." in bold industrial font.
    Clean white text on dark navy blue background.
    Single thin orange accent line.
    Minimalist, powerful, statement piece.
    Premium brand aesthetic like high-end fashion.
    No imagery, pure typography.`,
  },

  // =====================
  // WEEK 2 - WKB FOCUS
  // =====================
  {
    id: 'w2-instagram-reel-thumb',
    name: 'week2-reel-muren.jpg',
    folder: 'reels',
    week: 2,
    platform: 'instagram',
    aspectRatio: '9:16',
    prompt: `Dramatic vertical image for Instagram Reel thumbnail.
    Close-up of pristine white interior wall.
    X-ray style overlay showing hidden elements:
    - Electrical wires in blue
    - Water pipes in copper
    - Insulation in soft yellow
    Half the wall normal, half showing "inside".
    Futuristic technical visualization.
    Clean, high-tech aesthetic.
    Text hook space at top.`,
  },
  {
    id: 'w2-linkedin-wkb',
    name: 'week2-linkedin-wkb.jpg',
    folder: 'linkedin',
    week: 2,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Professional documentary photograph.
    Construction site office desk covered in papers and folders.
    Stressed hands shuffling through documents.
    Morning light through dusty window.
    Chaos of paperwork, sticky notes, coffee cups.
    Conveys overwhelm and disorganization.
    Cinematic, editorial photography style.
    Warm but tense mood.`,
  },

  // =====================
  // WEEK 3 - CLOUD TRANSITION
  // =====================
  {
    id: 'w3-linkedin-cloud',
    name: 'week3-linkedin-cloud.jpg',
    folder: 'linkedin',
    week: 3,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Split composition visual.
    Left side: Gritty construction site, raw materials, dust, analog.
    Right side: Clean modern server room aesthetic, blue LED lights, digital.
    Sharp diagonal divide between the two worlds.
    Represents transformation from physical to digital.
    High production value, commercial photography.
    Balanced exposure on both sides.`,
  },
  {
    id: 'w3-instagram-bts',
    name: 'week3-instagram-bts.jpg',
    folder: 'instagram',
    week: 3,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Authentic behind-the-scenes office photo.
    Modern startup workspace at night.
    Laptop with code visible on screen (blurred).
    Whiteboard with wireframe sketches in background.
    Coffee cups, notebooks, sticky notes.
    Warm desk lamp lighting.
    Raw, unfiltered, real moment.
    No people, just the workspace.`,
  },

  // =====================
  // WEEK 4 - COUNTDOWN
  // =====================
  {
    id: 'w4-all-1week',
    name: 'week4-countdown-1week.jpg',
    folder: 'instagram',
    week: 4,
    platform: 'all',
    aspectRatio: '1:1',
    prompt: `Dramatic countdown image.
    Raw concrete wall texture.
    "1 WEEK" spray painted in construction orange.
    Dripping paint effect.
    Single dramatic spotlight from above.
    Dust particles in the air.
    Urban, industrial, urgent energy.
    Brutalist street art aesthetic.`,
  },
  {
    id: 'w4-linkedin-founder',
    name: 'week4-linkedin-founder.jpg',
    folder: 'linkedin',
    week: 4,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Powerful split image composition.
    Left half: Vintage black and white photo aesthetic from 1950s,
    construction workers with old equipment, sepia toned.
    Right half: Modern laptop with glowing code on screen,
    contemporary workspace, clean and bright.
    Same frame composition, different eras.
    Strong visual metaphor for generational evolution.
    Premium editorial photography style.`,
  },

  // =====================
  // WEEK 5 - LAUNCH
  // =====================
  {
    id: 'w5-launch-hero',
    name: 'week5-launch-hero.jpg',
    folder: 'instagram',
    week: 5,
    platform: 'all',
    aspectRatio: '1:1',
    prompt: `Epic launch announcement image.
    Construction crane silhouette against golden hour sky.
    Crane is lifting a large glowing digital screen/tablet.
    Screen shows clean UI interface (abstract, not specific).
    Dramatic clouds, sun rays breaking through.
    Powerful, triumphant, milestone moment.
    Bold "LIVE" text overlay position available.
    Cinematic blockbuster movie poster feel.`,
  },
  {
    id: 'w5-launch-hero-wide',
    name: 'week5-launch-hero-wide.jpg',
    folder: 'linkedin',
    week: 5,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Epic launch announcement image, wide format.
    Construction crane silhouette against dramatic sunset sky.
    Crane lifting illuminated digital tablet showing app interface.
    Orange and deep blue sky gradient.
    Lens flare from setting sun.
    Industrial meets digital future.
    Premium advertising campaign quality.
    Space for text overlay on left side.`,
  },
  {
    id: 'w5-instagram-muren',
    name: 'week5-instagram-muren.jpg',
    folder: 'instagram',
    week: 5,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Educational infographic style.
    Modern house cutaway/cross-section illustration.
    Clean architectural line drawing on dark background.
    Pipes, wires, insulation layers clearly labeled.
    Each component highlighted in different color.
    Technical but approachable style.
    Premium visualization quality.
    Construction documentation aesthetic.`,
  },
  {
    id: 'w5-pilot-bouwers',
    name: 'week5-pilot-bouwers.jpg',
    folder: 'linkedin',
    week: 5,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Bold recruitment poster design.
    "BOUWERS VAN MORGEN" in large construction stencil font.
    Single hard hat silhouette below text.
    "5 PLEKKEN" counter in corner.
    Orange construction tape border elements.
    Industrial concrete texture background.
    Urgent, exclusive, limited spots energy.
    Call-to-action poster aesthetic.`,
  },

  // =====================
  // WEEK 7 - MOMENTUM
  // =====================
  {
    id: 'w7-testimonial',
    name: 'week7-testimonial.jpg',
    folder: 'linkedin',
    week: 7,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Professional testimonial card design.
    Confident construction professional in work clothes.
    Arms crossed, slight smile, construction site blurred behind.
    Large pull quote overlay: "Eindelijk weet ik wat ik aflever."
    Statistics displayed as bold numbers on right side.
    Corporate case study aesthetic.
    Trustworthy, professional, successful.`,
  },
  {
    id: 'w7-wkb-uitleg',
    name: 'week7-wkb-uitleg.jpg',
    folder: 'reels',
    week: 7,
    platform: 'instagram',
    aspectRatio: '9:16',
    prompt: `Educational reel thumbnail.
    Split screen composition:
    Left side: legal document/law book, official looking.
    Right side: construction site in action.
    "WKB" text prominently displayed.
    Educational, informative, professional.
    Clean layout with space for text overlays.
    Modern documentary style.`,
  },

  // =====================
  // GENERIC ASSETS
  // =====================
  {
    id: 'generic-construction-hero',
    name: 'generic-construction-hero.jpg',
    folder: 'instagram',
    week: 0,
    platform: 'all',
    aspectRatio: '1:1',
    prompt: `Modern Dutch residential construction site.
    New build house in progress, framing visible.
    Golden hour lighting, long shadows.
    Clean, organized site with quality materials.
    No workers visible, focus on craftsmanship.
    Blue sky with scattered clouds.
    Premium real estate marketing quality.`,
  },
  {
    id: 'generic-documents',
    name: 'generic-documents.jpg',
    folder: 'linkedin',
    week: 0,
    platform: 'linkedin',
    aspectRatio: '16:9',
    prompt: `Flat lay of construction documents.
    Architectural blueprints, specifications, photos spread on desk.
    Modern tablet showing digital version of same documents.
    Transition from paper to digital concept.
    Clean white desk, good lighting.
    Organized, professional, transformation story.
    Commercial product photography style.`,
  },
  {
    id: 'generic-handover',
    name: 'generic-handover.jpg',
    folder: 'instagram',
    week: 0,
    platform: 'instagram',
    aspectRatio: '1:1',
    prompt: `Happy home handover moment.
    Keys in focus in foreground.
    Blurred new modern Dutch house in background.
    Warm, emotional, milestone moment.
    Natural daylight, soft shadows.
    Clean, bright, optimistic.
    Real estate celebration aesthetic.`,
  },
];

/**
 * Generate image using Gemini API
 */
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
          imageSize: '2K'
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
          
          reject(new Error('No image found in response'));
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

/**
 * Save base64 image to file
 */
function saveImage(base64Data, filePath) {
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`   ✅ Saved: ${path.basename(filePath)}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('🎨 MARKETING IMAGE GENERATOR');
  console.log('============================');
  console.log('Using: Gemini 3 Pro Image Preview');
  console.log(`Total images to generate: ${MARKETING_IMAGES.length}`);
  console.log('');

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < MARKETING_IMAGES.length; i++) {
    const config = MARKETING_IMAGES[i];
    const filePath = path.join(outputDir, config.folder, config.name);
    
    // Skip if already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  [${i + 1}/${MARKETING_IMAGES.length}] Skipping: ${config.name} (exists)`);
      skipCount++;
      continue;
    }

    console.log(`🖼️  [${i + 1}/${MARKETING_IMAGES.length}] Generating: ${config.name}`);
    console.log(`   Platform: ${config.platform} | Week: ${config.week || 'Generic'}`);
    
    try {
      const result = await generateImage(config);
      saveImage(result.data, filePath);
      successCount++;
      
      // Rate limiting - wait between requests
      if (i < MARKETING_IMAGES.length - 1) {
        console.log('   ⏳ Waiting 2.5s for rate limit...');
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failCount++;
    }
    
    console.log('');
  }

  console.log('============================');
  console.log('📊 GENERATION COMPLETE');
  console.log(`   ✅ Generated: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log('');
  console.log(`📁 Output: ${outputDir}`);
  console.log('');
}

// Export for use in other scripts
module.exports = { MARKETING_IMAGES, generateImage };

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
