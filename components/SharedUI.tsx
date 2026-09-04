// @ts-nocheck
import React, { useState, useEffect } from "react";
import { formatNaira, initials, getDistrictImage, getAgentPhoto } from "@/lib/mock-data";
import { IconHeart, IconCompare, IconShare } from "./ui/Icons";
import { StatusPill, PremiumBadge, Diamond, Badge } from "./ui/Badges";
import Link from "next/link";

export function AgentAvatar({ agent, size = 56 }) {
  const photo = agent?.photoUrl || agent?.profile_picture;
  if (photo) {
    return (
      <img
        src={photo}
        alt={agent?.name || "Agent"}
        className="rounded-full object-cover border border-neutral-700 shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  const name = agent?.name || "Agent";
  return (
    <div
      className="rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 font-medium shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

export function DistrictHeroImage({ districtKey, image, name, className }) {
  const src = image || getDistrictImage(districtKey);
  if (src) {
    return <img src={src} alt={name} className={className} />;
  }
  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ background: "linear-gradient(135deg, hsl(38 30% 16%), hsl(220 20% 10%))" }}
    >
      <span className="text-neutral-500 text-xs tracking-widest uppercase px-2 text-center">{name}<br />photo coming soon</span>
    </div>
  );
}

export function Logo({ size = 28, showWordmark = true }) {
  const src = "/images/logo.jpg";
  if (src) {
    return <img src={src} alt="DoxxaRentals" style={{ height: size }} className="object-contain" />;
  }
  return (
    <span className="flex items-center gap-2">
      <Diamond className="text-lg" />
      {showWordmark && (
        <span className="text-neutral-50 text-lg tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
          DoxxaRentals
        </span>
      )}
    </span>
  );
}

export function Rule() {
  return (
    <div className="flex items-center gap-3 justify-center my-3">
      <span className="h-px w-10 bg-neutral-700" />
      <Diamond className="text-[8px]" />
      <span className="h-px w-10 bg-neutral-700" />
    </div>
  );
}

export function FadeUp({ children, delay = 0, className }) {
  return (
    <div className={`doxxa-fade-up ${className || ""}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function PropertyCard({ property, onOpen, saved, onToggleSave, compared, onToggleCompare }) {
  return (
    <div className="doxxa-card-premium bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
      <div className="relative overflow-hidden">
        <DistrictHeroImage districtKey={property.districtKey} image={property.image} name={property.district} className="w-full h-40 object-cover transition-transform duration-500 hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap max-w-[85%]">
          {property.verified && <Badge tone="verified">Verified</Badge>}
          {property.premium && <Badge tone="premium">Premium</Badge>}
        </div>
        <div className="absolute top-2 right-2">
          <StatusPill status={property.status} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-amber-400 font-semibold text-lg leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            {formatNaira(property.price)}
            <span className="text-neutral-500 text-xs font-normal"> /year</span>
          </p>
        </div>
        <p className="text-neutral-200 text-sm font-medium">{property.type} &middot; {property.district}</p>
        <div className="flex items-center gap-3 text-neutral-400 text-xs">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.parking} parking</span>
        </div>
        <p className="text-neutral-500 text-xs line-clamp-2">{property.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-3 text-neutral-400">
            <button aria-label="Save property" onClick={() => onToggleSave(property.id)} className={saved ? "text-rose-400" : "text-neutral-500 hover:text-neutral-300"}>
              <IconHeart filled={saved} />
            </button>
            <button aria-label="Compare property" onClick={() => onToggleCompare(property.id)} className={compared ? "text-amber-400" : "text-neutral-500 hover:text-neutral-300"}>
              <IconCompare />
            </button>
            <button aria-label="Share property" className="text-neutral-500 hover:text-neutral-300">
              <IconShare />
            </button>
          </div>
          <button onClick={() => onOpen(property.id)} className="text-xs font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded px-3 py-1.5">
            View details
          </button>
        </div>
      </div>
    </div>
  );
}

export function useParallax(speed = 0.15) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * speed);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return offset;
}

export function EmptyState({ title, body }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 border border-dashed border-neutral-800 rounded-xl">
      <Diamond className="text-2xl mb-3" />
      <p className="text-neutral-200 font-medium mb-1" style={{ fontFamily: "Georgia, serif" }}>{title}</p>
      <p className="text-neutral-500 text-sm max-w-sm">{body}</p>
    </div>
  );
}

