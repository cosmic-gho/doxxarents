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
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  is_short_let: boolean;
  listing_count: number;
};

export type BackendPropertyImage = { id: number; image: string | null; is_primary: boolean };

export type BackendAgent = {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  profile_picture: string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_verified?: boolean;
  active_listings_count?: number;
};

export type BackendProperty = {
  id: number;
  title: string;
  description: string;
  agent: BackendAgent | null;
  annual_rent: string | number;
  service_charge: string | number | null;
  category: number | null;
  category_details: { id: number; slug: string; name: string; icon: string; is_short_let: boolean } | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: boolean;
  serviced: boolean;
  pet_friendly: boolean;
  district: number | null;
  district_details: BackendDistrict | null;
  address: string;
  latitude: string | number | null;
  longitude: string | number | null;
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  /** Availability: AVAILABLE | RESERVED | RENTED | COMING_SOON */
  status: "AVAILABLE" | "RESERVED" | "RENTED" | "COMING_SOON";
  /** Moderation: PENDING | APPROVED | REJECTED */
  moderation_status: "PENDING" | "APPROVED" | "REJECTED";
  amenities: number[];
  amenities_details: { id: number; name: string }[];
  date_posted: string;
  views_count?: number;
  images: BackendPropertyImage[];
  tour_url?: string;
  has_virtual_tour?: boolean;
  has_unlocked_virtual_tour?: boolean;
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
  agents: "/api/auth/agents/",
  agent: (id: number) => `/api/auth/agent/${id}/`,
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


function backendStatusToFE(
  status: BackendProperty["status"],
  moderationStatus: BackendProperty["moderation_status"]
): PropertyStatus {
  if (status === "RENTED") return "rented";
  if (moderationStatus === "REJECTED") return "under-review";
  if (moderationStatus === "PENDING") return "pending-verification";
  // APPROVED + available
  if (status === "RESERVED") return "reserved" as PropertyStatus;
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
  // Use the category slug returned directly from the backend
  const categorySlug = bp.category_details?.slug ?? "2-bedroom";
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

  const price = typeof bp.annual_rent === "number" ? bp.annual_rent : Number(bp.annual_rent) || 0;

  return {
    id: String(bp.id),
    title: bp.title,
    district,
    category,
    price,
    bedrooms: bp.bedrooms ?? 0,
    bathrooms: bp.bathrooms ?? 0,
    parking: bp.parking ?? 0,
    furnished: bp.furnished ?? false,
    serviced: bp.serviced ?? false,
    status: backendStatusToFE(bp.status, bp.moderation_status),
    badges: computeBadges(bp, daysOld),
    image,
    address: bp.address ?? "",
    latitude: bp.latitude ?? null,
    longitude: bp.longitude ?? null,
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
  status?: string;
  moderationStatus?: string;
  isVerified?: boolean;
  search?: string;
  ordering?: string;
  pageSize?: number;
  agentId?: number;
};

export async function fetchProperties(query: PropertyQuery = {}): Promise<FEProperty[]> {
  const params = new URLSearchParams();
  if (query.categorySlug) params.set("category_slug", query.categorySlug);
  if (query.districtSlug) params.set("district_slug", query.districtSlug);
  if (query.minPrice != null) params.set("min_price", String(query.minPrice));
  if (query.maxPrice != null) params.set("max_price", String(query.maxPrice));
  if (query.bedrooms != null) params.set("bedrooms", String(query.bedrooms));
  if (query.bathrooms != null) params.set("bathrooms", String(query.bathrooms));
  if (query.status) params.set("status", query.status);
  if (query.moderationStatus) params.set("moderation_status", query.moderationStatus);
  if (query.isVerified != null) params.set("is_verified", query.isVerified ? "true" : "false");
  if (query.search) params.set("search", query.search);
  if (query.ordering) params.set("ordering", query.ordering);
  if (query.pageSize != null) params.set("page_size", String(query.pageSize));
  if (query.agentId != null) params.set("agent_id", String(query.agentId));

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

export async function fetchAgents(): Promise<BackendAgent[]> {
  const data = await safeFetch<BackendAgent[]>(API_PATHS.agents);
  return data ?? [];
}

export async function fetchAgentProfile(id: number | string): Promise<BackendAgent | null> {
  return await safeFetch<BackendAgent>(API_PATHS.agent(Number(id)));
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
