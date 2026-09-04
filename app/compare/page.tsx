"use client";

import { CompareView } from "@/components/views/Views";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function ComparePage() {
  const router = useRouter();
  const { compareIds, toggleCompare } = useApp();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <CompareView 
        ids={compareIds}
        toggleCompare={toggleCompare}
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
      />
    </div>
  );
}
