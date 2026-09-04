const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../original_spa.tsx'), 'utf8');

function extractFunctionStrict(name) {
    const fnStart = `function ${name}(`;
    const startIdx = originalContent.indexOf(fnStart);
    if (startIdx === -1) return null;

    // First find the matching closing parenthesis for the argument list
    let i = startIdx + fnStart.length - 1; // points to '('
    let parenCount = 0;
    let inString = false;
    let stringChar = '';
    
    for (; i < originalContent.length; i++) {
        const char = originalContent[i];
        if (!inString && (char === '"' || char === "'" || char === '\`')) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar && originalContent[i-1] !== '\\') {
            inString = false;
        }

        if (!inString) {
            if (char === '(') parenCount++;
            else if (char === ')') {
                parenCount--;
                if (parenCount === 0) {
                    break; // Found the matching ')'
                }
            }
        }
    }

    // Now find the first '{' after the ')'
    i++;
    while (i < originalContent.length && originalContent[i] !== '{') {
        i++;
    }

    if (i >= originalContent.length) return null; // Should not happen

    // Now do brace counting starting from this '{'
    let braceCount = 0;
    inString = false;
    let started = false;

    for (; i < originalContent.length; i++) {
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

const viewsDir = path.join(__dirname, '../components/views');
const views = [
    'Home', 'FilterBar', 'Search', 'CategoryCard', 'DistrictPage', 'DistrictCategoryListings',
    'CostRow', 'MoveInCalculator', 'GalleryTile', 'Lightbox', 'PropertyGallery', 'ThreeDTourSection',
    'PremiumUnlockPanel', 'PropertyDetail', 'AgentProfile', 'SavedView', 'CompareView', 'CheckoutView',
    'PremiumSuccessView', 'SignupView', 'AboutPage'
];

let viewsFile = `// @ts-nocheck
import React, { useState } from "react";
import { ALL_PROPERTIES, DISTRICT_LIST, PROPERTY_CATEGORIES, TEAM_LIST, formatNaira, getDistrictImage, getAgent, getPropertyImages, getNearbyPlaces, REVIEW_TEMPLATES } from "@/lib/mock-data";
import { IconHeart, IconShare, IconCompare, IconStar, Stars } from "@/components/ui/Icons";
import { StatusPill, Badge, PremiumBadge, Diamond } from "@/components/ui/Badges";
import { PropertyCard, FadeUp, Rule, AgentAvatar, DistrictHeroImage, useParallax, EmptyState } from "@/components/SharedUI";
import { TeamCard, AgentMiniCard } from "@/components/AgentCards";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";

`;

for (const v of views) {
    const fnCode = extractFunctionStrict(v);
    if (fnCode) {
        viewsFile += fnCode.replace(`function ${v}`, `export function ${v}`) + '\n\n';
    }
}

fs.writeFileSync(path.join(viewsDir, 'Views.tsx'), viewsFile);


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

console.log('All components correctly extracted.');
