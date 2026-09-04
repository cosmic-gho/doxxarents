"use client";

import { SignupView } from "@/components/views/Views";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SignupView 
        initialRole="renter"
        onBack={() => router.push("/")}
      />
    </div>
  );
}
