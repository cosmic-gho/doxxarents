const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../lib/mock-data.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

const functionsToExport = ['getAgentPhoto', 'getAgent', 'initials', 'getAgentReviews', 'getTeamPhoto', 'getPropertyImages', 'getNearbyPlaces'];
for (const name of functionsToExport) {
    content = content.replace(new RegExp(`function ${name}`, 'g'), `export function ${name}`);
}

const constsToExport = ['GALLERY_CATEGORIES', 'GALLERY_HUES', 'NEARBY_CATEGORIES'];
for (const name of constsToExport) {
    content = content.replace(new RegExp(`const ${name} `, 'g'), `export const ${name} `);
}

fs.writeFileSync(mockDataPath, content);
console.log('Added more exports to mock-data.ts');
