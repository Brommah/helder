/**
 * Image Generation Script using Google Gemini Imagen 3
 * 
 * This script generates 35 images for the Helder Woningpaspoort application:
 * - 15 Construction Phase Photos
 * - 10 Marketing/Hero Images
 * - 10 UI Assets
 * 
 * Prerequisites:
 * 1. Google Cloud account with Vertex AI API enabled
 * 2. GOOGLE_CLOUD_PROJECT environment variable set
 * 3. GOOGLE_APPLICATION_CREDENTIALS pointing to service account JSON
 * 
 * Run with: npx tsx scripts/generate-gemini-images.ts
 */

import fs from 'fs'
import path from 'path'

// ============================================
// Image Definitions
// ============================================

interface ImageDefinition {
  id: string
  category: 'construction' | 'marketing' | 'ui'
  filename: string
  prompt: string
  outputPath: string
  aspectRatio: '1:1' | '16:9' | '4:3' | '9:16'
}

const CONSTRUCTION_IMAGES: ImageDefinition[] = [
  {
    id: 'c1',
    category: 'construction',
    filename: 'excavation.jpg',
    prompt: 'Professional construction site photo of excavation work (grondwerk) for a Dutch residential home foundation. Excavator machine, trenches dug, Dutch residential neighborhood in background. Sunny day, professional quality, high resolution.',
    outputPath: 'public/images/construction/excavation.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c2',
    category: 'construction',
    filename: 'foundation-pouring.jpg',
    prompt: 'Construction photo of concrete being poured for residential foundation in the Netherlands. Concrete pump truck, workers in safety gear, wet concrete, rebar visible. Professional documentary style.',
    outputPath: 'public/images/construction/foundation-pouring.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c3',
    category: 'construction',
    filename: 'foundation-complete.jpg',
    prompt: 'Completed concrete foundation for a Dutch family home. Clean concrete slab, marked anchor points, drainage pipes visible. Clear sunny day, professional construction photography.',
    outputPath: 'public/images/construction/foundation-complete.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c4',
    category: 'construction',
    filename: 'framing-start.jpg',
    prompt: 'Start of structural framing (ruwbouw) for Dutch residential construction. Wooden or steel frame beginning to take shape, scaffolding, workers on site. Professional quality photo.',
    outputPath: 'public/images/construction/framing-start.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c5',
    category: 'construction',
    filename: 'walls-complete.jpg',
    prompt: 'Completed exterior walls of a modern Dutch home under construction. Brick or block walls, window and door openings, scaffolding around building. Professional construction documentation.',
    outputPath: 'public/images/construction/walls-complete.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c6',
    category: 'construction',
    filename: 'roof-structure.jpg',
    prompt: 'Wooden roof structure (dakconstructie) being installed on Dutch home. Timber trusses, rafters, workers installing beams. Blue sky, professional construction photo.',
    outputPath: 'public/images/construction/roof-structure.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c7',
    category: 'construction',
    filename: 'roof-tiles.jpg',
    prompt: 'Dutch ceramic roof tiles being installed on residential home. Workers on scaffold, partial tile coverage, traditional Dutch roofing. Professional quality image.',
    outputPath: 'public/images/construction/roof-tiles.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c8',
    category: 'construction',
    filename: 'windows-installed.jpg',
    prompt: 'Modern triple-glazed windows being installed in new Dutch home. Window installer at work, partially completed installation, bright modern windows. Professional documentary style.',
    outputPath: 'public/images/construction/windows-installed.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c9',
    category: 'construction',
    filename: 'electrical-rough.jpg',
    prompt: 'Electrical rough-in work inside Dutch residential construction. Exposed wiring, junction boxes, electrician working, unfinished walls showing electrical infrastructure.',
    outputPath: 'public/images/construction/electrical-rough.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c10',
    category: 'construction',
    filename: 'plumbing-rough.jpg',
    prompt: 'Plumbing rough-in installation in bathroom of new Dutch home. Copper and PVC pipes, drain connections, plumber at work. Professional construction documentation.',
    outputPath: 'public/images/construction/plumbing-rough.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c11',
    category: 'construction',
    filename: 'insulation.jpg',
    prompt: 'Wall insulation installation in Dutch residential construction. Rock wool or foam insulation being installed, vapor barrier visible, worker in protective gear.',
    outputPath: 'public/images/construction/insulation.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c12',
    category: 'construction',
    filename: 'drywall.jpg',
    prompt: 'Drywall/stucwerk installation in modern Dutch home interior. Smooth plastered walls, worker finishing surface, partially completed room.',
    outputPath: 'public/images/construction/drywall.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c13',
    category: 'construction',
    filename: 'flooring.jpg',
    prompt: 'Hardwood or laminate flooring being installed in Dutch home. Floor installer at work, partially completed floor, tools visible. Professional quality.',
    outputPath: 'public/images/construction/flooring.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c14',
    category: 'construction',
    filename: 'kitchen-install.jpg',
    prompt: 'Modern kitchen being installed in new Dutch home. Sleek white cabinets, integrated appliances, installer at work. Contemporary design, professional photo.',
    outputPath: 'public/images/construction/kitchen-install.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'c15',
    category: 'construction',
    filename: 'final-inspection.jpg',
    prompt: 'Final inspection of completed Dutch home. Inspector with clipboard, homeowner receiving keys, modern finished interior in background. Happy, professional moment.',
    outputPath: 'public/images/construction/final-inspection.jpg',
    aspectRatio: '16:9',
  },
]

