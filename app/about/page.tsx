"use client";

import { AboutPage as AboutView } from "@/components/views/Views";

export default function AboutPage() {
  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AboutView />
    </div>
  );
}
