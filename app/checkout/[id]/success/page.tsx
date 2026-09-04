import { fetchRawPropertyById, fetchPropertyById } from "@/lib/api";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default async function PremiumSuccessPage({ params }: { params: { id: string } }) {
  let raw = await fetchRawPropertyById(params.id);
  if (!raw) {
    raw = (await fetchPropertyById(params.id)) as any;
  }

  const propertyData = raw ? {
    id: String(raw.id),
    title: raw.title,
  } : undefined;

  return (
    <SuccessClient
      propertyId={params.id}
      propertyData={propertyData}
    />
  );
}
