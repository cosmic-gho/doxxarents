const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
const imagesDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const content = fs.readFileSync(pagePath, 'utf8');

// Match the ASSETS object
const assetsMatch = content.match(/const ASSETS = (\{[\s\S]*?\});/);

if (assetsMatch) {
  const assetsStr = assetsMatch[1];
  try {
    const assets = new Function('return ' + assetsStr)();
    
    for (const [key, value] of Object.entries(assets)) {
      const matches = value.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        let ext = matches[1];
        if (ext === 'jpeg') ext = 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${key}.${ext}`;
        fs.writeFileSync(path.join(imagesDir, filename), buffer);
        console.log(`Saved ${filename}`);
      }
    }
    console.log("Extraction complete!");
  } catch (e) {
    console.error("Error parsing ASSETS object:", e);
  }
} else {
  console.log("Could not find ASSETS object.");
}
