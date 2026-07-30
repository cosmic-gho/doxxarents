# DOXXARentals

Premium rental platform for Abuja, Nigeria. Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

## What's built

- **Brand system**: centralized `Logo` component reads from one config path
  (`lib` has no hardcoded logo references anywhere), so replacing
  `public/images/logo/doxxarents-logo.jpg` and `favicon.png` updates the logo
  everywhere — navbar, footer, and metadata favicon.
- **Home page** (`app/page.tsx`): hero, trust strip, featured districts,
  property-type grid, how-it-works.
- **About page** (`app/about/page.tsx`): company narrative + full leadership
  team section (5 executives, photos, bios, experience lines).
- **Districts**: `app/districts/page.tsx` (index of all 20) and
  `app/districts/[slug]/page.tsx` — **one template** that renders hero,
  overview, average rent, featured properties, available listings, property
  categories, featured agents, nearby schools/hospitals/shopping/restaurants,
  a map placeholder, and similar districts, for **every** district. Add a new
  district by adding one entry to `lib/districts.ts` — no new files needed.
- **Property categories**: `app/properties/[category]/page.tsx` — one
  template with a filter bar (district, budget, bedrooms, bathrooms, parking,
  furnished, serviced, pet friendly, verification) and listing grid, driven
  by `lib/categories.ts`. Add a category the same way.
- **Trust system**: `components/TrustBadge.tsx` implements Verified Property,
  Verified Agent, Doxxa Verified, Featured, New Listing, and the five
  property statuses (Available, Reserved, Rented, Pending Verification,
  Under Review).
- **Mobile**: sticky action bar (Save / Call / WhatsApp / Book Inspection)
  on category/listing pages.

## Data layer (swap-in ready)

Everything currently reads from typed mock generators so every page has
realistic content without a backend:

- `lib/districts.ts` — 20 districts, image resolution with automatic
  fallback to `default-abuja.jpg` if a district has no dedicated photo yet
  (currently: wuse, katampe, katampe-extension, utako, lokogoma, kado,
  dawaki — drop a real photo in `public/images/districts/{slug}.jpg` to
  upgrade any of these).
- `lib/categories.ts` — 18 property categories.
- `lib/properties.ts` — deterministic mock listings per district/category.
  Replace `generateProperties` with a real API/database call; every
  component consuming `Property` stays unchanged.
- `lib/agents.ts`, `lib/nearby.ts` — placeholder agents and nearby-place
  data, same swap-in pattern.

## Scaffolded, not yet built out

Given the platform's full scope (property detail pages, book-inspection
flow, side-by-side comparison, saved searches, auth/dashboard, individual
agent profiles), this pass focused on the core browsing experience and the
About/Team page you asked for directly. The data layer and page templates
above are structured so each of those is a natural next slice — happy to
build any of them out next.
