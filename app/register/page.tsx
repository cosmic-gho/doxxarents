"use client";

import { Suspense } from "react";
import { SignupView } from "@/components/views/Views";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="bg-neutral-950 min-h-screen" />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const initialRole = roleParam === "agent" ? "agent" : "renter";

  return (
    <div className="bg-neutral-950 min-h-screen" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <SignupView 
        initialRole={initialRole}
        onBack={() => router.push("/")}
        onSuccess={(createdRole: string) => {
          if (createdRole === "agent") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }}
      />
    </div>
  );
}
