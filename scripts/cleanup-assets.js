const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Remove ASSETS dictionary
content = content.replace(/\/\/ Auto-generated image asset map\r?\nconst ASSETS = \{[\s\S]*?\};\r?\n/, '');

// Replace usage
content = content.replace(/ASSETS\["district_" \+ key\]/g, '`/images/district_${key}.jpg`');
content = content.replace(/ASSETS\[key\]/g, '`/images/${key}.jpg`');
content = content.replace(/ASSETS\.logo/g, '"/images/logo.jpg"');

fs.writeFileSync(pagePath, content);
console.log('Cleaned up ASSETS from page.tsx');
