const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../components/views/Views.tsx');
let content = fs.readFileSync(file, 'utf8');

// The block to strip starts with `\n// --- Section 2:` and ends right before `export function SignupView`
const regex = /\n\/\/ --- Section 2: separate renter \/ agent sign-up experience ---[\s\S]*?(?=export function SignupView)/;
content = content.replace(regex, '\n\n');

fs.writeFileSync(file, content);
console.log('Fixed Views.tsx');
