"use client";

import { Home } from "@/components/views/Views";
import { useRouter } from "next/navigation";

export default function HomeClient({ 
  featuredProperties,
  statesData,
}: { 
  featuredProperties: any;
  statesData?: any[];
}) {
  const router = useRouter();

  return (
    <div className="bg-neutral-950" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Home 
        setView={(v: any) => {
          if (v?.name === "signup") {
            router.push(`/register?role=${v.role || "renter"}`);
          }
        }}
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
        onOpenSearch={() => router.push(`/search`)}
        onOpenDistrict={(key: string) => router.push(`/districts/${key}`)}
        onOpenState={(stateSlug: string) => router.push(`/states/${stateSlug}`)}
        featuredProperties={featuredProperties}
        statesData={statesData}
      />
    </div>
  );
}
