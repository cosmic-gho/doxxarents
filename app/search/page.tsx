"use client";

import { Search } from "@/components/views/Views";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";

export default function SearchPage() {
  const router = useRouter();
  const { saved, toggleSave, compareIds, toggleCompare, searchQuery } = useApp();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Search 
        initialQuery={searchQuery}
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
        saved={saved}
        toggleSave={toggleSave}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
      />
    </div>
  );
}
