import { fetchRawPropertyById, fetchPropertyById } from "@/lib/api";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  let raw = await fetchRawPropertyById(params.id);
  if (!raw) {
    raw = (await fetchPropertyById(params.id)) as any;
  }

  const anyRaw = raw as any;
  const propertyData = anyRaw ? {
    id: String(anyRaw.id),
    title: anyRaw.title,
    district: anyRaw.district_details?.name || anyRaw.district?.name || (typeof anyRaw.district === "string" ? anyRaw.district : "Abuja"),
    price: typeof anyRaw.annual_rent === "number" ? anyRaw.annual_rent : Number(anyRaw.annual_rent) || (anyRaw.price ?? 0),
  } : undefined;

  return (
    <CheckoutClient
      propertyId={params.id}
      propertyData={propertyData}
    />
  );
}