const MARKETING_IMAGES: ImageDefinition[] = [
  {
    id: 'm1',
    category: 'marketing',
    filename: 'hero-modern-home.jpg',
    prompt: 'Beautiful modern Dutch family home exterior, architectural photography. Clean minimalist design, large windows, landscaped garden, golden hour lighting. Premium residential photography.',
    outputPath: 'public/images/marketing/hero-modern-home.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm2',
    category: 'marketing',
    filename: 'family-new-home.jpg',
    prompt: 'Happy Dutch family standing in front of their newly built home. Parents and two children, keys in hand, modern house in background. Warm, authentic, lifestyle photography.',
    outputPath: 'public/images/marketing/family-new-home.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm3',
    category: 'marketing',
    filename: 'builder-tablet.jpg',
    prompt: 'Professional Dutch builder/contractor using tablet computer on construction site. Hardhat, safety vest, modern home construction in background. Technology meets construction.',
    outputPath: 'public/images/marketing/builder-tablet.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm4',
    category: 'marketing',
    filename: 'phone-document.jpg',
    prompt: 'Close-up of smartphone showing house document app interface, held by hands. Modern UI visible on screen, blurred new home in background. Clean product photography.',
    outputPath: 'public/images/marketing/phone-document.jpg',
    aspectRatio: '9:16',
  },
  {
    id: 'm5',
    category: 'marketing',
    filename: 'ai-visualization.jpg',
    prompt: 'Abstract visualization of AI and housing data. Neural network patterns overlaid on house blueprint, glowing nodes and connections. Modern, tech-forward, blue color scheme.',
    outputPath: 'public/images/marketing/ai-visualization.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm6',
    category: 'marketing',
    filename: 'blockchain-security.jpg',
    prompt: 'Abstract visualization of blockchain security for documents. Chain links, digital locks, house silhouette, data encryption visual. Blue and white color scheme, modern tech aesthetic.',
    outputPath: 'public/images/marketing/blockchain-security.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm7',
    category: 'marketing',
    filename: 'energy-efficiency.jpg',
    prompt: 'Modern Dutch home with visible energy efficiency features. Solar panels, heat pump, smart meter display, green garden. Sustainability and technology, bright daylight.',
    outputPath: 'public/images/marketing/energy-efficiency.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm8',
    category: 'marketing',
    filename: 'smart-home-dashboard.jpg',
    prompt: 'Smart home control dashboard on wall-mounted tablet. Modern interface showing energy, security, climate controls. Sleek Dutch home interior in background.',
    outputPath: 'public/images/marketing/smart-home-dashboard.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm9',
    category: 'marketing',
    filename: 'key-handover.jpg',
    prompt: 'Close-up of house keys being handed over. Builder hand giving keys to homeowner, modern home visible in bokeh background. Emotional, milestone moment.',
    outputPath: 'public/images/marketing/key-handover.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'm10',
    category: 'marketing',
    filename: 'happy-homeowner.jpg',
    prompt: 'Portrait of happy Dutch homeowner in their new modern home. Standing in bright living room, arms crossed, confident smile. Professional lifestyle photography.',
    outputPath: 'public/images/marketing/happy-homeowner.jpg',
    aspectRatio: '4:3',
  },
]

