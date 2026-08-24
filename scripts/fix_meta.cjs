const fs = require('fs');
const path = require('path');

const filesToFix = [
    'app/dashboard/page.tsx',
    'app/doxxa-rentals/page.tsx',
    'app/login/page.tsx',
    'app/profile/page.tsx',
    'app/profile/security/page.tsx',
    'app/search/page.tsx',
    'app/properties/new/page.tsx',
    'app/saved/page.tsx',
    'app/register/page.tsx',
    'app/properties/p/[id]/page.tsx'
];

const basePath = process.cwd();

for (const p of filesToFix) {
    const file = path.join(basePath, p);
    if (!fs.existsSync(file)) {
        console.log('Not found:', file);
        continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    const metaRegex = /import type \{ Metadata \} from "next";[\s\n\r]*export const metadata: Metadata = \{([\s\S]*?)\};[\s\n\r]*/;
    const match = content.match(metaRegex);

    if (match) {
        console.log('Fixing:', p);
        let properties = match[1];

        content = content.replace(metaRegex, '');
        fs.writeFileSync(file, content);

        const dir = path.dirname(file);
        const layoutPath = path.join(dir, 'layout.tsx');

        if (!fs.existsSync(layoutPath)) {
            const layoutContent = "import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n" + properties + "\n};\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return children;\n}\n";
            fs.writeFileSync(layoutPath, layoutContent);
            console.log('  -> Created layout.tsx');
        } else {
            console.log('  -> Layout exists for', dir);

            let layoutContent = fs.readFileSync(layoutPath, 'utf8');
            if (!layoutContent.includes('export const metadata')) {
                layoutContent = "import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n" + properties + "  };\n\n" + layoutContent;
                fs.writeFileSync(layoutPath, layoutContent);
                console.log('  -> Injected into existing layout.tsx');
            }
        }
    }
}
