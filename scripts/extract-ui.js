const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

function extractFunction(name) {
    const regex = new RegExp(`function ${name}\\s*\\([\\s\\S]*?\\}\\s*(?=\\nfunction |\\nexport )`);
    const match = content.match(regex);
    if (match) {
        return match[0];
    }
    return null;
}

const uiDir = path.join(__dirname, '../components/ui');
if (!fs.existsSync(uiDir)) fs.mkdirSync(uiDir, { recursive: true });

// Icons
const icons = ['IconHeart', 'IconShare', 'IconCompare', 'IconStar', 'Stars'];
let iconsFile = 'import React from "react";\n\n';
for (const icon of icons) {
    const fn = extractFunction(icon);
    if (fn) iconsFile += fn.replace(`function ${icon}`, `export function ${icon}`) + '\n\n';
}
fs.writeFileSync(path.join(uiDir, 'Icons.tsx'), iconsFile);

// Badges
const badges = ['StatusPill', 'Badge', 'PremiumBadge', 'Diamond'];
let badgesFile = 'import React from "react";\nimport { IconStar } from "./Icons";\n\n';
for (const badge of badges) {
    const fn = extractFunction(badge);
    if (fn) badgesFile += fn.replace(`function ${badge}`, `export function ${badge}`) + '\n\n';
}
fs.writeFileSync(path.join(uiDir, 'Badges.tsx'), badgesFile);

// TeamCard, AgentMiniCard
let agentCards = 'import React from "react";\nimport { Stars } from "./Icons";\nimport { AgentAvatar } from "@/lib/mock-data";\n\n';
const teamCardFn = extractFunction('TeamCard');
if (teamCardFn) agentCards += teamCardFn.replace('function TeamCard', 'export function TeamCard') + '\n\n';
const agentMiniFn = extractFunction('AgentMiniCard');
if (agentMiniFn) agentCards += agentMiniFn.replace('function AgentMiniCard', 'export function AgentMiniCard') + '\n\n';
fs.writeFileSync(path.join(__dirname, '../components/AgentCards.tsx'), agentCards);

console.log('UI Components extracted');