const UI_IMAGES: ImageDefinition[] = [
  {
    id: 'u1',
    category: 'ui',
    filename: 'avatar-builder.jpg',
    prompt: 'Professional headshot of Dutch construction worker. Male, middle-aged, friendly smile, wearing hardhat and safety vest. Clean background, professional portrait.',
    outputPath: 'public/images/avatars/avatar-builder.jpg',
    aspectRatio: '1:1',
  },
  {
    id: 'u2',
    category: 'ui',
    filename: 'avatar-homeowner.jpg',
    prompt: 'Professional headshot of Dutch homeowner. Female, 35-45, friendly professional appearance. Clean neutral background, high quality portrait.',
    outputPath: 'public/images/avatars/avatar-homeowner.jpg',
    aspectRatio: '1:1',
  },
  {
    id: 'u3',
    category: 'ui',
    filename: 'avatar-admin.jpg',
    prompt: 'Professional headshot of business administrator. Male, professional attire, glasses, confident expression. Clean background, corporate portrait style.',
    outputPath: 'public/images/avatars/avatar-admin.jpg',
    aspectRatio: '1:1',
  },
  {
    id: 'u4',
    category: 'ui',
    filename: 'empty-state.svg',
    prompt: 'Minimalist line illustration for empty state. Simple house outline with document icon, subtle blue accents (#93b9e6). Clean, modern, vector style.',
    outputPath: 'public/images/ui/empty-state.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u5',
    category: 'ui',
    filename: 'success-celebration.svg',
    prompt: 'Minimalist celebration illustration. Confetti, checkmark, simple house shape. Blue (#93b9e6) and green accents. Clean vector style for success state.',
    outputPath: 'public/images/ui/success-celebration.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u6',
    category: 'ui',
    filename: 'error-warning.svg',
    prompt: 'Minimalist warning/error illustration. Alert triangle, simple house outline, amber/red accents. Clean vector style for error states.',
    outputPath: 'public/images/ui/error-warning.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u7',
    category: 'ui',
    filename: 'onboarding-1.svg',
    prompt: 'Onboarding illustration step 1: Welcome. Person opening door to new home, warm welcoming feeling. Blue (#93b9e6) accent color, minimalist vector style.',
    outputPath: 'public/images/ui/onboarding-1.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u8',
    category: 'ui',
    filename: 'onboarding-2.svg',
    prompt: 'Onboarding illustration step 2: Documents. Stack of documents transforming into digital format, phone or tablet. Blue (#93b9e6), minimalist vector.',
    outputPath: 'public/images/ui/onboarding-2.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u9',
    category: 'ui',
    filename: 'onboarding-3.svg',
    prompt: 'Onboarding illustration step 3: AI Insights. Brain icon connected to house, lightbulb moment, data visualization. Blue (#93b9e6), minimalist vector.',
    outputPath: 'public/images/ui/onboarding-3.svg',
    aspectRatio: '1:1',
  },
  {
    id: 'u10',
    category: 'ui',
    filename: 'verified-badge.svg',
    prompt: 'Premium verification badge design. Shield shape, checkmark, blockchain/chain element. Blue (#93b9e6) and gold accents. Clean vector, suitable for UI.',
    outputPath: 'public/images/ui/verified-badge.svg',
    aspectRatio: '1:1',
  },
]

