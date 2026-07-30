import { districts, District } from "./districts";
import { categories, PropertyCategory } from "./categories";
import { PropertyStatus } from "@/components/TrustBadge";
import { TrustBadgeType } from "@/components/TrustBadge";

export type Property = {
  id: string;
  title: string;
  district: District;
  category: PropertyCategory;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  serviced: boolean;
  status: PropertyStatus;
  badges: TrustBadgeType[];
  image: string;
};

const STATUSES: PropertyStatus[] = ["available", "available", "available", "reserved", "rented"];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Deterministic pseudo-listings. Swap this module for a real data source
// (API, CMS, database) later — every page that calls getProperties* stays
// unchanged because the Property shape is the contract, not this generator.
export function generateProperties(district: District, category: PropertyCategory, count = 6): Property[] {
  return Array.from({ length: count }).map((_, i) => {
    const seed = hash(`${district.slug}-${category.slug}-${i}`);
    const bedrooms = Math.max(1, (seed % 5) + 1);
    return {
      id: `${district.slug}-${category.slug}-${i}`,
      title: `${category.name} in ${district.name}`,
      district,
      category,
      price: 400_000 + (seed % 20) * 500_000,
      bedrooms,
      bathrooms: Math.max(1, bedrooms - 1),
      parking: seed % 3,
      furnished: seed % 2 === 0,
      serviced: seed % 3 === 0,
      status: STATUSES[seed % STATUSES.length],
      badges: [
        seed % 4 === 0 ? "doxxa-verified" : "verified-property",
        ...(seed % 5 === 0 ? (["featured"] as TrustBadgeType[]) : []),
        ...(seed % 7 === 0 ? (["new"] as TrustBadgeType[]) : []),
      ],
      image: district.image,
    } satisfies Property;
  });
}

export function getPropertiesByDistrict(districtSlug: string, count = 6): Property[] {
  const district = districts.find((d) => d.slug === districtSlug);
  if (!district) return [];
  const category = categories[hash(districtSlug) % categories.length];
  return generateProperties(district, category, count);
}

export function getPropertiesByCategory(categorySlug: string, count = 12): Property[] {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  const results: Property[] = [];
  districts.forEach((district, i) => {
    if (results.length >= count) return;
    results.push(...generateProperties(district, category, 1));
  });
  return results.slice(0, count);
}

export function formatPrice(n: number) {
  return `₦${n.toLocaleString("en-NG")} / year`;
}
