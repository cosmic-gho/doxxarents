"use client";

import { PremiumSuccessView } from "@/components/views/Views";
import { useRouter } from "next/navigation";

export default function SuccessClient({ 
  propertyId, 
  propertyData 
}: { 
  propertyId: string; 
  propertyData?: any; 
}) {
  const router = useRouter();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <PremiumSuccessView 
        propertyId={propertyId}
        propertyData={propertyData}
        onViewProperty={(id: string) => router.push(`/properties/${id}`)}
      />
    </div>
  );
}
