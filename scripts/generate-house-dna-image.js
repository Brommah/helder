/**
 * Generate House DNA image using Google Imagen 3
 * A soft, friendly visualization of a house's digital memory
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;

const prompt = `
A warm, soft, and friendly 3D illustration of a house's "DNA" concept. 
The image shows a cozy, minimalist house cutaway with glowing, organized floating elements:
- Soft pastel-colored document icons gently floating
- Warm amber light emanating from within
- A subtle helix/DNA strand made of home-related icons (keys, documents, tools, lightbulbs)
- Everything feels organized, findable, and peaceful
- Soft shadows, rounded corners, friendly aesthetic
- Color palette: warm whites, soft blues (#93b9e6), gentle creams, touch of amber
- Style: modern 3D illustration, soft lighting, no harsh edges
- Mood: welcoming, organized, trustworthy, like a helpful digital assistant for your home
- NO text, NO people, NO faces
- Clean background with subtle gradient (white to very light blue)
`;

async function generateImage() {
  console.log('🎨 Generating House DNA image with Imagen 3...\n');
  console.log('Prompt:', prompt.trim());
  console.log('\n');

  // Try Imagen 4 (imagen-3 was deprecated Nov 2025)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: prompt.trim() }],
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
    console.error('❌ API Error:', error);
    process.exit(1);
  }

  const data = await response.json();
  
  if (!data.predictions || data.predictions.length === 0) {
    console.error('❌ No images generated');
    console.error('Response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // Save the image
  const imageData = data.predictions[0].bytesBase64Encoded;
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'house-dna-friendly.jpg');
  
  fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
  
  console.log('✅ Image saved to:', outputPath);
  console.log('\n📝 Update the image path in src/app/page.tsx:');
  console.log('   Change: /images/woningpaspoort-mockup.jpg');
  console.log('   To:     /images/house-dna-friendly.jpg');
}

generateImage().catch(console.error);