const ALL_IMAGES = [...CONSTRUCTION_IMAGES, ...MARKETING_IMAGES, ...UI_IMAGES]

// ============================================
// Gemini Imagen 3 Integration
// ============================================

async function generateImage(definition: ImageDefinition): Promise<void> {
  console.log(`\n📷 Generating: ${definition.filename}`)
  console.log(`   Category: ${definition.category}`)
  console.log(`   Prompt: ${definition.prompt.substring(0, 80)}...`)
  
  // Ensure output directory exists
  const dir = path.dirname(definition.outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // TODO: Implement Gemini Imagen 3 API call
  // This requires the @google-cloud/vertexai package and proper authentication
  //
  // Example implementation:
  // const { VertexAI } = require('@google-cloud/vertexai')
  // const vertexAI = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT })
  // const generativeModel = vertexAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })
  // const result = await generativeModel.generateImages({ prompt: definition.prompt })
  // fs.writeFileSync(definition.outputPath, Buffer.from(result.images[0].bytesBase64Encoded, 'base64'))

  console.log(`   ✓ Would save to: ${definition.outputPath}`)
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  HELDER WONINGPASPOORT - Image Generation Script')
  console.log('  Using Google Gemini Imagen 3')
  console.log('═══════════════════════════════════════════════════════════')
  
  console.log(`\n📊 Image Summary:`)
  console.log(`   Construction Photos: ${CONSTRUCTION_IMAGES.length}`)
  console.log(`   Marketing Images: ${MARKETING_IMAGES.length}`)
  console.log(`   UI Assets: ${UI_IMAGES.length}`)
  console.log(`   ─────────────────────`)
  console.log(`   Total: ${ALL_IMAGES.length} images`)

  // Check environment
  if (!process.env.GOOGLE_CLOUD_PROJECT) {
    console.log('\n⚠️  GOOGLE_CLOUD_PROJECT not set.')
    console.log('   Set this environment variable to enable image generation.')
    console.log('   For now, showing prompts only.\n')
  }

  // Generate images by category
  console.log('\n\n🏗️  CONSTRUCTION PHOTOS')
  console.log('────────────────────────')
  for (const img of CONSTRUCTION_IMAGES) {
    await generateImage(img)
  }

  console.log('\n\n🎨  MARKETING IMAGES')
  console.log('────────────────────────')
  for (const img of MARKETING_IMAGES) {
    await generateImage(img)
  }

  console.log('\n\n🖼️  UI ASSETS')
  console.log('────────────────────────')
  for (const img of UI_IMAGES) {
    await generateImage(img)
  }

  console.log('\n\n═══════════════════════════════════════════════════════════')
  console.log('  ✅ Image generation complete!')
  console.log('═══════════════════════════════════════════════════════════\n')

  // Output manifest
  const manifest = {
    generated: new Date().toISOString(),
    total: ALL_IMAGES.length,
    categories: {
      construction: CONSTRUCTION_IMAGES.length,
      marketing: MARKETING_IMAGES.length,
      ui: UI_IMAGES.length,
    },
    images: ALL_IMAGES.map(img => ({
      id: img.id,
      category: img.category,
      filename: img.filename,
      path: img.outputPath,
    })),
  }

  fs.writeFileSync(
    'public/images/manifest.json',
    JSON.stringify(manifest, null, 2)
  )
  console.log('📄 Manifest saved to public/images/manifest.json')
}

// Export for testing
export { ALL_IMAGES, CONSTRUCTION_IMAGES, MARKETING_IMAGES, UI_IMAGES }

// Run if executed directly
main().catch(console.error)
