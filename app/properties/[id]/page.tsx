import { fetchRawPropertyById, fetchPropertyById, fetchProperties } from "@/lib/api";
import PropertyClient from "./PropertyClient";

export const dynamic = "force-dynamic";

function mapRawToPropertyData(raw: any) {
  if (!raw) return null;

  const price = typeof raw.annual_rent === "number" 
    ? raw.annual_rent 
    : (Number(raw.annual_rent) || (raw.price ?? 0));
    
  const serviceCharge = raw.service_charge != null 
    ? (typeof raw.service_charge === "number" ? raw.service_charge : Number(raw.service_charge)) 
    : null;

  const districtName = raw.district_details?.name || raw.district?.name || (typeof raw.district === "string" ? raw.district : "Abuja");
  const districtSlug = raw.district_details?.slug || raw.district?.slug || "wuse";
  const categoryName = raw.category_details?.name || raw.category?.name || "Apartment";
  const categorySlug = raw.category_details?.slug || raw.category?.slug || "apartment";

  const agent = raw.agent ? {
    id: String(raw.agent.id),
    name: (raw.agent.first_name && raw.agent.last_name)
      ? `${raw.agent.first_name} ${raw.agent.last_name}`
      : (raw.agent.username || "Verified Agent"),
    agency: "DOXXA Verified Partner",
    phone: raw.agent.phone_number || "+234 800 000 0000",
    whatsapp: raw.agent.phone_number || "",
    email: raw.agent.email || "",
    verified: raw.agent.is_verified ?? true,
    photoUrl: raw.agent.profile_picture || null,
    rating: 4.9,
    reviewCount: 18,
    responseTime: "Typically replies within 1 hour",
    years: 5,
    address: raw.address || districtName,
  } : undefined;

  return {
    id: String(raw.id),
    title: raw.title || `${categoryName} in ${districtName}`,
    description: raw.description || "",
    districtKey: districtSlug.replace(/-/g, "_"),
    district: districtName,
    type: categoryName,
    categoryKey: categorySlug,
    price,
    serviceCharge,
    bedrooms: raw.bedrooms ?? 0,
    bathrooms: raw.bathrooms ?? 0,
    parking: raw.parking ?? 0,
    furnished: Boolean(raw.furnished),
    serviced: Boolean(raw.serviced),
    petFriendly: Boolean(raw.pet_friendly ?? raw.petFriendly),
    verified: Boolean(raw.is_verified || raw.verified),
    premium: Boolean(raw.is_premium || raw.is_featured || raw.premium),
    isNew: true,
    status: (raw.status === "AVAILABLE" || raw.status === "available") 
      ? "Available" 
      : (raw.status === "RESERVED" || raw.status === "reserved") 
        ? "Reserved" 
        : (raw.status === "RENTED" || raw.status === "rented") 
          ? "Rented" 
          : (raw.status || "Available"),
    popularity: raw.views_count ?? 100,
    daysAgo: 1,
    address: raw.address || "",
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    datePosted: raw.date_posted,
    viewsCount: raw.views_count,
    amenities_details: raw.amenities_details || [],
    images: raw.images || (raw.image ? [{ id: 1, image: raw.image, is_primary: true }] : []),
    agent,
    agentId: agent ? agent.id : "peter",
    has_virtual_tour: Boolean(raw.has_virtual_tour),
    has_unlocked_virtual_tour: Boolean(raw.has_unlocked_virtual_tour),
    tour_url: raw.tour_url || null,
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  let raw = await fetchRawPropertyById(params.id);
  if (!raw) {
    // Fallback to adapted FEProperty if raw lookup was empty
    raw = (await fetchPropertyById(params.id)) as any;
  }
  
  let propertyData = undefined;
  let similarProperties = undefined;

  if (raw) {
    propertyData = mapRawToPropertyData(raw);
    
    // Fetch similar properties from same district
    const districtSlug = raw.district_details?.slug || (typeof (raw as any).district === "object" ? (raw as any).district?.slug : undefined);
    const similarRaw = await fetchProperties({ 
      districtSlug,
      pageSize: 4 
    });
    
    const mapped = similarRaw
      .filter(p => String(p.id) !== String(params.id))
      .slice(0, 3)
      .map(p => ({
        id: String(p.id),
        title: p.title,
        districtKey: p.district?.slug?.replace(/-/g, "_") || "wuse",
        district: p.district?.name || "Abuja",
        type: p.category?.name || "Apartment",
        categoryKey: p.category?.slug || "apartment",
        price: p.price,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        parking: p.parking,
        furnished: p.furnished,
        serviced: p.serviced,
        petFriendly: false,
        verified: p.badges?.includes("doxxa-verified") || p.badges?.includes("verified-property"),
        premium: Boolean(p.badges?.includes("featured")),
        isNew: Boolean(p.badges?.includes("new")),
        status: p.status === "available" ? "Available" : "Reserved",
        popularity: 100,
        daysAgo: 1,
        agentId: "peter",
        image: p.image
      }));
      
    if (mapped.length > 0) {
      similarProperties = mapped;
    }
  }

  return (
    <PropertyClient 
      propertyId={params.id}
      propertyData={propertyData}
      similarProperties={similarProperties}
    />
  );
}
