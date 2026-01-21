/**
 * Fix Smart Home Cutaway Image
 * Using Gemini 3 Pro Image Preview
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY required. Get one at: https://aistudio.google.com/app/apikey');
  process.exit(1);
}
const MODEL = 'gemini-3-pro-image-preview';

const outputPath = path.join(__dirname, '..', 'public', 'images', 'ai', 'smart-home-cutaway.jpg');

const prompt = `Ultra minimal architectural visualization.
A single modern house shown as a clean white wireframe/blueprint on a pure dark navy (#0d1117) background.
The house is a simple two-story modern design with clean geometric lines.
Show it as an elegant technical drawing with very thin white lines.
NO furniture, NO people, NO complex details.
Just the pure architectural form - walls, windows, roof, stairs.
Subtle golden (#f59e0b) accent on one element like the door or a window frame.
Maximum negative space around the house.
Premium Apple-style minimalism.
Museum-quality architectural illustration.
No gradients, no busy backgrounds, no artifacts.
Clean edges, centered composition.`;

async function generateImage() {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {
          aspectRatio: '16:9',
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

    console.log('🎨 Generating cleaner smart home image...');

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

async function main() {
  try {
    // Delete old image
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log('🗑️  Deleted old image');
    }

    const result = await generateImage();
    const buffer = Buffer.from(result.data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Saved: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

main();
