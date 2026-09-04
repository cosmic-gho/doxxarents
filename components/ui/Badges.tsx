// @ts-nocheck
import React from "react";
import { IconStar } from "./Icons";

export function StatusPill({ status }) {
  const map = {
    Available: { bg: "bg-emerald-950", text: "text-emerald-300", border: "border-emerald-800" },
    Reserved: { bg: "bg-amber-950", text: "text-amber-300", border: "border-amber-800" },
    Rented: { bg: "bg-neutral-800", text: "text-neutral-400", border: "border-neutral-700" },
    "Pending Verification": { bg: "bg-amber-950", text: "text-amber-300", border: "border-amber-800" },
    "Coming Soon": { bg: "bg-indigo-950", text: "text-indigo-300", border: "border-indigo-800" },
    "New Listing": { bg: "bg-sky-950", text: "text-sky-300", border: "border-sky-800" },
    "Featured Listing": { bg: "bg-amber-900", text: "text-amber-200", border: "border-amber-600" },
  };
  const s = map[status] || map["Available"];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium tracking-wide border ${s.bg} ${s.text} ${s.border}`}>
      {status}
    </span>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-neutral-800 text-neutral-300 border-neutral-700",
    verified: "bg-emerald-950 text-emerald-300 border-emerald-800",
    premium: "bg-amber-900 text-amber-200 border-amber-600",
    locked: "bg-neutral-800 text-neutral-400 border-neutral-700",
    unlocked: "bg-emerald-950 text-emerald-300 border-emerald-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function PremiumBadge({ type }) {
  const map = {
    locked: { label: "Premium Locked", icon: "\u{1F512}", tone: "locked" },
    unlocked: { label: "Premium Unlocked", icon: "\u2705", tone: "unlocked" },
    doxxaVerified: { label: "Doxxa Verified", icon: "\u2666", tone: "verified" },
    verifiedAgent: { label: "Verified Agent", icon: "\u2666", tone: "verified" },
    verifiedProperty: { label: "Verified Property", icon: "\u2666", tone: "verified" },
    doxxaVerifiedVisit: { label: "Doxxa Verified Visit", icon: "\u2666", tone: "verified" },
  };
  const b = map[type] || map.locked;
  return (
    <Badge tone={b.tone}>
      <span>{b.icon}</span> {b.label}
    </Badge>
  );
}

export function Diamond({ className }) {
  return <span className={`text-amber-500 ${className || ""}`}>&#9670;</span>;
}

