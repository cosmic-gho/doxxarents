"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StateView } from "@/components/views/StateView";

interface StateClientProps {
  stateData: any;
  districts: any[];
  featuredProperties: any[];
}

export default function StateClient({
  stateData,
  districts,
  featuredProperties,
}: StateClientProps) {
  const router = useRouter();

  return (
    <div
      className="bg-neutral-950 min-h-screen text-neutral-100"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <StateView
        stateData={stateData}
        districts={districts}
        featuredProperties={featuredProperties}
        onOpenProperty={(id) => router.push(`/properties/${id}`)}
        onOpenDistrict={(districtKey) => router.push(`/districts/${districtKey}`)}
      />
    </div>
  );
}
