"use client";

import { Home } from "@/components/views/Views";
import { useRouter } from "next/navigation";

export default function HomeClient({ featuredProperties }: { featuredProperties: any }) {
  const router = useRouter();

  return (
    <div className="bg-neutral-950" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Home 
        setView={() => {}} // ignored
        onOpenProperty={(id: string) => router.push(`/properties/${id}`)}
        onOpenSearch={() => router.push(`/search`)}
        onOpenDistrict={(key: string) => router.push(`/districts/${key}`)}
        featuredProperties={featuredProperties}
      />
    </div>
  );
}
