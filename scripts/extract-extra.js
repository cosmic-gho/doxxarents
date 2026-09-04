const fs = require('fs');
const path = require('path');
const pagePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

function extractFunction(name) {
    const regex = new RegExp(`function ${name}\\s*\\([\\s\\S]*?\\}\\s*(?=\\nfunction |\\nconst |\\nexport )`);
    const match = content.match(regex);
    if (match) {
        return match[0];
    }
    return null;
}

let extra = `import React, { useState, useEffect } from "react";
import { formatNaira, initials, getDistrictImage, getAgentPhoto } from "@/lib/mock-data";
import { IconHeart, IconCompare } from "./ui/Icons";
import { StatusPill, PremiumBadge } from "./ui/Badges";
\n\n`;

const toExtract = ['AgentAvatar', 'DistrictHeroImage', 'Logo', 'Rule', 'FadeUp', 'PropertyCard', 'useParallax', 'EmptyState'];
for (const c of toExtract) {
    const fn = extractFunction(c);
    if (fn) extra += fn.replace(`function ${c}`, `export function ${c}`) + '\n\n';
}

fs.writeFileSync(path.join(__dirname, '../components/SharedUI.tsx'), extra);
console.log('Extracted more components');
