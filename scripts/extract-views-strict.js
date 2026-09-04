const fs = require('fs');
const path = require('path');

const originalContent = fs.readFileSync(path.join(__dirname, '../original_spa.tsx'), 'utf8');

function extractFunctionStrict(name) {
    const fnStart = `function ${name}(`;
    const startIdx = originalContent.indexOf(fnStart);
    if (startIdx === -1) {
        console.warn('Could not find function: ' + name);
        return null;
    }

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
console.log('Views correctly extracted using brace counting.');
