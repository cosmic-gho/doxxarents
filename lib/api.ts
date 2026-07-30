import { District as FEDistrict, districts as staticDistricts, getDistrict as getStaticDistrict, featuredDistrictSlugs } from "./districts";
import { PropertyCategory, categories as staticCategories, getCategory as getStaticCategory } from "./categories";
import { Property as FEProperty, formatPrice as _formatPrice } from "./properties";
import type { PropertyStatus, TrustBadgeType } from "@/components/TrustBadge";

export const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ??
  "http://localhost:8000";

const DEFAULT_CACHE: RequestCache = "no-store";

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      cache: DEFAULT_CACHE,
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type BackendDistrict = {
  id: number;
  name: string;
  slug: string;
};

export type BackendCategory = {
  slug: string;
  name: string;
  description: string;
  listing_count: number;
  apartment_types: string[];
};

export type BackendPropertyImage = { id: number; image: string | null; is_primary: boolean };

export type BackendAgent = {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  profile_picture: string | null;
};

export type BackendProperty = {
  id: number;
  title: string;
  description: string;
  agent: BackendAgent | null;
  monthly_rent: string | number;
  apartment_type: string;
  bedrooms: number;
  bathrooms: number;
  district: number | null;
  district_details: BackendDistrict | null;
  address: string;
  latitude: string | number | null;
  longitude: string | number | null;
  is_verified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RENTED";
  amenities: number[];
  amenities_details: { id: number; name: string }[];
  date_posted: string;
  views_count?: number;
  images: BackendPropertyImage[];
};

export const API_PATHS = {
  districts: "/api/districts/",
  district: (slug: string) => `/api/districts/${slug}/`,
  categories: "/api/categories/",
  properties: "/api/properties/",
  property: (id: number) => `/api/properties/${id}/`,
  amenities: "/api/amenities/",
  inspections: "/api/inspections/",
  saved: "/api/saved/",
  analytics: "/api/analytics/",
};

const DEFAULT_DISTRICT_IMAGE = "/images/districts/default-abuja.jpg";

function mergeDistrictWithStatic(bd: BackendDistrict): FEDistrict {
  const staticMatch = getStaticDistrict(bd.slug);
  if (staticMatch) return staticMatch;
  return {
    slug: bd.slug,
    name: bd.name,
    city: "Abuja",
    image: DEFAULT_DISTRICT_IMAGE,
    hasCustomImage: false,
    avgRent: "Contact agent",
    lifestyle: "Residential district in Abuja.",
    popularTypes: ["2 Bedroom", "3 Bedroom", "Mini Flat"],
    landmarks: [],
  };
}

function feCategoryFromBackend(bc: BackendCategory | null | undefined, slug: string): PropertyCategory {
  const staticMatch = getStaticCategory(slug);
  if (bc) {
    return {
      slug: bc.slug,
      name: bc.name ?? staticMatch?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: bc.description ?? staticMatch?.description ?? "",
    };
  }
  return staticMatch ?? { slug, name: slug.replace(/-/g, " "), description: "" };
}

function apartmentTypeToCategorySlug(apartmentType: string): string {
  switch (apartmentType) {
    case "STUDIO":
      return "studio-apartment";
    case "1_BEDROOM":
      return "1-bedroom";
    case "2_BEDROOM":
      return "2-bedroom";
    case "3_BEDROOM":
      return "3-bedroom";
    case "4_BEDROOM":
      return "4-bedroom";
    case "DUPLEX":
      return "duplex";
    case "VILLA":
      return "detached-house";
    default:
      return "2-bedroom";
  }
}

function backendStatusToFE(status: BackendProperty["status"], isVerified: boolean): PropertyStatus {
  if (status === "RENTED") return "rented";
  if (status === "REJECTED") return "under-review";
  if (status === "PENDING") return "pending-verification";
  if (!isVerified) return "pending-verification";
  return "available";
}

function computeBadges(p: BackendProperty, daysOld: number): TrustBadgeType[] {
  const badges: TrustBadgeType[] = [];
  if (p.is_verified) badges.push("doxxa-verified");
  else badges.push("verified-property");
  if (daysOld <= 7) badges.push("new");
  if ((p.views_count ?? 0) >= 50) badges.push("featured");
  return badges;
}

const DEFAULT_PROPERTY_IMAGE = "/images/districts/default-abuja.jpg";

