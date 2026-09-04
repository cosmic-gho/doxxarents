const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../original_spa.tsx'), 'utf8');

function extractBlockStrict(startPhrase) {
    const startIdx = originalContent.indexOf(startPhrase);
    if (startIdx === -1) return null;

    let i = startIdx;
    let braceCount = 0;
    let bracketCount = 0;
    let parenCount = 0;
    let inString = false;
    let stringChar = '';
    let started = false;

    // Find the first opening token after the start phrase
    for (; i < originalContent.length; i++) {
        const char = originalContent[i];
        if (char === '{' || char === '[' || char === '(') {
            if (char === '{') braceCount++;
            if (char === '[') bracketCount++;
            if (char === '(') parenCount++;
            started = true;
            break;
        }
        // If it's a simple primitive assignment like `const PREMIUM_PRICE = 1200;`
        if (char === ';') {
            return originalContent.substring(startIdx, i + 1);
        }
    }

    if (!started) return null;

    for (i++; i < originalContent.length; i++) {
        const char = originalContent[i];
        
        if (!inString && (char === '"' || char === "'" || char === '\`')) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar && originalContent[i-1] !== '\\') {
            inString = false;
        }

        if (!inString) {
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;
            else if (char === '(') parenCount++;
            else if (char === ')') parenCount--;
        }

        if (braceCount === 0 && bracketCount === 0 && parenCount === 0) {
            // Find the semicolon if it exists
            let endIdx = i + 1;
            while (endIdx < originalContent.length && /\s/.test(originalContent[endIdx])) {
                endIdx++;
            }
            if (originalContent[endIdx] === ';') endIdx++;
            return originalContent.substring(startIdx, endIdx);
        }
    }
    return null;
}

const toExtract = [
    'const DISTRICT_LIST', 'const TEAM_LIST', 'const PAYMENT_PROVIDERS', 'const PREMIUM_PRICE',
    'const PREMIUM_ACCESS_DAYS', 'const AGENT_LIST', 'const REVIEW_TEMPLATES', 'const PROPERTY_CATEGORIES',
    'const TYPES', 'const STATUSES', 'function seededRandom', 'function buildProperties',
    'const ALL_PROPERTIES', 'function formatNaira', 'function getDistrictImage', 'function getAgentPhoto',
    'function getAgent', 'function initials', 'function getAgentReviews', 'function getTeamPhoto',
    'const GALLERY_CATEGORIES', 'const GALLERY_HUES', 'function getPropertyImages',
    'const NEARBY_CATEGORIES', 'function getNearbyPlaces'
];

let mockDataFile = `// @ts-nocheck
/* eslint-disable */\n\n`;

for (const e of toExtract) {
    const isConst = e.startsWith('const');
    const name = e.split(' ')[1];
    const block = extractBlockStrict(e);
    if (block) {
        if (isConst) {
            mockDataFile += block.replace(`const ${name}`, `export const ${name}`) + '\n\n';
        } else {
            mockDataFile += block.replace(`function ${name}`, `export function ${name}`) + '\n\n';
        }
    } else {
        console.warn('Could not extract ' + e);
    }
}

fs.writeFileSync(path.join(__dirname, '../lib/mock-data.ts'), mockDataFile);
console.log('Mock data correctly extracted.');
