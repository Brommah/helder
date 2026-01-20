/**
 * Image Generation Script using Gemini 3 Pro Image Preview (Nano Banana Pro 3)
 * 
 * Generates all placeholder images for the Helder Woningpaspoort application
 * 
 * Usage: node scripts/generate-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyCTKCGdOJ8FxaBRLbOUKGlSZhLRQL7-uno';
const MODEL = 'gemini-3-pro-image-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Ensure output directories exist
const outputDir = path.join(__dirname, '..', 'public', 'images');
const projectsDir = path.join(outputDir, 'projects');
const avatarsDir = path.join(outputDir, 'avatars');
const iconsDir = path.join(outputDir, 'icons');

[outputDir, projectsDir, avatarsDir, iconsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Image generation configuration
const IMAGES_TO_GENERATE = [
  // ============ HERO & MAIN IMAGES ============
  {
    name: 'hero-house.jpg',
    path: outputDir,
    prompt: `Photorealistic architectural photograph of a stunning modern Dutch family home, 
    4 bedrooms, white stucco exterior with dark oak accents, large floor-to-ceiling windows, 
    flat roof with subtle pitch, surrounded by a perfectly manicured lawn and mature trees, 
    soft golden hour lighting from the left, Netherlands countryside setting, 
    captured with a Sony A7R IV, 24mm lens, f/8, natural saturation, 
    architectural photography style, magazine quality, aspect ratio 16:9`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'og-image.jpg',
    path: outputDir,
    prompt: `Professional marketing banner for "Helder Woningbouw" - a premium Dutch home building company.
    Show a beautiful modern family home with the Helder brand aesthetic (deep navy blue #1a1a2e and warm amber accents).
    Include abstract elements suggesting documentation, blockchain, and construction.
    Clean, sophisticated, trustworthy feeling. Text: "Bouw helder. Bouw met DNA."
    16:9 aspect ratio, suitable for social media sharing, professional quality.`,
    aspectRatio: '16:9',
    resolution: '2K'
  },

  // ============ PROJECT IMAGES ============
  {
    name: 'zonneweide.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Villa Zonneweide" - a luxurious modern Dutch villa 
    in Almere, Netherlands. 210 m², 5 bedrooms, crisp white exterior with anthracite window frames, 
    large covered terrace, swimming pool visible in background, photovoltaic panels on flat roof, 
    lush green garden, blue sky with white clouds, 
    professional real estate photography, HDR processing, 
    shot with Canon EOS R5, 16-35mm lens, golden hour lighting, magazine quality`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'tuin.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Woning De Tuin" - a charming Dutch countryside home 
    in Utrecht style. 180 m², farmhouse inspired with modern elements, 
    wooden cladding in warm brown tones, thatched-style pitched roof, 
    surrounded by a beautiful cottage garden with flowering plants, 
    brick pathway leading to front door, 
    pastoral Dutch landscape in background, soft overcast lighting for even illumination,
    professional architectural photography, shot with medium format camera`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'cube.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Modern Cube" - an ultra-modern 
    minimalist Dutch city villa in Amsterdam style. 165 m², bold cubic architecture, 
    dark charcoal brick exterior contrasted with warm wood panels, 
    floor-to-ceiling glass facade revealing bright interior, 
    rooftop terrace with green roof visible, 
    urban setting with mature trees, 
    dramatic architectural lighting, twilight blue hour shot,
    high-end architectural photography, Dezeen magazine style`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'landhuis.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Villa Het Landhuis" - an elegant 
    classic Dutch country estate in Amersfoort. 245 m², 6 bedrooms, 
    traditional Dutch architecture with modern upgrades, 
    red brick facade, white window frames, 
    slate pitched roof with dormers, 
    circular driveway with fountain, 
    mature oak trees, meticulously landscaped gardens,
    luxury real estate photography style, warm afternoon light`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'eco.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Eco Woning Noord" - a cutting-edge 
    sustainable home in Groningen, Netherlands. 155 m², 
    passive house design, timber frame construction with living green walls, 
    large triple-glazed windows, integrated solar panels, 
    rainwater collection system visible, 
    wild flower meadow garden instead of lawn, 
    surrounded by nature, ecological and harmonious,
    environmental architecture photography style, soft natural lighting`,
    aspectRatio: '4:3',
    resolution: '2K'
  },
  {
    name: 'schuur.jpg',
    path: projectsDir,
    prompt: `Photorealistic architectural photograph of "Schuurwoning Veluwe" - a beautiful 
    Dutch barn-style home (schuurwoning) in Apeldoorn on the Veluwe. 200 m², 
    converted barn aesthetic with modern interior, 
    black-stained vertical timber cladding, 
    large barn doors converted to glass, 
    set in a clearing surrounded by pine forest, 
    extensive wooden deck, 
    rustic yet refined architecture photography, 
    misty morning atmosphere, moody and atmospheric`,
    aspectRatio: '4:3',
    resolution: '2K'
  },

  // ============ AVATAR/TESTIMONIAL IMAGES ============
  {
    name: 'family-1.jpg',
    path: avatarsDir,
    prompt: `Professional portrait photograph of a happy Dutch couple in their 40s, 
    the Van der Berg family, standing in front of their new modern home. 
    Warm, genuine smiles, casual but elegant clothing, 
    soft natural lighting, shallow depth of field with home blurred in background,
    lifestyle photography style, warm and inviting atmosphere,
    high-end portrait photography, Canon 85mm f/1.4`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'family-2.jpg',
    path: avatarsDir,
    prompt: `Professional portrait photograph of a young Dutch couple (Tim & Laura de Vries) 
    in their early 30s, sitting on the steps of their new home's entrance. 
    Contemporary casual style, genuine happy expressions, 
    modern minimalist home entrance visible,
    editorial lifestyle photography, soft afternoon light,
    authentic and relatable, magazine quality portrait`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'family-3.jpg',
    path: avatarsDir,
    prompt: `Professional portrait photograph of the Bakker family - 
    parents with two children (boy ~10, girl ~7) in their garden. 
    Dutch family, casually dressed, natural joyful expressions,
    beautiful family home garden setting in Netherlands,
    warm golden hour lighting, lifestyle family photography,
    authentic and heartwarming, professional quality`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'family-4.jpg',
    path: avatarsDir,
    prompt: `Professional portrait photograph of the De Groot family - 
    middle-aged Dutch couple with teenage son, 
    standing in front of their rustic schuurwoning (barn house),
    casual country style clothing, warm genuine smiles,
    Veluwe forest setting visible in background,
    natural light portrait, relaxed atmosphere`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'avatar-1.jpg',
    path: avatarsDir,
    prompt: `Professional headshot of a Dutch woman in her 40s, 
    friendly professional appearance, natural makeup, 
    warm smile, neutral background with soft gradient,
    business casual attire, high-end corporate portrait style,
    studio lighting, magazine quality`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'avatar-2.jpg',
    path: avatarsDir,
    prompt: `Professional headshot of a Dutch man in his 50s, 
    distinguished appearance, salt and pepper hair, 
    confident friendly expression, neutral background,
    business attire, corporate executive style portrait,
    professional studio lighting`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'avatar-3.jpg',
    path: avatarsDir,
    prompt: `Professional headshot of a young Dutch woman in her early 30s, 
    modern professional look, natural and approachable,
    stylish contemporary clothing, soft smile,
    clean neutral background, contemporary portrait style,
    natural lighting look`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'avatar-4.jpg',
    path: avatarsDir,
    prompt: `Professional headshot of a Dutch man in his late 30s, 
    creative professional appearance, well-groomed beard,
    warm approachable expression, modern style,
    slightly off-center composition, contemporary portrait,
    soft natural lighting`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'avatar-5.jpg',
    path: avatarsDir,
    prompt: `Professional headshot of a Dutch woman in her 60s, 
    elegant sophisticated appearance, silver hair styled beautifully,
    warm kind expression, timeless style,
    clean background, high-end portrait photography,
    flattering studio lighting`,
    aspectRatio: '1:1',
    resolution: '1K'
  },

  // ============ LOGIN & UI IMAGES ============
  {
    name: 'login-bg.jpg',
    path: outputDir,
    prompt: `Abstract architectural visualization showing the concept of home building and digital documentation.
    Deep navy blue (#1a1a2e) dominant color scheme with warm amber (#f59e0b) accents.
    Subtle geometric patterns suggesting blueprints, construction, and data flow.
    Modern Dutch architecture silhouettes, translucent overlapping layers,
    floating documents and digital verification symbols,
    sophisticated gradient background, premium tech-meets-construction aesthetic,
    suitable as a dark theme login background, 9:16 aspect ratio`,
    aspectRatio: '9:16',
    resolution: '2K'
  },
  {
    name: 'construction-bg.jpg',
    path: outputDir,
    prompt: `Aerial photograph of a modern house under construction in the Netherlands.
    Beautiful building site showing the skeleton of a timber frame house,
    construction workers visible for scale, materials organized neatly,
    golden hour drone photography, professional construction documentation style,
    shows the precision and care of Dutch home building,
    warm and optimistic atmosphere despite being a work in progress`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'woningpaspoort-mockup.jpg',
    path: outputDir,
    prompt: `3D visualization of a digital housing passport (woningpaspoort) concept.
    Modern tablet device displaying a beautiful dashboard interface,
    surrounded by floating document icons, verification badges, and data visualizations,
    blockchain symbols subtly integrated,
    premium dark UI with emerald and amber accent colors,
    glass morphism effects, sophisticated tech product visualization,
    dark gradient background, product photography style`,
    aspectRatio: '4:3',
    resolution: '2K'
  },

  // ============ ICONS & BRANDING ============
  {
    name: 'favicon.png',
    path: iconsDir,
    prompt: `Modern minimalist logo icon for "Helder" home building company.
    Simple "H" letterform in white on deep navy blue (#1a1a2e) background,
    subtle amber (#f59e0b) accent dot or highlight,
    rounded square shape, clean geometric design,
    suitable for favicon/app icon at small sizes,
    professional brand identity style, memorable and distinctive`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'apple-touch-icon.png',
    path: iconsDir,
    prompt: `App icon for "Helder" Dutch home building platform.
    Stylized "H" letter in white on gradient background from deep navy (#1a1a2e) to dark blue (#16213e),
    small amber (#f59e0b) architectural detail accent,
    iOS app icon style, rounded corners will be applied automatically,
    clean, premium, trustworthy brand feel,
    high contrast for readability at small sizes`,
    aspectRatio: '1:1',
    resolution: '1K'
  },

  // ============ DASHBOARD & FEATURE IMAGES ============
  {
    name: 'document-upload.jpg',
    path: outputDir,
    prompt: `Isometric illustration of document management and verification.
    Floating 3D documents, folders, and verification checkmarks,
    clean white background with subtle shadows,
    emerald green and navy blue color scheme,
    professional business illustration style,
    modern flat design with subtle gradients and depth,
    suitable for empty state or feature explanation`,
    aspectRatio: '4:3',
    resolution: '1K'
  },
  {
    name: 'timeline-visual.jpg',
    path: outputDir,
    prompt: `Beautiful isometric illustration showing a house construction timeline.
    5 stages from foundation to completion shown in a flowing timeline,
    modern Dutch home at various construction stages,
    progress checkmarks and milestone markers,
    clean professional illustration style,
    navy, white, emerald, and amber color palette,
    infographic quality, clear and informative`,
    aspectRatio: '16:9',
    resolution: '2K'
  },
  {
    name: 'energy-label.jpg',
    path: outputDir,
    prompt: `Modern visualization of home energy efficiency rating A++++.
    Gradient scale from red (low efficiency) to emerald green (high efficiency),
    modern Dutch home silhouette with energy flow visualization,
    solar panels, heat pump, insulation layers shown,
    clean infographic style, professional energy documentation aesthetic,
    white background, suitable for dashboard widget`,
    aspectRatio: '4:3',
    resolution: '1K'
  },
  {
    name: 'materials-showcase.jpg',
    path: outputDir,
    prompt: `Flat lay product photography of premium home building materials.
    Samples of high-end construction materials: insulation cross-section,
    triple-glazed window corner sample, sustainable timber piece,
    solar panel fragment, heat pump component,
    arranged artistically on clean white background,
    professional product photography, soft studio lighting,
    showing quality and sustainability focus`,
    aspectRatio: '4:3',
    resolution: '2K'
  },

  // ============ PROCESS & JOURNEY IMAGES ============
  {
    name: 'discover-step.jpg',
    path: outputDir,
    prompt: `Illustration for "Discovery" phase of home building.
    A couple sitting with an architect/advisor, looking at plans and materials,
    bright modern office setting with large windows,
    warm and welcoming atmosphere, collaborative discussion,
    soft illustration style with realistic proportions,
    amber warm lighting accents, inspirational and approachable`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'design-step.jpg',
    path: outputDir,
    prompt: `Illustration for "Design" phase of home building.
    3D architectural model and blueprints on a large screen,
    designer pointing at specific details,
    modern design studio environment,
    creative and precise atmosphere,
    blue color accents suggesting precision and creativity`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'build-step.jpg',
    path: outputDir,
    prompt: `Illustration for "Build" phase of home building.
    Construction site with house taking shape,
    workers collaborating, documenting with tablets,
    timber frame going up, professional and organized,
    emerald green accents suggesting growth and progress,
    optimistic construction scene`,
    aspectRatio: '1:1',
    resolution: '1K'
  },
  {
    name: 'handover-step.jpg',
    path: outputDir,
    prompt: `Illustration for "Handover" phase of home building.
    Happy family receiving keys to their new home,
    beautiful finished house in background,
    digital tablet showing their Woningpaspoort,
    rose/pink warm accents suggesting love and completion,
    emotional and celebratory moment`,
    aspectRatio: '1:1',
    resolution: '1K'
  }
];

/**
 * Generate a single image using Gemini API
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

          // Find the image part in the response
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

/**
 * Save base64 image to file
 */
function saveImage(base64Data, filePath) {
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Saved: ${filePath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Helder Image Generation Script');
  console.log('==================================');
  console.log(`Using model: ${MODEL}`);
  console.log(`Total images to generate: ${IMAGES_TO_GENERATE.length}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < IMAGES_TO_GENERATE.length; i++) {
    const config = IMAGES_TO_GENERATE[i];
    const filePath = path.join(config.path, config.name);
    
    // Skip if file already exists
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
      
      // Rate limiting - wait 2 seconds between requests
      if (i < IMAGES_TO_GENERATE.length - 1) {
        console.log('   ⏳ Waiting 2s for rate limiting...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n==================================');
  console.log(`✅ Success: ${successCount}/${IMAGES_TO_GENERATE.length}`);
  console.log(`❌ Failed: ${failCount}/${IMAGES_TO_GENERATE.length}`);
  console.log('==================================');
}

// Run the script
main().catch(console.error);
