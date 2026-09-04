import { fetchProperties, fetchStates } from "@/lib/api";
import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DOXXARentals — Find Your Next Home in Abuja Without the Stress",
  description:
    "Browse verified rental listings across every district in Abuja, Nigeria. Apartment types, verified agents, and easy inspection booking — all in one place.",
  keywords: ["Abuja rentals", "Nigeria apartments", "rent in Abuja", "verified listings", "DOXXARentals"],
  openGraph: {
    title: "DOXXARentals — Abuja's Most Trusted Rental Platform",
    description: "Verified listings, verified agents, and every district in Abuja on one trustworthy platform.",
    url: "https://doxxarentals.com",
    siteName: "DOXXARentals",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DOXXARentals — Find Your Next Home in Abuja",
    description: "Verified listings and agents across every district in Abuja, Nigeria.",
  },
};

export const dynamic = "force-dynamic";

export default async function DoxxaRentals() {
  const [rawProperties, states] = await Promise.all([
    fetchProperties({ pageSize: 6 }),
    fetchStates(),
  ]);
  
  // Map real API data to the shape expected by the frontend design components
  const featuredProperties = rawProperties.map(p => ({
    id: p.id,
    title: p.title,
    districtKey: p.district.slug.replace("-", "_"),
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
    verified: p.badges.includes("doxxa-verified") || p.badges.includes("verified-property"),
    premium: p.badges.includes("featured"),
    isNew: p.badges.includes("new"),
    status: p.status === "available" ? (p.badges.includes("featured") ? "Featured Listing" : "Available") : "Reserved",
    popularity: 100,
    daysAgo: 1,
    agentId: "peter",
    // We add the actual image as a fallback in case DistrictHeroImage is updated to accept it
    image: p.image
  }));

  return <HomeClient featuredProperties={featuredProperties.length > 0 ? featuredProperties : null} statesData={states} />;
}
