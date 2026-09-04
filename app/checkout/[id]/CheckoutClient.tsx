"use client";

import { CheckoutView } from "@/components/views/Views";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function CheckoutClient({ 
  propertyId, 
  propertyData 
}: { 
  propertyId: string; 
  propertyData?: any; 
}) {
  const router = useRouter();
  const { markPaid } = useApp();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <CheckoutView 
        propertyId={propertyId}
        propertyData={propertyData}
        onBack={() => router.push(`/properties/${propertyId}`)}
        onPaid={(id: string) => {
          markPaid(id);
          router.push(`/checkout/${id}/success`);
        }}
      />
    </div>
  );
}
