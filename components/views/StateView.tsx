// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PropertyCard, DistrictHeroImage, FadeUp, EmptyState } from "@/components/SharedUI";
import { formatNaira } from "@/lib/mock-data";

export interface StateViewProps {
  stateData: {
    slug: string;
    name: string;
    region?: string;
    tagline?: string;
    blurb?: string;
    status: "LIVE" | "COMING_SOON";
    launch_note?: string;
    districts_count?: number;
  };
  districts: Array<{
    id?: number;
    name: string;
    slug: string;
    blurb?: string;
    properties_count?: number;
    image?: string;
  }>;
  featuredProperties: any[];
  onOpenProperty: (id: string | number) => void;
  onOpenDistrict: (slug: string) => void;
}

export function StateView({
  stateData,
  districts = [],
  featuredProperties = [],
  onOpenProperty,
  onOpenDistrict,
}: StateViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return districts;
    const q = searchQuery.toLowerCase();
    return districts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.blurb && d.blurb.toLowerCase().includes(q))
    );
  }, [districts, searchQuery]);

  const isLive = stateData.status === "LIVE" || stateData.slug === "abuja";

  if (!isLive) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5 py-20">
        <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-2xl">
          <span className="text-4xl mb-4 inline-block">🚀</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800 mb-4">
            Coming Soon
          </span>
          <h1
            className="text-neutral-50 text-3xl font-semibold mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {stateData.name}
          </h1>
          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            {stateData.blurb ||
              `We are currently cataloguing verified listings, vetting local agents, and mapping districts across ${stateData.name}.`}
          </p>

          {notified ? (
            <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg p-3 mb-6">
              ✓ You&apos;re on the list! We will notify you when {stateData.name} launches.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (notifyEmail) setNotified(true);
              }}
              className="flex gap-2 mb-6"
            >
              <input
                type="email"
                placeholder="Enter your email for launch alerts"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                required
                className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-2.5 flex-1 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium text-xs px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors"
              >
                Notify Me
              </button>
            </form>
          )}

          <Link
            href="/states/abuja"
            className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300"
          >
            &larr; Explore Abuja rentals (Live now)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="relative border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/60 via-neutral-950 to-neutral-950 pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-5">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
            <Link href="/" className="hover:text-neutral-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-400">States</span>
            <span>/</span>
            <span className="text-amber-400 font-medium">{stateData.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE IN {stateData.name.toUpperCase()}
                </span>
                {stateData.tagline && (
                  <span className="text-xs text-neutral-400 tracking-wider uppercase">
                    {stateData.tagline}
                  </span>
                )}
              </div>
              <h1
                className="text-neutral-50 text-3xl md:text-5xl font-normal tracking-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Rentals in {stateData.name}
              </h1>
              <p className="text-neutral-300 text-sm md:text-base max-w-2xl leading-relaxed">
                {stateData.blurb ||
                  "Verified listings, transparent pricing breakdown, and direct agent access across every major district."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 text-center">
                <p
                  className="text-amber-400 text-xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {districts.length || stateData.districts_count || 19}
                </p>
                <p className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Districts in DB
                </p>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 text-center">
                <p
                  className="text-emerald-400 text-xl font-bold"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  100%
                </p>
                <p className="text-neutral-400 text-[11px] uppercase tracking-wider">
                  Verified Data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Featured Listings */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-1">
              Highlighted Properties
            </p>
            <h2
              className="text-neutral-50 text-2xl md:text-3xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Featured Listings in {stateData.name}
            </h2>
          </div>
          <span className="text-neutral-500 text-xs hidden sm:inline">
            Direct lease agreements &middot; Inspected properties
          </span>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onOpen={onOpenProperty}
                saved={savedIds.includes(String(p.id))}
                onToggleSave={() => toggleSave(String(p.id))}
                compared={compareIds.includes(String(p.id))}
                onToggleCompare={() => toggleCompare(String(p.id))}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Featured listings updating"
            body="New verified listings are being onboarded. Explore by district below to view all available apartments."
          />
        )}
      </div>

      {/* SECTION 2: Explore by District (from DB) */}
      <div className="max-w-6xl mx-auto px-5 pt-12 border-t border-neutral-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-1">
              Neighborhood Breakdown
            </p>
            <h2
              className="text-neutral-50 text-2xl md:text-3xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Explore by District
            </h2>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              Choose a district to browse apartment categories: 1 bedroom, 2
              bedroom, 3 bedroom, duplex, and more.
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search districts (e.g. Asokoro, Kubwa)..."
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none placeholder:text-neutral-600"
            />
          </div>
        </div>

        {filteredDistricts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDistricts.map((d, idx) => {
              const districtKey = (d.slug || d.name)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/_/g, "-");

              return (
                <div
                  key={d.slug || d.id || idx}
                  onClick={() => onOpenDistrict(districtKey)}
                  className="group relative bg-neutral-900 border border-neutral-800 hover:border-amber-400/70 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/5 flex flex-col justify-between"
                >
                  <div className="relative h-32 overflow-hidden bg-neutral-950">
                    <DistrictHeroImage
                      districtKey={districtKey}
                      image={d.image}
                      name={d.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                      {d.properties_count != null
                        ? `${d.properties_count} properties`
                        : "Browse units"}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3
                        className="text-neutral-100 font-medium text-base group-hover:text-amber-400 transition-colors mb-1"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {d.name}
                      </h3>
                      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                        {d.blurb ||
                          `Explore verified rentals and apartments in ${d.name}, Abuja.`}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                      <span className="text-[11px] text-neutral-500">
                        View categories
                      </span>
                      <span className="text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform font-medium">
                        &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No district matches"
            body={`No districts matching "${searchQuery}". Try searching for another district like Maitama, Wuse, Jabi, or Kubwa.`}
          />
        )}
      </div>
    </div>
  );
}
