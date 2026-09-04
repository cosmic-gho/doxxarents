const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../components/views/Views.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove any TeamCard definition from Views.tsx
content = content.replace(/function TeamCard[\s\S]*?\n\}\n/g, '');

// Remove any SignupView definition that DOES NOT start with `export `
// First, find all SignupView and replace them.
// Wait, an easier way is to just take the first `export function SignupView` and keep it, remove all other `SignupView`s.
// Actually, let's just use regex to remove `\nfunction SignupView([\s\S]*?)\n\}\n` completely.
content = content.replace(/\nfunction SignupView[\s\S]*?\n\}\n/g, '');

fs.writeFileSync(file, content);
console.log('Cleaned up duplicates in Views.tsx');
