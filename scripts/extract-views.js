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

const viewsDir = path.join(__dirname, '../components/views');
if (!fs.existsSync(viewsDir)) fs.mkdirSync(viewsDir, { recursive: true });

const views = [
    'Home',
    'FilterBar',
    'Search',
    'CategoryCard',
    'DistrictPage',
    'DistrictCategoryListings',
    'CostRow',
    'MoveInCalculator',
    'GalleryTile',
    'Lightbox',
    'PropertyGallery',
    'ThreeDTourSection',
    'PremiumUnlockPanel',
    'PropertyDetail',
    'AgentProfile',
    'SavedView',
    'CompareView',
    'CheckoutView',
    'PremiumSuccessView',
    'SignupView',
    'AboutPage'
];

let viewsFile = `// @ts-nocheck
import React, { useState } from "react";
import { ALL_PROPERTIES, DISTRICT_LIST, PROPERTY_CATEGORIES, TEAM_LIST, formatNaira, getDistrictImage, getAgent, getPropertyImages, getNearbyPlaces, REVIEW_TEMPLATES } from "@/lib/mock-data";
import { IconHeart, IconShare, IconCompare, IconStar, Stars } from "@/components/ui/Icons";
import { StatusPill, Badge, PremiumBadge, Diamond } from "@/components/ui/Badges";
import { PropertyCard, FadeUp, Rule, AgentAvatar, DistrictHeroImage } from "@/components/SharedUI";
import { TeamCard, AgentMiniCard } from "@/components/AgentCards";
import { useParallax, EmptyState } from "@/components/SharedUI";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
\n\n`;

for (const v of views) {
    const fn = extractFunction(v);
    if (fn) {
        viewsFile += fn.replace(`function ${v}`, `export function ${v}`) + '\n\n';
    }
}

fs.writeFileSync(path.join(viewsDir, 'Views.tsx'), viewsFile);
console.log('Views extracted');
