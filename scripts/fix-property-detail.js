const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../components/views/Views.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'const similar = ALL_PROPERTIES.filter((p) => p.districtKey === property.districtKey && p.id !== property.id).slice(0, 3);',
    'const similar = similarProperties || ALL_PROPERTIES.filter((p) => p.districtKey === property.districtKey && String(p.id) !== String(property.id)).slice(0, 3);'
);

fs.writeFileSync(file, content);
console.log('done');
