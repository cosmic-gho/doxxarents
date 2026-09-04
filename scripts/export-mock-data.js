const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../lib/mock-data.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

const toExport = ['DISTRICT_LIST', 'TEAM_LIST', 'PAYMENT_PROVIDERS', 'PREMIUM_PRICE', 'PREMIUM_ACCESS_DAYS', 'AGENT_LIST', 'REVIEW_TEMPLATES', 'PROPERTY_CATEGORIES', 'TYPES', 'STATUSES', 'ALL_PROPERTIES'];

for (const name of toExport) {
    content = content.replace(new RegExp(`const ${name} `, 'g'), `export const ${name} `);
}

const functionsToExport = ['seededRandom', 'buildProperties', 'formatNaira', 'getDistrictImage'];
for (const name of functionsToExport) {
    content = content.replace(new RegExp(`function ${name}`, 'g'), `export function ${name}`);
}

fs.writeFileSync(mockDataPath, content);
console.log('Added exports to mock-data.ts');
