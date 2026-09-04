const fs = require('fs');
const path = require('path');
const mockDataPath = path.join(__dirname, '../lib/mock-data.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Remove React components
content = content.replace(/function AgentAvatar[\s\S]*?\n\}\n/g, '');
content = content.replace(/function DistrictHeroImage[\s\S]*?\n\}\n/g, '');

fs.writeFileSync(mockDataPath, content);
console.log('Removed React components from mock-data.ts');
