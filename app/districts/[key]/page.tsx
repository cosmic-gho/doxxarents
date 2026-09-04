"use client";

import { DistrictPage } from "@/components/views/Views";
import { useRouter } from "next/navigation";

export default function DistrictRoutePage({ params }: { params: { key: string } }) {
  const router = useRouter();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <DistrictPage 
        districtKey={params.key}
        onBack={() => router.push("/states/abuja")}
        onOpenCategory={(districtKey: string, categoryKey: string) => router.push(`/districts/${districtKey}/${categoryKey}`)}
      />
    </div>
  );
}
