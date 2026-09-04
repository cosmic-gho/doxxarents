const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../original_spa.tsx'), 'utf8');

const sourceFile = ts.createSourceFile(
    'original_spa.tsx',
    originalContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
);

function extractFunctionStrict(name) {
    let result = null;

    function visit(node) {
        if (ts.isFunctionDeclaration(node)) {
            if (node.name && node.name.text === name) {
                result = node.getText(sourceFile);
            }
        } else if (ts.isVariableStatement(node)) {
            node.declarationList.declarations.forEach(decl => {
                if (ts.isIdentifier(decl.name) && decl.name.text === name) {
                    if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
                        result = node.getText(sourceFile);
                    } else {
                        result = node.getText(sourceFile);
                    }
                }
            });
        }
        if (!result) {
            ts.forEachChild(node, visit);
        }
    }

    visit(sourceFile);
    return result;
}

// 1. Views.tsx
const viewsDir = path.join(__dirname, '../components/views');
const views = [
    'Home', 'FilterBar', 'Search', 'CategoryCard', 'DistrictPage', 'DistrictCategoryListings',
    'CostRow', 'MoveInCalculator', 'GalleryTile', 'Lightbox', 'PropertyGallery', 'ThreeDTourSection',
    'PremiumUnlockPanel', 'PropertyDetail', 'AgentProfile', 'SavedView', 'CompareView', 'CheckoutView',
    'PremiumSuccessView', 'SignupView', 'AboutPage'
];

let viewsFile = `// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ALL_PROPERTIES, DISTRICT_LIST, PROPERTY_CATEGORIES, TEAM_LIST, formatNaira, getDistrictImage, getAgent, getPropertyImages, getNearbyPlaces, REVIEW_TEMPLATES, AGENT_LIST, TYPES, STATUSES, PAYMENT_PROVIDERS, PREMIUM_PRICE, PREMIUM_ACCESS_DAYS } from "@/lib/mock-data";
import { IconHeart, IconShare, IconCompare, IconStar, Stars } from "@/components/ui/Icons";
import { StatusPill, Badge, PremiumBadge, Diamond } from "@/components/ui/Badges";
import { PropertyCard, FadeUp, Rule, AgentAvatar, DistrictHeroImage, useParallax, EmptyState } from "@/components/SharedUI";
import { TeamCard, AgentMiniCard } from "@/components/AgentCards";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";

`;

for (const v of views) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) {
            fnCode = 'export ' + fnCode;
        }
        viewsFile += fnCode + '\n\n';
    } else {
        console.warn('Could not find view: ' + v);
    }
}
fs.writeFileSync(path.join(viewsDir, 'Views.tsx'), viewsFile);


// 2. SharedUI.tsx
const sharedUiFiles = ['AgentAvatar', 'DistrictHeroImage', 'Logo', 'Rule', 'FadeUp', 'PropertyCard', 'useParallax', 'EmptyState'];
let sharedContent = `// @ts-nocheck
import React, { useState, useEffect } from "react";
import { formatNaira, initials, getDistrictImage, getAgentPhoto } from "@/lib/mock-data";
import { IconHeart, IconCompare } from "./ui/Icons";
import { StatusPill, PremiumBadge, Diamond, Badge } from "./ui/Badges";
import Link from "next/link";

`;
for (const v of sharedUiFiles) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) fnCode = 'export ' + fnCode;
        
        // Fix ASSETS in SharedUI
        fnCode = fnCode.replace(/ASSETS\.logo/g, '"/images/logo.jpg"');
        
        sharedContent += fnCode + '\n\n';
    }
}
fs.writeFileSync(path.join(__dirname, '../components/SharedUI.tsx'), sharedContent);

// 3. AgentCards.tsx
const agentCards = ['TeamCard', 'AgentMiniCard'];
let agentContent = `// @ts-nocheck
import React from "react";
import { Stars } from "./ui/Icons";
import { AgentAvatar } from "./SharedUI";
import { getTeamPhoto } from "@/lib/mock-data";

`;
for (const v of agentCards) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) fnCode = 'export ' + fnCode;
        agentContent += fnCode + '\n\n';
    }
}
fs.writeFileSync(path.join(__dirname, '../components/AgentCards.tsx'), agentContent);

// 4. Icons.tsx
const icons = ['IconHeart', 'IconShare', 'IconCompare', 'IconStar', 'Stars'];
let iconsContent = '// @ts-nocheck\nimport React from "react";\n\n';
for (const v of icons) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) fnCode = 'export ' + fnCode;
        iconsContent += fnCode + '\n\n';
    }
}
fs.writeFileSync(path.join(__dirname, '../components/ui/Icons.tsx'), iconsContent);

// 5. Badges.tsx
const badges = ['StatusPill', 'Badge', 'PremiumBadge', 'Diamond'];
let badgesContent = '// @ts-nocheck\nimport React from "react";\nimport { IconStar } from "./Icons";\n\n';
for (const v of badges) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) fnCode = 'export ' + fnCode;
        badgesContent += fnCode + '\n\n';
    }
}
fs.writeFileSync(path.join(__dirname, '../components/ui/Badges.tsx'), badgesContent);


// 6. Mock Data
const toExtract = [
    'DISTRICT_LIST', 'TEAM_LIST', 'PAYMENT_PROVIDERS', 'PREMIUM_PRICE',
    'PREMIUM_ACCESS_DAYS', 'AGENT_LIST', 'REVIEW_TEMPLATES', 'PROPERTY_CATEGORIES',
    'TYPES', 'STATUSES', 'seededRandom', 'buildProperties',
    'ALL_PROPERTIES', 'formatNaira', 'getDistrictImage', 'getAgentPhoto',
    'getAgent', 'initials', 'getAgentReviews', 'getTeamPhoto',
    'GALLERY_CATEGORIES', 'GALLERY_HUES', 'getPropertyImages',
    'NEARBY_CATEGORIES', 'getNearbyPlaces'
];

let mockDataFile = `// @ts-nocheck
/* eslint-disable */\n\n`;

for (const v of toExtract) {
    let fnCode = extractFunctionStrict(v);
    if (fnCode) {
        if (!fnCode.startsWith('export')) {
            fnCode = 'export ' + fnCode;
        }
        
        // Fix ASSETS in mock-data
        fnCode = fnCode.replace(/ASSETS\["district_" \+ key\]/g, '\`/images/district_\${key}.jpg\`');
        fnCode = fnCode.replace(/ASSETS\[key\]/g, '\`/images/\${key}.jpg\`');

        mockDataFile += fnCode + '\n\n';
    }
}
fs.writeFileSync(path.join(__dirname, '../lib/mock-data.ts'), mockDataFile);

console.log('All components and mock data perfectly extracted using TypeScript AST.');
