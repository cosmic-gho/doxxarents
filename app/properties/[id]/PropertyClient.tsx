"use client";

import { PropertyDetail } from "@/components/views/Views";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function PropertyClient({ 
  propertyId, 
  propertyData, 
  similarProperties 
}: { 
  propertyId: string, 
  propertyData?: any, 
  similarProperties?: any[] 
}) {
  const router = useRouter();
  const { saved, toggleSave, compareIds, toggleCompare, isUnlocked, markPaid } = useApp();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <PropertyDetail 
        propertyId={propertyId}
        propertyData={propertyData}
        similarProperties={similarProperties}
        onBack={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/search");
          }
        }}
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
        onOpenAgent={(id: string) => router.push(`/agents/${id}`)}
        saved={saved}
        toggleSave={toggleSave}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
        isPremiumUnlocked={isUnlocked(propertyId)}
        onUnlockPremium={() => router.push(`/checkout/${propertyId}`)}
      />
    </div>
  );
}