export function adaptBackendProperty(
  bp: BackendProperty,
  opts?: { districtsBySlug?: Record<string, FEDistrict>; categoriesBySlug?: Record<string, PropertyCategory> }
): FEProperty {
  const categorySlug = apartmentTypeToCategorySlug(bp.apartment_type);
  const category: PropertyCategory =
    opts?.categoriesBySlug?.[categorySlug] ?? getStaticCategory(categorySlug) ?? {
      slug: categorySlug,
      name: categorySlug.replace(/-/g, " "),
      description: "",
    };

  let district: FEDistrict;
  const distSlug = bp.district_details?.slug;
  if (opts?.districtsBySlug && distSlug && opts.districtsBySlug[distSlug]) {
    district = opts.districtsBySlug[distSlug];
  } else if (distSlug && getStaticDistrict(distSlug)) {
    district = getStaticDistrict(distSlug)!;
  } else if (bp.district_details) {
    district = mergeDistrictWithStatic(bp.district_details);
  } else {
    district = staticDistricts[0];
  }

  const primary = bp.images.find((i) => i.is_primary) ?? bp.images[0];
  const image = primary?.image ?? district.image ?? DEFAULT_PROPERTY_IMAGE;

  const daysOld = (() => {
    try {
      const posted = new Date(bp.date_posted).getTime();
      return Math.max(0, Math.floor((Date.now() - posted) / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  })();

  const price = typeof bp.monthly_rent === "number" ? bp.monthly_rent : Number(bp.monthly_rent) || 0;

  return {
    id: String(bp.id),
    title: bp.title,
    district,
    category,
    price,
    bedrooms: bp.bedrooms ?? 0,
    bathrooms: bp.bathrooms ?? 0,
    parking: 0,
    furnished: false,
    serviced: false,
    status: backendStatusToFE(bp.status, bp.is_verified),
    badges: computeBadges(bp, daysOld),
    image,
  };
}

export async function fetchDistricts(): Promise<FEDistrict[]> {
  const data = await safeFetch<BackendDistrict[]>(API_PATHS.districts);
  if (!data || !Array.isArray(data) || data.length === 0) {
    return staticDistricts;
  }
  return data.map(mergeDistrictWithStatic);
}

export async function fetchDistrict(slug: string): Promise<FEDistrict | undefined> {
  const byQuery = await safeFetch<BackendDistrict[]>(`${API_PATHS.districts}?slug=${encodeURIComponent(slug)}`);
  if (byQuery && Array.isArray(byQuery) && byQuery.length > 0) {
    return mergeDistrictWithStatic(byQuery[0]);
  }
  const byDetail = await safeFetch<BackendDistrict>(API_PATHS.district(slug));
  if (byDetail) return mergeDistrictWithStatic(byDetail);
  return getStaticDistrict(slug);
}

export async function fetchCategories(): Promise<PropertyCategory[]> {
  const data = await safeFetch<BackendCategory[]>(API_PATHS.categories);
  if (!data || !Array.isArray(data) || data.length === 0) {
    return staticCategories;
  }
  return data.map((bc) => feCategoryFromBackend(bc, bc.slug));
}

export type PropertyQuery = {
  categorySlug?: string;
  districtSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  apartmentType?: string;
  status?: string;
  isVerified?: boolean;
  search?: string;
  ordering?: string;
  pageSize?: number;
};

export async function fetchProperties(query: PropertyQuery = {}): Promise<FEProperty[]> {
  const params = new URLSearchParams();
  if (query.categorySlug) params.set("category_slug", query.categorySlug);
  if (query.districtSlug) params.set("district_slug", query.districtSlug);
  if (query.minPrice != null) params.set("min_price", String(query.minPrice));
  if (query.maxPrice != null) params.set("max_price", String(query.maxPrice));
  if (query.bedrooms != null) params.set("bedrooms", String(query.bedrooms));
  if (query.bathrooms != null) params.set("bathrooms", String(query.bathrooms));
  if (query.apartmentType) params.set("apartment_type", query.apartmentType);
  if (query.status) params.set("status", query.status);
  if (query.isVerified != null) params.set("is_verified", query.isVerified ? "true" : "false");
  if (query.search) params.set("search", query.search);
  if (query.ordering) params.set("ordering", query.ordering);
  if (query.pageSize != null) params.set("page_size", String(query.pageSize));

  const qs = params.toString();
  const url = `${API_PATHS.properties}${qs ? `?${qs}` : ""}`;

  const [list, districts, cats] = await Promise.all([
    safeFetch<BackendProperty[] | { results: BackendProperty[] }>(url),
    fetchDistricts(),
    fetchCategories(),
  ]);

  const raw: BackendProperty[] =
    list == null ? [] : Array.isArray(list) ? list : (list as { results: BackendProperty[] }).results ?? [];

  if (raw.length === 0) {
    return [];
  }

  const districtsBySlug: Record<string, FEDistrict> = {};
  for (const d of districts) districtsBySlug[d.slug] = d;
  const categoriesBySlug: Record<string, PropertyCategory> = {};
  for (const c of cats) categoriesBySlug[c.slug] = c;

  return raw.map((bp) => adaptBackendProperty(bp, { districtsBySlug, categoriesBySlug }));
}

export async function fetchPropertyById(id: number | string): Promise<FEProperty | null> {
  const data = await safeFetch<BackendProperty>(API_PATHS.property(Number(id)));
  if (!data) return null;
  return adaptBackendProperty(data);
}

export { formatPrice, generateProperties, getPropertiesByDistrict, getPropertiesByCategory } from "./properties";
export { getDistrict, featuredDistrictSlugs } from "./districts";
export { getCategory } from "./categories";
export { getAgentsForDistrict, agents } from "./agents";
export { getNearby } from "./nearby";
export type { Agent } from "./agents";
export type { NearbyPlace } from "./nearby";

// Re-export Property type
export type { Property } from "./properties";
