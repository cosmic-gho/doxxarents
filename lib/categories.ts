export type PropertyCategory = {
  slug: string;
  name: string;
  description: string;
};

// Add a new category here and /properties/{slug} works immediately —
// list, filters, and cards are all generated from this one entry.
export const categories: PropertyCategory[] = [
  { slug: "self-contain", name: "Self Contain", description: "Single-room living with a private bath, ideal for individuals starting out." },
  { slug: "room-and-parlour", name: "Room & Parlour", description: "One bedroom plus a separate living area, a step up in space and privacy." },
  { slug: "mini-flat", name: "Mini Flat", description: "A compact self-contained unit with a bedroom, living room, and kitchen." },
  { slug: "studio-apartment", name: "Studio Apartment", description: "Open-plan living for renters who want efficiency without compromise." },
  { slug: "1-bedroom", name: "1 Bedroom", description: "A full bedroom, living space, and kitchen for individuals or couples." },
  { slug: "2-bedroom", name: "2 Bedroom", description: "Comfortable space for small families or roommates." },
  { slug: "3-bedroom", name: "3 Bedroom", description: "Popular with families across Abuja's residential districts." },
  { slug: "4-bedroom", name: "4 Bedroom", description: "Spacious family homes with room to grow." },
  { slug: "5-bedroom", name: "5 Bedroom", description: "Large-format homes for extended families and entertaining." },
  { slug: "duplex", name: "Duplex", description: "Two-storey living, a signature of Abuja's premium residential estates." },
  { slug: "terrace-house", name: "Terrace House", description: "Connected multi-storey homes within secured estates." },
  { slug: "semi-detached-house", name: "Semi Detached House", description: "Shared-wall homes with private entrances and yards." },
  { slug: "detached-house", name: "Detached House", description: "Fully standalone homes with maximum privacy." },
  { slug: "penthouse", name: "Penthouse", description: "Top-floor residences with skyline views and premium finishes." },
  { slug: "office-space", name: "Office Space", description: "Commercial units across Abuja's business districts." },
  { slug: "shop", name: "Shop", description: "Retail units in high-footfall commercial corridors." },
  { slug: "warehouse", name: "Warehouse", description: "Storage and light-industrial space on the city's outskirts." },
  { slug: "land", name: "Land", description: "Titled and developing plots for future construction." },
];

export function getCategory(slug: string): PropertyCategory | undefined {
  return categories.find((c) => c.slug === slug);
}
