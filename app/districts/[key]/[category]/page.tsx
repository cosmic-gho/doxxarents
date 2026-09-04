"use client";

import { DistrictCategoryListings } from "@/components/views/Views";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function DistrictCategoryRoutePage({ params }: { params: { key: string, category: string } }) {
  const router = useRouter();
  const { saved, toggleSave, compareIds, toggleCompare } = useApp();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <DistrictCategoryListings 
        districtKey={params.key}
        categoryKey={params.category}
        onBack={() => router.push(`/districts/${params.key}`)}
        onBackHome={() => router.push("/")}
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
        saved={saved}
        toggleSave={toggleSave}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
      />
    </div>
  );
}
