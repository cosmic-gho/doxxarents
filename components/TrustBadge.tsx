import { ShieldCheck, BadgeCheck, Star, Sparkles } from "lucide-react";
import clsx from "clsx";

export type TrustBadgeType =
  | "verified-property"
  | "verified-agent"
  | "doxxa-verified"
  | "featured"
  | "new";

const CONFIG: Record<TrustBadgeType, { label: string; icon: typeof ShieldCheck; classes: string }> = {
  "verified-property": { label: "Verified Property", icon: ShieldCheck, classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "verified-agent": { label: "Verified Agent", icon: BadgeCheck, classes: "bg-blue-50 text-blue-700 border-blue-200" },
  "doxxa-verified": { label: "Doxxa Verified", icon: BadgeCheck, classes: "bg-gold/10 text-gold-dark border-gold/30" },
  featured: { label: "Featured", icon: Star, classes: "bg-ink text-paper border-ink" },
  new: { label: "New Listing", icon: Sparkles, classes: "bg-stone-100 text-stone-700 border-stone-200" },
};

export default function TrustBadge({ type }: { type: TrustBadgeType }) {
  const { label, icon: Icon, classes } = CONFIG[type];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        classes
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export type PropertyStatus = "available" | "reserved" | "rented" | "pending-verification" | "under-review";

const STATUS_CONFIG: Record<PropertyStatus, { label: string; classes: string }> = {
  available: { label: "Available", classes: "bg-emerald-500 text-white" },
  reserved: { label: "Reserved", classes: "bg-amber-500 text-white" },
  rented: { label: "Rented", classes: "bg-stone-500 text-white" },
  "pending-verification": { label: "Pending Verification", classes: "bg-stone-300 text-stone-800" },
  "under-review": { label: "Under Review", classes: "bg-stone-300 text-stone-800" },
};

export function StatusPill({ status }: { status: PropertyStatus }) {
  const { label, classes } = STATUS_CONFIG[status];
  return (
    <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", classes)}>
      {label}
    </span>
  );
}
