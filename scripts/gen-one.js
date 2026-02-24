const https = require('https');
const fs = require('fs');

const API_KEY = process.env.OPENROUTER_KEY;
const MODEL = 'google/gemini-2.5-flash-image';
const OUT_DIR = '/Users/dave/Development/patterndex/img';

const id = process.argv[2];
const name = process.argv[3];
const prompt = process.argv[4];

if (!id || !name || !prompt) {
  console.log('Usage: node gen-one.js <id> <name> <prompt>');
  process.exit(1);
}

const STYLE_PREFIX = 'Generate a pixel art creature sprite. Style: 16-bit pixel art, vibrant colors, black background (#000000), RPG monster/creature style, clean pixel edges. The creature should be centered, facing forward, full body visible, with no text or labels. Make it look like a collectible creature from a retro video game bestiary.\n\nCreature: ';

const body = JSON.stringify({
  model: MODEL,
  messages: [{ role: 'user', content: STYLE_PREFIX + prompt }]
});

const req = https.request({
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
}, res => {
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const resp = JSON.parse(Buffer.concat(chunks).toString());
    if (resp.error) { console.log('Error:', JSON.stringify(resp.error)); return; }
    const msg = resp.choices[0].message;
    if (msg.content) console.log('Text:', msg.content);
    if (msg.images && msg.images.length > 0) {
      const url = msg.images[0].image_url.url;
      const match = url.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const buf = Buffer.from(match[2], 'base64');
        const outPath = `${OUT_DIR}/${id}-${name}.png`;
        fs.writeFileSync(outPath, buf);
        console.log('Saved:', outPath, '(' + (buf.length / 1024).toFixed(0) + 'KB)');
      }
    } else {
      console.log('No images returned');
    }
    console.log('Cost: $' + (resp.usage && resp.usage.cost || '?'));
  });
});

req.on('error', e => console.error('Request error:', e.message));
req.write(body);
req.end();
