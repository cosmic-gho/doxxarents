const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../original_spa.tsx'), 'utf8');

function extractFunctionStrict(name) {
    const fnStart = `function ${name}(`;
    const startIdx = originalContent.indexOf(fnStart);
    if (startIdx === -1) return null;

    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let started = false;

    for (let i = startIdx; i < originalContent.length; i++) {
        const char = originalContent[i];
        
        if (!inString && (char === '"' || char === "'" || char === '\`')) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar && originalContent[i-1] !== '\\') {
            inString = false;
        }

        if (!inString) {
            if (char === '{') {
                braceCount++;
                started = true;
            } else if (char === '}') {
                braceCount--;
            }
        }

        if (started && braceCount === 0) {
            return originalContent.substring(startIdx, i + 1);
        }
    }
    return null;
}

// 1. SharedUI.tsx
const sharedUiFiles = ['AgentAvatar', 'DistrictHeroImage', 'Logo', 'Rule', 'FadeUp', 'PropertyCard', 'useParallax', 'EmptyState'];
let sharedContent = `import React, { useState, useEffect } from "react";
import { formatNaira, initials, getDistrictImage, getAgentPhoto } from "@/lib/mock-data";
import { IconHeart, IconCompare } from "./ui/Icons";
import { StatusPill, PremiumBadge } from "./ui/Badges";

`;
for (const v of sharedUiFiles) {
    const fnCode = extractFunctionStrict(v);
    if (fnCode) sharedContent += fnCode.replace(`function ${v}`, `export function ${v}`) + '\n\n';
}
fs.writeFileSync(path.join(__dirname, '../components/SharedUI.tsx'), sharedContent);

// 2. AgentCards.tsx
const agentCards = ['TeamCard', 'AgentMiniCard'];
let agentContent = `import React from "react";
import { Stars } from "./ui/Icons";
import { AgentAvatar } from "./SharedUI";
import { getTeamPhoto } from "@/lib/mock-data";

`;
for (const v of agentCards) {
    const fnCode = extractFunctionStrict(v);
    if (fnCode) agentContent += fnCode.replace(`function ${v}`, `export function ${v}`) + '\n\n';
}
fs.writeFileSync(path.join(__dirname, '../components/AgentCards.tsx'), agentContent);

// 3. Icons.tsx
const icons = ['IconHeart', 'IconShare', 'IconCompare', 'IconStar', 'Stars'];
let iconsContent = 'import React from "react";\n\n';
for (const v of icons) {
    const fnCode = extractFunctionStrict(v);
    if (fnCode) iconsContent += fnCode.replace(`function ${v}`, `export function ${v}`) + '\n\n';
}
fs.writeFileSync(path.join(__dirname, '../components/ui/Icons.tsx'), iconsContent);

// 4. Badges.tsx
const badges = ['StatusPill', 'Badge', 'PremiumBadge', 'Diamond'];
let badgesContent = 'import React from "react";\nimport { IconStar } from "./Icons";\n\n';
for (const v of badges) {
    const fnCode = extractFunctionStrict(v);
    if (fnCode) badgesContent += fnCode.replace(`function ${v}`, `export function ${v}`) + '\n\n';
}
fs.writeFileSync(path.join(__dirname, '../components/ui/Badges.tsx'), badgesContent);

console.log('All remaining UI components strictly extracted from original_spa.tsx.');
