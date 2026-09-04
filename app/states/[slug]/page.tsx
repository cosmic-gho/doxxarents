import { fetchStates, fetchRawDistricts, fetchProperties } from "@/lib/api";
import { DISTRICT_LIST, STATES_LIST } from "@/lib/mock-data";
import StateClient from "./StateClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const states = await fetchStates();
  const state = states.find((s) => s.slug === slug) || STATES_LIST.find((s) => s.slug === slug);
  const stateName = state?.name || slug.toUpperCase();

  return {
    title: `${stateName} Rentals & Districts — DOXXARentals`,
    description: `Explore verified rental listings, districts, and apartments in ${stateName} on DOXXARentals.`,
  };
}

export default async function StatePage({ params }: PageProps) {
  const slug = params.slug.toLowerCase();

  const [states, rawDistricts, rawProperties] = await Promise.all([
    fetchStates(),
    fetchRawDistricts(slug),
    fetchProperties({ pageSize: 6 }),
  ]);

  // Find state info
  const stateData =
    states.find((s) => s.slug === slug) ||
    STATES_LIST.find((s) => s.slug === slug) || {
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      status: slug === "abuja" ? "LIVE" : "COMING_SOON",
      blurb: `Rental listings in ${slug}.`,
    };

  // Ensure districts are populated from the DB
  let districts = rawDistricts;
  if (!districts || districts.length === 0) {
    if (slug === "abuja") {
      // Fallback only if backend is unreachable
      districts = DISTRICT_LIST.map((d) => ({
        name: d.name,
        slug: d.key.replace(/_/g, "-"),
        blurb: d.blurb,
        properties_count: 0,
      }));
    }
  }

  // Format properties for PropertyCard
  const featuredProperties = rawProperties.map((p) => ({
    id: p.id,
    title: p.title,
    districtKey: p.district.slug.replace(/-/g, "_"),
    district: p.district.name,
    type: p.category.name,
    categoryKey: p.category.slug,
    price: p.price,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    furnished: p.furnished,
    serviced: p.serviced,
    petFriendly: false,
    verified:
      p.badges.includes("doxxa-verified") || p.badges.includes("verified-property"),
    premium: p.badges.includes("featured"),
    isNew: p.badges.includes("new"),
    status:
      p.status === "available"
        ? p.badges.includes("featured")
          ? "Featured Listing"
          : "Available"
        : "Reserved",
    popularity: 100,
    daysAgo: 1,
    agentId: "peter",
    image: p.image,
    description: `A ${p.bedrooms}-bedroom ${p.category.name.toLowerCase()} in ${p.district.name}, ${p.furnished ? "furnished, " : ""}${p.serviced ? "serviced, " : ""}with ${p.parking} parking.`
  }));

  return (
    <StateClient
      stateData={stateData}
      districts={districts}
      featuredProperties={featuredProperties}
    />
  );
}
