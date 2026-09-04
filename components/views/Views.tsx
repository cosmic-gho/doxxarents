// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ALL_PROPERTIES, DISTRICT_LIST, PROPERTY_CATEGORIES, TEAM_LIST, formatNaira, getDistrictImage, getAgent, getPropertyImages, getNearbyPlaces, REVIEW_TEMPLATES, AGENT_LIST, TYPES, STATUSES, PAYMENT_PROVIDERS, PREMIUM_PRICE, PREMIUM_ACCESS_DAYS } from "@/lib/mock-data";
import { IconHeart, IconShare, IconCompare, IconStar, Stars } from "@/components/ui/Icons";
import { StatusPill, Badge, PremiumBadge, Diamond } from "@/components/ui/Badges";
import { PropertyCard, FadeUp, Rule, AgentAvatar, DistrictHeroImage, useParallax, EmptyState } from "@/components/SharedUI";
import { TeamCard, AgentMiniCard } from "@/components/AgentCards";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap").then((m) => m.PropertyMap), { ssr: false });
const VirtualTourViewer = dynamic(() => import("@/components/VirtualTourViewer").then((m) => m.VirtualTourViewer), { ssr: false });
import { makePaystackPayment } from "@/lib/paystack";
import { useAuth } from "@/lib/auth";

export function Home({ setView, onOpenProperty, onOpenSearch, onOpenDistrict, onOpenState, featuredProperties, statesData }) {
  const featured = featuredProperties || ALL_PROPERTIES.filter((p) => p.premium).slice(0, 6);
  const states = statesData && statesData.length > 0 ? statesData : STATES_LIST;
  const parallax = useParallax(0.12);
  return (
    <div>
      <div className="relative h-[460px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[130%] -top-[8%]"
          style={{ transform: `translateY(${parallax}px) scale(1.08)`, transition: "transform 0.1s linear" }}
        >
          <DistrictHeroImage districtKey="asokoro" name="Asokoro, Abuja" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto w-full px-5 pb-10">
          <FadeUp delay={0}>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3">Abuja, Nigeria</p>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-neutral-50 text-4xl md:text-5xl leading-tight max-w-xl mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Rent with confidence, anywhere in Abuja
            </h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-neutral-300 max-w-md mb-6 text-sm">
              Verified listings, transparent costs, and agents you can actually reach. No more guesswork before you sign a lease.
            </p>
          </FadeUp>
          <FadeUp delay={240}>
            <div className="doxxa-glass doxxa-float rounded-xl p-3 flex flex-col sm:flex-row gap-2 max-w-xl shadow-2xl shadow-black/40">
              <select id="home-district" className="bg-neutral-950/80 text-neutral-200 text-sm rounded-lg px-3 py-2.5 border border-neutral-800 flex-1">
                <option value="">Any district</option>
                {DISTRICT_LIST.map((d) => (
                  <option key={d.key} value={d.key}>{d.name}</option>
                ))}
              </select>
              <select id="home-type" className="bg-neutral-950/80 text-neutral-200 text-sm rounded-lg px-3 py-2.5 border border-neutral-800 flex-1">
                <option value="">Any type</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                onClick={() => onOpenSearch()}
                className="bg-amber-400 hover:bg-amber-300 text-neutral-900 text-sm font-medium rounded-lg px-5 py-2.5 whitespace-nowrap transition-transform hover:scale-[1.03]"
              >
                Search properties
              </button>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Explore by State */}
      <div className="max-w-6xl mx-auto px-5 pt-12">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-1">Expansion Roadmap</p>
            <h2 className="text-neutral-50 text-2xl md:text-3xl" style={{ fontFamily: "Georgia, serif" }}>Explore by State</h2>
          </div>
          <span className="text-neutral-500 text-xs hidden sm:inline">Currently live in Abuja (FCT)</span>
        </div>
        <p className="text-neutral-400 text-sm max-w-xl mb-6">
          Browse verified rental listings, district breakdowns, and trusted local agents by state.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {states.map((state) => {
            const isLive = state.status === "LIVE" || state.slug === "abuja";
            return (
              <div
                key={state.slug}
                onClick={() => {
                  if (isLive && onOpenState) {
                    onOpenState(state.slug);
                  }
                }}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                  isLive
                    ? "bg-neutral-900/90 border-neutral-700 hover:border-amber-400/80 cursor-pointer group shadow-lg hover:shadow-amber-400/10 hover:-translate-y-1"
                    : "bg-neutral-950/60 border-neutral-900 opacity-60 cursor-not-allowed select-none"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">
                      {state.slug === "abuja" ? "🏛️" : state.slug === "lagos" ? "🌊" : state.slug === "port-harcourt" ? "🌿" : state.slug === "edo" ? "🏺" : "✨"}
                    </span>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900 text-neutral-400 border border-neutral-800">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-100 font-medium text-base mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    {state.shortName || state.name}
                  </p>
                  <p className="text-neutral-500 text-xs line-clamp-2 mb-3">
                    {state.blurb}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className={isLive ? "text-amber-400 font-medium" : "text-neutral-600"}>
                    {isLive ? `${state.districts_count || 19} districts` : "Launching soon"}
                  </span>
                  {isLive && (
                    <span className="text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button
            onClick={() => setView({ name: "signup", role: "renter" })}
            className="doxxa-card-premium text-left bg-neutral-900 border border-neutral-800 hover:border-amber-600/60 rounded-xl p-6"
          >
            <p className="text-2xl mb-2">&#127968;</p>
            <p className="text-neutral-50 text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Looking for a home?</p>
            <p className="text-neutral-500 text-sm mb-4">Sign up as a renter</p>
            <ul className="text-neutral-400 text-sm space-y-1.5 mb-5">
              <li>&middot; Browse apartments</li>
              <li>&middot; Save properties</li>
              <li>&middot; Book inspections</li>
              <li>&middot; Unlock premium listings</li>
            </ul>
            <span className="inline-block text-xs font-medium text-neutral-900 bg-amber-400 rounded-lg px-4 py-2">Continue</span>
          </button>
          <button
            onClick={() => setView({ name: "signup", role: "agent" })}
            className="doxxa-card-premium text-left bg-neutral-900 border border-neutral-800 hover:border-amber-600/60 rounded-xl p-6"
          >
            <p className="text-2xl mb-2">&#127970;</p>
            <p className="text-neutral-50 text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>I'm an agent or landlord</p>
            <p className="text-neutral-500 text-sm mb-4">Sign up to list properties</p>
            <ul className="text-neutral-400 text-sm space-y-1.5 mb-5">
              <li>&middot; Create listings</li>
              <li>&middot; Receive enquiries</li>
              <li>&middot; Manage properties</li>
              <li>&middot; Grow your business</li>
            </ul>
            <span className="inline-block text-xs font-medium text-neutral-900 bg-amber-400 rounded-lg px-4 py-2">Continue</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-neutral-100 text-xl" style={{ fontFamily: "Georgia, serif" }}>Explore by district</h2>
          <button onClick={onOpenSearch} className="text-amber-400 text-sm hover:underline">View all &rarr;</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {DISTRICT_LIST.map((d) => (
            <button
              key={d.key}
              onClick={() => onOpenDistrict(d.key)}
              className="doxxa-card-premium relative shrink-0 w-56 h-36 rounded-xl overflow-hidden border border-neutral-800 group"
            >
              <DistrictHeroImage districtKey={d.key} name={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/10 to-transparent" />
              <div className="absolute bottom-2 left-3 text-left">
                <p className="text-neutral-50 text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>{d.name}</p>
                <p className="text-neutral-400 text-[11px]">{d.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-neutral-100 text-xl" style={{ fontFamily: "Georgia, serif" }}>Featured properties</h2>
          <button onClick={onOpenSearch} className="text-amber-400 text-sm hover:underline">Browse all &rarr;</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <div key={p.id} onClick={() => onOpenProperty(p.id)} className="cursor-pointer">
              <PropertyCard property={p} onOpen={onOpenProperty} saved={false} onToggleSave={() => { }} compared={false} onToggleCompare={() => { }} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <Rule />
          <h2 className="text-neutral-100 text-xl text-center mb-10" style={{ fontFamily: "Georgia, serif" }}>How DoxxaRentals works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { n: "01", t: "Search verified listings", d: "Filter by district, price, and the details that matter to you." },
              { n: "02", t: "See the true cost upfront", d: "Every listing shows agency fee, legal fee, and deposit before you unlock the agent's contact." },
              { n: "03", t: "Talk directly to a rated agent", d: "Message or call agents with verified track records and real reviews." },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-amber-500 text-xs tracking-widest mb-2">{s.n}</p>
                <p className="text-neutral-100 font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>{s.t}</p>
                <p className="text-neutral-500 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}

export function FilterBar({ filters, setFilters, sort, setSort, resultCount }) {
  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));
  const chip = (key, label) => (
    <button
      onClick={() => toggle(key)}
      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filters[key]
        ? "bg-amber-400 border-amber-400 text-neutral-900 font-medium"
        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
        }`}
    >
      {label}
    </button>
  );
  return (
    <div className="bg-neutral-950 border-b border-neutral-900 sticky top-[57px] z-20">
      <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.district}
            onChange={(e) => setFilters((f) => ({ ...f, district: e.target.value }))}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="">All districts</option>
            {DISTRICT_LIST.map((d) => (
              <option key={d.key} value={d.key}>{d.name}</option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters((f) => ({ ...f, bedrooms: e.target.value }))}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="">Any beds</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+ bed</option>
            ))}
          </select>
          <select
            value={filters.bathrooms}
            onChange={(e) => setFilters((f) => ({ ...f, bathrooms: e.target.value }))}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="">Any baths</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}+ bath</option>
            ))}
          </select>
          <select
            value={filters.priceMax}
            onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="">Any price</option>
            <option value="2000000">Up to ₦2,000,000</option>
            <option value="4000000">Up to ₦4,000,000</option>
            <option value="6000000">Up to ₦6,000,000</option>
            <option value="9000000">Up to ₦9,000,000</option>
          </select>
          <div className="flex-1" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-neutral-900 text-neutral-200 text-sm rounded-lg px-3 py-2 border border-neutral-800"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Lowest price</option>
            <option value="price_high">Highest price</option>
            <option value="popular">Most popular</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {chip("furnished", "Furnished")}
          {chip("serviced", "Serviced")}
          {chip("petFriendly", "Pet friendly")}
          {chip("parking", "Parking")}
          {chip("verified", "Verified")}
          {chip("isNew", "New listing")}
          {chip("premium", "Premium")}
          <span className="text-neutral-600 text-xs ml-auto">{resultCount} result{resultCount === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

export function Search({ initialQuery, onOpenProperty, saved, toggleSave, compareIds, toggleCompare }) {
  const [filters, setFilters] = useState({
    district: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    priceMax: "",
    furnished: false,
    serviced: false,
    petFriendly: false,
    parking: false,
    verified: false,
    isNew: false,
    premium: false,
  });
  const [sort, setSort] = useState("newest");
  const [textQuery, setTextQuery] = useState(initialQuery || "");

  useEffect(() => {
    setTextQuery(initialQuery || "");
  }, [initialQuery]);

  const results = useMemo(() => {
    let list = ALL_PROPERTIES.filter((p) => {
      if (filters.district && p.districtKey !== filters.district) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
      if (filters.bathrooms && p.bathrooms < Number(filters.bathrooms)) return false;
      if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
      if (filters.furnished && !p.furnished) return false;
      if (filters.serviced && !p.serviced) return false;
      if (filters.petFriendly && !p.petFriendly) return false;
      if (filters.parking && p.parking < 1) return false;
      if (filters.verified && !p.verified) return false;
      if (filters.isNew && !p.isNew) return false;
      if (filters.premium && !p.premium) return false;
      if (textQuery) {
        const q = textQuery.toLowerCase();
        if (!p.district.toLowerCase().includes(q) && !p.type.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    switch (sort) {
      case "oldest":
        list = [...list].sort((a, b) => b.daysAgo - a.daysAgo);
        break;
      case "price_low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort((a, b) => b.popularity - a.popularity);
        break;
      case "updated":
        list = [...list].sort((a, b) => a.daysAgo - b.daysAgo);
        break;
      default:
        list = [...list].sort((a, b) => a.daysAgo - b.daysAgo);
    }
    return list;
  }, [filters, sort, textQuery]);

  return (
    <div>
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-2">
        <div className="flex items-center gap-2 max-w-md">
          <input
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder="Search district or property type"
            className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 flex-1 outline-none"
          />
        </div>
      </div>
      <FilterBar filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} resultCount={results.length} />
      <div className="max-w-6xl mx-auto px-5 py-8">
        {results.length === 0 ? (
          <EmptyState
            title="No properties match yet"
            body="Try widening your price range or clearing a filter or two. New listings are added often."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onOpen={onOpenProperty}
                saved={saved.includes(p.id)}
                onToggleSave={toggleSave}
                compared={compareIds.includes(p.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CategoryCard({ category, count, onClick, delay }) {
  return (
    <FadeUp delay={delay}>
      <button
        onClick={onClick}
        disabled={count === 0}
        className={`doxxa-card-premium w-full text-left bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col gap-3 ${count === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <span className="text-3xl">{category.icon}</span>
        <div>
          <p className="text-neutral-100 text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>{category.label}</p>
          <p className="text-neutral-500 text-xs mt-0.5">{count} {count === 1 ? "listing" : "listings"}</p>
        </div>
      </button>
    </FadeUp>
  );
}

export function DistrictPage({ districtKey, onBack, onOpenCategory }) {
  const normKey = (districtKey || "").toLowerCase().replace(/[-_]/g, "");
  const district = DISTRICT_LIST.find((d) => 
    (d.key && d.key.toLowerCase().replace(/[-_]/g, "") === normKey) ||
    (d.name && d.name.toLowerCase().replace(/[-_ ]/g, "") === normKey)
  ) || {
    key: districtKey,
    name: (districtKey || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    blurb: `Explore verified properties and apartments in ${(districtKey || "").replace(/[-_]/g, " ")}.`,
  };
  const parallax = useParallax(0.1);
  const districtProperties = ALL_PROPERTIES.filter((p) => {
    const pKey = (p.districtKey || "").toLowerCase().replace(/[-_]/g, "");
    const pName = (p.district || "").toLowerCase().replace(/[-_ ]/g, "");
    return pKey === normKey || pName === normKey;
  });
  const countFor = (catKey) => {
    const normCat = catKey.toLowerCase().replace(/[-_]/g, "");
    return districtProperties.filter((p) => {
      const pCat = (p.categoryKey || "").toLowerCase().replace(/[-_]/g, "");
      return pCat === normCat;
    }).length;
  };

  return (
    <div>
      <div className="relative h-72 flex items-end overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[130%] -top-[8%]"
          style={{ transform: `translateY(${parallax}px) scale(1.08)`, transition: "transform 0.1s linear" }}
        >
          <DistrictHeroImage districtKey={district.key} name={district.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/10" />
        <div className="relative max-w-6xl mx-auto w-full px-5 pb-8">
          <button onClick={onBack} className="text-neutral-300 hover:text-neutral-100 text-xs mb-4">&larr; Abuja Hub</button>
          <FadeUp delay={0}>
            <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-2">Abuja, Nigeria</p>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="text-neutral-50 text-3xl md:text-4xl mb-2" style={{ fontFamily: "Georgia, serif" }}>{district.name}</h1>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="text-neutral-300 text-sm max-w-lg mb-1">{district.blurb}</p>
            <p className="text-neutral-400 text-xs">{districtProperties.length} {districtProperties.length === 1 ? "property" : "properties"} available</p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="text-neutral-100 text-xl mb-6" style={{ fontFamily: "Georgia, serif" }}>Available property types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PROPERTY_CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.key}
              category={cat}
              count={countFor(cat.key)}
              delay={i * 40}
              onClick={() => onOpenCategory(district.key || districtKey, cat.key)}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}

export function DistrictCategoryListings({ districtKey, categoryKey, onBack, onBackHome, onOpenProperty, saved, toggleSave, compareIds, toggleCompare }) {
  const normKey = (districtKey || "").toLowerCase().replace(/[-_]/g, "");
  const district = DISTRICT_LIST.find((d) => 
    (d.key && d.key.toLowerCase().replace(/[-_]/g, "") === normKey) ||
    (d.name && d.name.toLowerCase().replace(/[-_ ]/g, "") === normKey)
  ) || {
    key: districtKey,
    name: (districtKey || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };

  const normCat = (categoryKey || "").toLowerCase().replace(/[-_ ]/g, "");
  const category = PROPERTY_CATEGORIES.find((c) => 
    c.key.toLowerCase().replace(/[-_ ]/g, "") === normCat ||
    c.label.toLowerCase().replace(/[-_ ]/g, "").includes(normCat) ||
    normCat.includes(c.key.toLowerCase().replace(/[-_ ]/g, ""))
  ) || {
    key: categoryKey,
    label: (categoryKey || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: "🏠"
  };

  const results = ALL_PROPERTIES.filter((p) => {
    const pDist = (p.districtKey || "").toLowerCase().replace(/[-_]/g, "");
    const pDistName = (p.district || "").toLowerCase().replace(/[-_ ]/g, "");
    const pCat = (p.categoryKey || "").toLowerCase().replace(/[-_]/g, "");
    const pType = (p.type || "").toLowerCase().replace(/[-_ ]/g, "");
    const matchDist = pDist === normKey || pDistName === normKey;
    const matchCat = pCat === normCat || pType.includes(normCat) || normCat.includes(pCat);
    return matchDist && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
        <button onClick={onBackHome} className="hover:text-neutral-300">Abuja Hub</button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-neutral-300">{district.name}</button>
        <span>/</span>
        <span className="text-neutral-300">{category.label}</span>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">{category.icon}</span>
        <h1 className="text-neutral-50 text-2xl" style={{ fontFamily: "Georgia, serif" }}>{category.label}s in {district.name}</h1>
      </div>
      {results.length === 0 ? (
        <EmptyState title="No listings yet" body="Check back soon, or explore another property type in this district." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onOpen={onOpenProperty}
              saved={saved.includes(p.id)}
              onToggleSave={toggleSave}
              compared={compareIds.includes(p.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CostRow({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
      <span className={muted ? "text-neutral-500 text-sm" : "text-neutral-300 text-sm"}>{label}</span>
      <span className={muted ? "text-neutral-400 text-sm" : "text-neutral-100 text-sm font-medium"}>{formatNaira(value)}</span>
    </div>
  );
}

export function MoveInCalculator({ property }) {
  const agencyFee = property.price * 0.1;
  const legalFee = property.price * 0.05;
  const caution = property.price * 0.1;
  const serviceCharge = property.serviceCharge != null ? property.serviceCharge : (property.serviced ? property.price * 0.08 : 0);
  const total = property.price + agencyFee + legalFee + caution + serviceCharge;
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <p className="text-neutral-100 font-medium mb-1" style={{ fontFamily: "Georgia, serif" }}>Move-in cost calculator</p>
      <p className="text-neutral-500 text-xs mb-4">Estimated, shown before you unlock the agent's direct contact.</p>
      <CostRow label="Annual rent" value={property.price} />
      <CostRow label="Agency fee (10%)" value={agencyFee} muted />
      <CostRow label="Legal fee (5%)" value={legalFee} muted />
      <CostRow label="Caution deposit (10%)" value={caution} muted />
      <CostRow label="Service charge" value={serviceCharge} muted />
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-700">
        <span className="text-neutral-100 text-sm font-medium">Estimated total move-in cost</span>
        <span className="text-amber-400 text-lg font-semibold" style={{ fontFamily: "Georgia, serif" }}>{formatNaira(total)}</span>
      </div>
    </div>
  );
}

export function GalleryTile({ img, className, onClick }) {
  const style = img.src
    ? { backgroundImage: `url(${img.src})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, hsl(${img.hue} 35% 22%), hsl(${img.hue} 30% 12%))` };
  return (
    <button onClick={onClick} className={`relative overflow-hidden rounded-lg group ${className || ""}`} style={style}>
      <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/20 transition-colors" />
      <span className="absolute bottom-1.5 left-2 text-[11px] text-neutral-200/90 drop-shadow">{img.label}</span>
    </button>
  );
}

export function Lightbox({ images, index, setIndex, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  const touchX = React.useRef(null);
  const img = images[index];

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/95 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-neutral-400 text-sm">
        <span>{index + 1} / {images.length} &middot; {img.label}</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setZoomed((z) => !z)} className="hover:text-neutral-100">{zoomed ? "Zoom out" : "Zoom in"}</button>
          <button onClick={onClose} className="hover:text-neutral-100 text-lg leading-none">&times;</button>
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden touch-pan-y"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
          touchX.current = null;
        }}
      >
        <button onClick={prev} className="absolute left-2 sm:left-6 text-neutral-400 hover:text-neutral-100 text-2xl px-2 z-10">&#8249;</button>
        <div
          className={`w-full h-full mx-10 rounded-lg transition-transform duration-200 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
          style={
            img.src
              ? { backgroundImage: `url(${img.src})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }
              : { background: `linear-gradient(135deg, hsl(${img.hue} 35% 22%), hsl(${img.hue} 30% 12%))` }
          }
          onClick={() => setZoomed((z) => !z)}
        />
        <button onClick={next} className="absolute right-2 sm:right-6 text-neutral-400 hover:text-neutral-100 text-2xl px-2 z-10">&#8250;</button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {images.map((im, i) => (
          <GalleryTile key={im.id} img={im} className={`w-16 h-12 shrink-0 ${i === index ? "ring-2 ring-amber-400" : "opacity-70"}`} onClick={() => setIndex(i)} />
        ))}
      </div>
    </div>
  );
}

export function PropertyGallery({ property, isPremiumUnlocked, onUnlockPremium }) {
  const images = useMemo(() => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const valid = property.images.filter((im) => im && (im.image || im.src));
      if (valid.length > 0) {
        return valid.map((im, idx) => ({
          id: im.id || idx,
          src: im.image || im.src,
          label: im.is_primary ? "Main Photo" : `Photo ${idx + 1}`,
          hue: 28,
        }));
      }
    }
    return getPropertyImages(property);
  }, [property?.id, property?.images]);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const visibleCount = isPremiumUnlocked ? images.length : Math.min(3, images.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-neutral-100 font-medium" style={{ fontFamily: "Georgia, serif" }}>Photo gallery</p>
        <span className="text-neutral-500 text-xs">
          {isPremiumUnlocked ? `${images.length} of ${images.length} images` : `${Math.min(visibleCount, images.length)} of ${images.length} images`}
        </span>
      </div>
      {images.length === 1 ? (
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-xl border border-neutral-800">
          <GalleryTile
            img={images[0]}
            className="w-full h-full"
            onClick={() => setLightboxIndex(0)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2" style={{ gridAutoRows: "90px" }}>
          {images.map((img, i) => {
            const locked = i >= visibleCount;
            const big = i === 0;
            return (
              <div key={img.id} className={`relative ${big ? "col-span-2 row-span-2" : ""}`}>
                <GalleryTile
                  img={img}
                  className="w-full h-full"
                  onClick={() => (locked ? onUnlockPremium() : setLightboxIndex(i))}
                />
                {locked && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-neutral-950/70 backdrop-blur-md cursor-pointer"
                    onClick={onUnlockPremium}
                  >
                    <span className="text-lg">&#128274;</span>
                    {i === visibleCount && <span className="text-neutral-200 text-[11px] mt-1">+{images.length - visibleCount} more</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {!isPremiumUnlocked && images.length > 3 && (
        <button onClick={onUnlockPremium} className="mt-3 text-xs text-amber-400 hover:underline">
          Unlock premium to see all {images.length} images &rarr;
        </button>
      )}
      {lightboxIndex !== null && (
        <Lightbox images={images} index={lightboxIndex} setIndex={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

export function ThreeDTourSection({ property, isPremiumUnlocked, onUnlockPremium }) {
  const hasTour = property?.has_virtual_tour || Boolean(property?.tour_url);
  if (!hasTour) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>3D Virtual Tour</p>
      {isPremiumUnlocked ? (
        <div className="rounded-lg overflow-hidden border border-neutral-800">
          <VirtualTourViewer
            propertyId={property.id}
            hasUnlocked={true}
            tourUrl={property.tour_url}
          />
        </div>
      ) : (
        <button onClick={onUnlockPremium} className="relative h-56 w-full rounded-lg overflow-hidden block">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(28 30% 18%), hsl(28 25% 8%))", filter: "blur(6px)" }} />
          <div className="absolute inset-0 bg-neutral-950/50 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">&#128274;</span>
            <p className="text-neutral-100 text-sm font-medium px-6 text-center">Unlock Premium to Experience This Apartment in 3D</p>
          </div>
        </button>
      )}
    </div>
  );
}

export function PremiumUnlockPanel({ property, onUnlockPremium }) {
  return (
    <div className="bg-gradient-to-br from-amber-950/40 to-neutral-900 border border-amber-800/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <PremiumBadge type="locked" />
      </div>
      <p className="text-neutral-100 font-medium mb-1" style={{ fontFamily: "Georgia, serif" }}>Unlock premium details</p>
      <p className="text-neutral-400 text-xs mb-3">One-time payment of {formatNaira(PREMIUM_PRICE)} unlocks this listing for {PREMIUM_ACCESS_DAYS} days.</p>
      <ul className="text-neutral-400 text-xs space-y-1.5 mb-4">
        <li>&#10003; Exact address, agent phone &amp; WhatsApp</li>
        <li>&#10003; All uploaded photos, floor plan &amp; brochure</li>
        <li>&#10003; 3D virtual tour and interactive map</li>
        <li>&#10003; Schedule an inspection</li>
      </ul>
      <button onClick={onUnlockPremium} className="w-full text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-4 py-2.5">
        Unlock for {formatNaira(PREMIUM_PRICE)}
      </button>
    </div>
  );
}

export function PropertyDetail({ propertyId, propertyData, similarProperties, onBack, onOpenAgent, onOpenProperty, saved, toggleSave, compareIds, toggleCompare, isPremiumUnlocked, onUnlockPremium }) {
  const property = propertyData || ALL_PROPERTIES.find((p) => p.id === propertyId || String(p.id) === String(propertyId));
  if (!property) return <EmptyState title="Property not found" body="This listing may have been removed." />;
  
  const agent = property.agent || (property.agentId ? getAgent(property.agentId) : null) || AGENT_LIST[0];
  const isSaved = Boolean(saved?.includes(property.id));
  const isCompared = Boolean(compareIds?.includes(property.id));
  const similar = similarProperties || ALL_PROPERTIES.filter((p) => p.districtKey === property.districtKey && String(p.id) !== String(property.id)).slice(0, 3);
  const nearby = getNearbyPlaces(property);
  const [inspectionBooked, setInspectionBooked] = useState(false);
  const [inspectionDate, setInspectionDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const unlocked = !!isPremiumUnlocked;

  const handleBookInspection = async () => {
    if (!inspectionDate) {
      alert("Please select a date for your inspection.");
      return;
    }
    setIsBooking(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (token) {
        await fetch("/api/inspections/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            property: Number(property.id) || property.id,
            preferred_date: inspectionDate,
            preferred_time: "10:00",
            message: `Inspection request for ${property.title}`
          })
        });
      }
      setInspectionBooked(true);
    } catch {
      setInspectionBooked(true);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      <button onClick={onBack} className="text-neutral-500 hover:text-neutral-300 text-sm mb-4">&larr; Back</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <PropertyGallery property={property} isPremiumUnlocked={unlocked} onUnlockPremium={onUnlockPremium} />
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {property.verified && <PremiumBadge type="verifiedProperty" />}
                  {property.premium && <Badge tone="premium">Premium listing</Badge>}
                  <PremiumBadge type={unlocked ? "unlocked" : "locked"} />
                </div>
                <h1 className="text-neutral-50 text-2xl font-serif" style={{ fontFamily: "Georgia, serif" }}>{property.title}</h1>
                <p className="text-neutral-400 text-sm mt-1">
                  {property.address ? `${property.address}, ${property.district}` : (unlocked ? property.district : `${property.district} (approximate location)`)} &middot; {property.bedrooms} bed &middot; {property.bathrooms} bath &middot; {property.parking} parking
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-amber-400 text-xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>{formatNaira(property.price)}</p>
                <p className="text-neutral-600 text-xs">per year</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => toggleSave && toggleSave(property.id)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${isSaved ? "border-rose-800 text-rose-300 bg-rose-950" : "border-neutral-800 text-neutral-400"}`}>
                <IconHeart filled={isSaved} /> {isSaved ? "Saved" : "Save"}
              </button>
              <button onClick={() => toggleCompare && toggleCompare(property.id)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${isCompared ? "border-amber-700 text-amber-300 bg-amber-950" : "border-neutral-800 text-neutral-400"}`}>
                <IconCompare /> {isCompared ? "Added to compare" : "Compare"}
              </button>
              <button 
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: property.title, url: window.location.href });
                  } else if (typeof navigator !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-200"
              >
                <IconShare /> Share
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {property.status && <Badge tone={property.status === "Available" ? "verified" : "premium"}>{property.status}</Badge>}
              {property.furnished && <Badge>Furnished</Badge>}
              {property.serviced && <Badge>Serviced</Badge>}
              {property.petFriendly && <Badge>Pet friendly</Badge>}
              {property.parking > 0 && <Badge>{property.parking} parking</Badge>}
            </div>
            {property.description && (
              <div className="mb-6">
                <p className="text-neutral-100 font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>About this home</p>
                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Features & Amenities from DB */}
            {property.amenities_details && property.amenities_details.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-6">
                <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Features &amp; Amenities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities_details.map((a) => (
                    <div key={a.id || a.name} className="flex items-center gap-2 text-sm text-neutral-300">
                      <span className="text-amber-400 font-bold">&#10003;</span>
                      <span className="capitalize">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThreeDTourSection property={property} isPremiumUnlocked={unlocked} onUnlockPremium={onUnlockPremium} />

          <div>
            <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Location &amp; map</p>
            {unlocked ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <p className="text-neutral-200 text-sm mb-3">{property.address || property.district}, Abuja</p>
                <div className="rounded-lg overflow-hidden border border-neutral-800">
                  <PropertyMap
                    latitude={property.latitude ?? null}
                    longitude={property.longitude ?? null}
                    address={property.address || property.district}
                  />
                </div>
              </div>
            ) : (
              <button onClick={onUnlockPremium} className="relative h-40 w-full rounded-xl overflow-hidden block border border-neutral-800">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(200 25% 18%), hsl(200 25% 8%))", filter: "blur(5px)" }} />
                <div className="absolute inset-0 bg-neutral-950/50 flex flex-col items-center justify-center gap-1">
                  <span className="text-lg">&#128274;</span>
                  <p className="text-neutral-200 text-xs">Unlock to see the exact location on the map</p>
                </div>
              </button>
            )}
          </div>

          <div>
            <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Floor plan &amp; brochure</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{ label: "Floor plan", sub: "PDF layout of all rooms" }, { label: "Property brochure", sub: "Full spec sheet & pricing" }].map((d) => (
                <div key={d.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-neutral-200 text-sm font-medium">{d.label}</p>
                    <p className="text-neutral-500 text-xs">{d.sub}</p>
                  </div>
                  {unlocked ? (
                    <button className="text-xs text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-3 py-1.5 whitespace-nowrap">Download</button>
                  ) : (
                    <button onClick={onUnlockPremium} className="text-xs text-neutral-400 border border-neutral-700 rounded-lg px-3 py-1.5 whitespace-nowrap">&#128274; Locked</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Nearby</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearby.map((n) => (
                <div key={n.key} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-lg">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-200 text-sm truncate">{n.name}</p>
                    <p className="text-neutral-500 text-xs">{n.label} &middot; {n.distanceKm} km away</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {similar.length > 0 && (
            <div>
              <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Similar in {property.district}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similar.map((p) => (
                  <div key={p.id} onClick={() => onOpenProperty && onOpenProperty(p.id)} className="cursor-pointer">
                    <PropertyCard
                      property={p}
                      onOpen={(id) => onOpenProperty && onOpenProperty(id)}
                      saved={Boolean(saved?.includes(p.id))}
                      onToggleSave={toggleSave}
                      compared={Boolean(compareIds?.includes(p.id))}
                      onToggleCompare={toggleCompare}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <MoveInCalculator property={property} />

          {!unlocked && <PremiumUnlockPanel property={property} onUnlockPremium={onUnlockPremium} />}

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <AgentAvatar agent={agent} size={56} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-neutral-100 text-sm font-medium truncate">{agent.name || "Agent"}</p>
                  {agent.verified && <PremiumBadge type="verifiedAgent" />}
                </div>
                <p className="text-neutral-500 text-xs truncate">{agent.agency || "DOXXA Verified Partner"}</p>
              </div>
            </div>
            {unlocked ? (
              <div className="flex flex-col gap-2 text-sm">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="text-center bg-amber-400 hover:bg-amber-300 text-neutral-900 rounded-lg py-2 text-xs font-medium">Call {agent.phone}</a>
                )}
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`} className="text-center bg-emerald-700 hover:bg-emerald-600 text-neutral-50 rounded-lg py-2 text-xs font-medium">WhatsApp agent</a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="text-center border border-neutral-700 text-neutral-300 rounded-lg py-2 text-xs">{agent.email}</a>
                )}
              </div>
            ) : (
              <button onClick={onUnlockPremium} className="w-full text-center border border-dashed border-neutral-700 text-neutral-500 rounded-lg py-3 text-xs">
                &#128274; Phone, WhatsApp &amp; email hidden until unlocked
              </button>
            )}
            {agent.id && (
              <button onClick={() => onOpenAgent && onOpenAgent(agent.id)} className="text-xs text-amber-400 hover:underline mt-3">View agent profile &rarr;</button>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-neutral-100 text-sm font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>Book an inspection</p>
            {!unlocked ? (
              <p className="text-neutral-500 text-xs">Unlock premium access to schedule a visit with the agent.</p>
            ) : inspectionBooked ? (
              <div className="flex items-center gap-2 text-emerald-300 text-xs py-2">
                <PremiumBadge type="doxxaVerifiedVisit" />
                <span>Inspection request submitted for {agent.name || "the agent"}.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input 
                  type="date" 
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-400" 
                />
                <button 
                  onClick={handleBookInspection} 
                  disabled={isBooking}
                  className="text-xs font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                  {isBooking ? "Submitting..." : "Request inspection"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentProfile({ agentId, onBack, onOpenProperty }) {
  const [agent, setAgent] = useState(() => AGENT_LIST.find((a) => String(a.id) === String(agentId)) || null);
  const [loading, setLoading] = useState(!agent);

  useEffect(() => {
    if (!agent && agentId) {
      fetch("/api/auth/agents/")
        .then((r) => (r.ok ? r.json() : null))
        .then((agents) => {
          if (Array.isArray(agents)) {
            const found = agents.find((a) => String(a.id) === String(agentId));
            if (found) {
              setAgent({
                id: String(found.id),
                name: (found.first_name && found.last_name) ? `${found.first_name} ${found.last_name}` : (found.username || "Verified Agent"),
                agency: "DOXXA Verified Partner",
                phone: found.phone_number || "+234 800 000 0000",
                whatsapp: found.phone_number || "",
                email: found.email || "",
                verified: found.is_verified ?? true,
                photoUrl: found.profile_picture || null,
                rating: 4.9,
                reviewCount: 16,
                years: 5,
                responseTime: "Usually replies in under 1 hour",
                address: "Abuja, Nigeria"
              });
              return;
            }
          }
          setAgent(AGENT_LIST[0]);
        })
        .catch(() => setAgent(AGENT_LIST[0]))
        .finally(() => setLoading(false));
    }
  }, [agentId, agent]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-20 text-center text-neutral-400">
        Loading agent profile...
      </div>
    );
  }

  const activeAgent = agent || AGENT_LIST[0];
  const listings = ALL_PROPERTIES.filter((p) => p.agentId === activeAgent.id);
  const rented = listings.filter((p) => p.status === "Rented").length;
  const active = listings.filter((p) => p.status !== "Rented").length;
  const reviews = getAgentReviews(activeAgent);

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      <button onClick={onBack} className="text-neutral-500 hover:text-neutral-300 text-sm mb-4">&larr; Back</button>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col sm:flex-row gap-6 mb-6">
        <AgentAvatar agent={activeAgent} size={112} />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-neutral-50 text-2xl" style={{ fontFamily: "Georgia, serif" }}>{activeAgent.name}</h1>
            {activeAgent.verified && <Badge tone="verified">Verified agent</Badge>}
          </div>
          <p className="text-neutral-400 text-sm mt-1">{activeAgent.agency}</p>
          <div className="flex items-center gap-2 mt-2">
            <Stars value={activeAgent.rating} />
            <span className="text-neutral-400 text-sm">{activeAgent.rating} rating &middot; {activeAgent.reviewCount} reviews</span>
          </div>
          <p className="text-neutral-500 text-xs mt-2">{activeAgent.responseTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Years experience", value: activeAgent.years || 5 },
          { label: "Active listings", value: active },
          { label: "Properties rented", value: rented },
          { label: "Customer rating", value: activeAgent.rating || 4.8 },
        ].map((s) => (
          <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
            <p className="text-amber-400 text-xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>{s.value}</p>
            <p className="text-neutral-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Customer reviews</p>
          <div className="flex flex-col gap-3">
            {reviews.map((r, i) => (
              <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-neutral-200 text-sm font-medium">{r.name}</p>
                  <Stars value={r.rating} />
                </div>
                <p className="text-neutral-500 text-sm">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Contact</p>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Phone</span><span className="text-neutral-200">{activeAgent.phone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">WhatsApp</span><span className="text-neutral-200">{activeAgent.whatsapp || "—"}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Email</span><span className="text-neutral-200 truncate ml-2">{activeAgent.email || "—"}</span></div>
            <div className="pt-2 border-t border-neutral-800">
              <span className="text-neutral-500">Office</span>
              <p className="text-neutral-200 mt-0.5">{activeAgent.address || "Abuja, Nigeria"}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-neutral-100 font-medium mb-3" style={{ fontFamily: "Georgia, serif" }}>Listings by {activeAgent.name}</p>
        {listings.length === 0 ? (
          <EmptyState title="No listings yet" body="This agent has not published any properties." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((p) => (
              <PropertyCard key={p.id} property={p} onOpen={onOpenProperty} saved={false} onToggleSave={() => { }} compared={false} onToggleCompare={() => { }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SavedView({ ids, onOpenProperty, saved, toggleSave, compareIds, toggleCompare }) {
  const list = ALL_PROPERTIES.filter((p) => ids.includes(p.id));
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-neutral-50 text-2xl mb-6" style={{ fontFamily: "Georgia, serif" }}>Saved properties</h1>
      {list.length === 0 ? (
        <EmptyState title="Nothing saved yet" body="Tap the heart icon on any listing to keep it here for later." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} onOpen={onOpenProperty} saved={saved.includes(p.id)} onToggleSave={toggleSave} compared={compareIds.includes(p.id)} onToggleCompare={toggleCompare} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CompareView({ ids, toggleCompare, onOpenProperty }) {
  const list = ALL_PROPERTIES.filter((p) => ids.includes(p.id));
  const rows = [
    { label: "District", get: (p) => p.district },
    { label: "Type", get: (p) => p.type },
    { label: "Rent (annual)", get: (p) => formatNaira(p.price) },
    { label: "Bedrooms", get: (p) => p.bedrooms },
    { label: "Bathrooms", get: (p) => p.bathrooms },
    { label: "Parking", get: (p) => p.parking },
    { label: "Furnished", get: (p) => (p.furnished ? "Yes" : "No") },
    { label: "Serviced", get: (p) => (p.serviced ? "Yes" : "No") },
    { label: "Pet friendly", get: (p) => (p.petFriendly ? "Yes" : "No") },
    { label: "Status", get: (p) => p.status },
  ];
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-neutral-50 text-2xl mb-6" style={{ fontFamily: "Georgia, serif" }}>Compare properties</h1>
      {list.length === 0 ? (
        <EmptyState title="Nothing to compare yet" body="Add two or more properties from search results using the compare icon." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-neutral-500 font-normal p-3 border-b border-neutral-800 w-32">&nbsp;</th>
                {list.map((p) => (
                  <th key={p.id} className="p-3 border-b border-neutral-800 text-left">
                    <DistrictHeroImage districtKey={p.districtKey} name={p.district} className="w-full h-20 object-cover rounded-lg mb-2" />
                    <p className="text-neutral-100 font-medium">{p.title}</p>
                    <button onClick={() => toggleCompare(p.id)} className="text-rose-400 text-xs mt-1 hover:underline">Remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="p-3 border-b border-neutral-900 text-neutral-500">{r.label}</td>
                  {list.map((p) => (
                    <td key={p.id} className="p-3 border-b border-neutral-900 text-neutral-200">{r.get(p)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-neutral-500"> </td>
                {list.map((p) => (
                  <td key={p.id} className="p-3">
                    <button onClick={() => onOpenProperty(p.id)} className="text-xs text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded px-3 py-1.5">View details</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CheckoutView({ propertyId, propertyData = null, onBack, onPaid }) {
  const [property, setProperty] = useState(() => propertyData || null);
  const [provider, setProvider] = useState("paystack");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (propertyData) {
      setProperty(propertyData);
      return;
    }
    if (propertyId) {
      fetch(`/api/properties/${propertyId}/`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setProperty({
              id: String(data.id),
              title: data.title,
              district: data.district_details?.name || "Abuja",
              price: Number(data.annual_rent) || 0,
            });
          } else {
            const mock = ALL_PROPERTIES.find((p) => String(p.id) === String(propertyId));
            if (mock) setProperty(mock);
          }
        })
        .catch(() => {
          const mock = ALL_PROPERTIES.find((p) => String(p.id) === String(propertyId));
          if (mock) setProperty(mock);
        });
    }
  }, [propertyId, propertyData]);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.email) setEmail(u.email);
      }
    } catch {}
  }, []);

  const pay = () => {
    setProcessing(true);
    if (provider === "paystack") {
      makePaystackPayment({
        email: email || "customer@doxxarentals.com",
        amount: PREMIUM_PRICE,
        propertyId: String(propertyId),
        onSuccess: (reference) => {
          setProcessing(false);
          try {
            const token = localStorage.getItem("access_token");
            if (token) {
              fetch(`/api/properties/${propertyId}/unlock_virtual_tour/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }).catch(() => {});
            }
          } catch {}
          onPaid(propertyId);
        },
        onCancel: () => {
          setProcessing(false);
        },
      });
    } else {
      setTimeout(() => {
        setProcessing(false);
        onPaid(propertyId);
      }, 1200);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <button onClick={onBack} className="text-neutral-500 hover:text-neutral-300 text-sm mb-6">&larr; Back to listing</button>
      <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-2">Checkout</p>
      <h1 className="text-neutral-50 text-2xl mb-6" style={{ fontFamily: "Georgia, serif" }}>Unlock premium details</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-5 flex items-center justify-between">
        <div>
          <p className="text-neutral-200 text-sm font-medium">{property ? property.title : "Property Listing"}</p>
          <p className="text-neutral-500 text-xs">{property?.district || "Abuja"} &middot; {PREMIUM_ACCESS_DAYS}-day premium access</p>
        </div>
        <p className="text-amber-400 font-semibold" style={{ fontFamily: "Georgia, serif" }}>{formatNaira(PREMIUM_PRICE)}</p>
      </div>

      <div className="mb-5">
        <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Your Email Address (for Paystack receipt)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
        />
      </div>

      <p className="text-neutral-400 text-xs mb-3">Choose a payment provider</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {PAYMENT_PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className={`text-left rounded-xl border p-4 transition ${provider === p.id ? "border-amber-500 bg-amber-950/30 ring-1 ring-amber-500" : "border-neutral-800 bg-neutral-900 hover:border-neutral-700"}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-neutral-100 text-sm font-medium">{p.name}</p>
              {p.id === "paystack" && <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">Instant</span>}
            </div>
            <p className="text-neutral-500 text-xs mt-1">{p.blurb}</p>
          </button>
        ))}
      </div>

      <button
        onClick={pay}
        disabled={processing}
        className="w-full text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-lg px-4 py-3 transition flex items-center justify-center gap-2"
      >
        {processing ? "Launching Paystack\u2026" : `Pay ${formatNaira(PREMIUM_PRICE)} with ${PAYMENT_PROVIDERS.find((p) => p.id === provider)?.name || "Paystack"}`}
      </button>
      <p className="text-neutral-500 text-[11px] mt-3 text-center">Secured with 256-bit SSL encryption. Accepts Card, Bank Transfer, USSD &amp; Mobile Money.</p>
    </div>
  );
}

export function PremiumSuccessView({ propertyId, propertyData = null, onViewProperty }) {
  const [property, setProperty] = useState(() => propertyData || null);

  useEffect(() => {
    if (propertyData) {
      setProperty(propertyData);
      return;
    }
    if (propertyId) {
      fetch(`/api/properties/${propertyId}/`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setProperty({
              id: String(data.id),
              title: data.title,
            });
          } else {
            const mock = ALL_PROPERTIES.find((p) => String(p.id) === String(propertyId));
            if (mock) setProperty(mock);
          }
        })
        .catch(() => {
          const mock = ALL_PROPERTIES.find((p) => String(p.id) === String(propertyId));
          if (mock) setProperty(mock);
        });
    }
  }, [propertyId, propertyData]);

  return (
    <div className="max-w-lg mx-auto px-5 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-3xl flex items-center justify-center mx-auto mb-5">
        &#10003;
      </div>
      <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-2">Payment successful</p>
      <h1 className="text-neutral-50 text-2xl mb-3" style={{ fontFamily: "Georgia, serif" }}>Premium access granted</h1>
      <p className="text-neutral-400 text-sm mb-8">
        You now have full access to {property ? property.title : "this listing"} for {PREMIUM_ACCESS_DAYS} days &mdash; including the exact address, agent contact, full gallery, 3D tour, floor plan, and brochure.
      </p>
      <button onClick={() => onViewProperty(propertyId)} className="text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-6 py-3">
        View full property &rarr;
      </button>
    </div>
  );
}

export function SignupView({ initialRole, onBack, onSuccess }) {
  const [role, setRole] = useState(initialRole || "renter");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || (role === "agent" && agency ? agency : "");
      const lastName = nameParts.slice(1).join(" ") || "";

      await register({
        email: email.trim().toLowerCase(),
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone.trim(),
        role: role === "agent" ? "AGENT" : "USER",
      });

      setSuccess(true);
      if (onSuccess) {
        onSuccess(role);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-3xl flex items-center justify-center mx-auto mb-5">&#10003;</div>
        <h1 className="text-neutral-50 text-2xl mb-3" style={{ fontFamily: "Georgia, serif" }}>Welcome to DOXXA</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Your {role === "agent" ? "agent" : "renter"} account has been created successfully. You are now logged in.
        </p>
        <button onClick={onBack} className="text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-6 py-3">
          Explore listings &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 py-10">
      <button onClick={onBack} className="text-neutral-500 hover:text-neutral-300 text-sm mb-6">&larr; Back</button>
      <div className="flex gap-2 mb-6 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
        {[{ id: "renter", label: "I'm a renter" }, { id: "agent", label: "I'm an agent / landlord" }].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`flex-1 text-xs font-medium rounded-md py-2 transition-colors ${role === r.id ? "bg-amber-400 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <h1 className="text-neutral-50 text-2xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
        {role === "renter" ? "Create your renter account" : "Create your agent account"}
      </h1>
      <p className="text-neutral-500 text-sm mb-6">
        {role === "renter" ? "Browse, save, and unlock premium listings." : "List properties and start receiving client enquiries."}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Full name</label>
          <input 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={role === "agent" ? "e.g. Samuel Okon" : "e.g. Amara Johnson"} 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Email address *</label>
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email" 
            required
            placeholder="you@example.com" 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Phone number</label>
          <input 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="+234 800 000 0000" 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
          />
        </div>

        {role === "agent" && (
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Agency / Company name</label>
            <input 
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              placeholder="e.g. Apex Living Properties" 
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
            />
          </div>
        )}

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Password * (min 8 characters)</label>
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            required
            minLength={8}
            placeholder="••••••••" 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Confirm password</label>
          <input 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password" 
            placeholder="••••••••" 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="text-sm font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-4 py-2.5 mt-2 transition disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : (role === "renter" ? "Create renter account" : "Create agent account")}
        </button>

        <p className="text-neutral-500 text-xs text-center mt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export function AboutPage() {
  const stats = [
    { label: "Properties", value: ALL_PROPERTIES.length },
    { label: "Districts", value: DISTRICT_LIST.length },
    { label: "Agents", value: AGENT_LIST.length },
    { label: "Happy clients", value: "1,200+" },
    { label: "Verified listings", value: ALL_PROPERTIES.filter((p) => p.verified).length },
  ];
  return (
    <div>
      <div className="border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-5 py-16 text-center">
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3">About us</p>
          <h1 className="text-neutral-50 text-3xl md:text-4xl mb-4" style={{ fontFamily: "Georgia, serif" }}>Building trust into every rental in Abuja</h1>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto">
            DoxxaRentals is a technology-driven rental platform built to remove the guesswork, hidden fees, and unreliable agents from renting a home in Abuja &mdash; and eventually, across Nigeria.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-neutral-100 font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>Our story</p>
          <p className="text-neutral-500 text-sm leading-relaxed">
            DoxxaRentals grew out of DOXXA, a real estate marketing company whose founders saw first-hand how opaque pricing and unverified agents made renting stressful for everyday people. We set out to build the platform we wished existed.
          </p>
        </div>
        <div>
          <p className="text-neutral-100 font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>Our mission</p>
          <p className="text-neutral-500 text-sm leading-relaxed">
            To make renting a home as transparent, safe, and simple as it should be &mdash; with verified listings, upfront costs, and agents who are accountable for what they promise.
          </p>
        </div>
        <div>
          <p className="text-neutral-100 font-medium mb-2" style={{ fontFamily: "Georgia, serif" }}>Our vision</p>
          <p className="text-neutral-500 text-sm leading-relaxed">
            A Nigeria where anyone can find and secure a home online with confidence, without a single in-person visit to an unverified agent's office.
          </p>
        </div>
      </div>

      <div className="border-t border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-amber-400 text-2xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>{s.value}</p>
                <p className="text-neutral-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-14">
        <p className="text-neutral-100 font-medium mb-2 text-center" style={{ fontFamily: "Georgia, serif" }}>Why trust DoxxaRentals?</p>
        <p className="text-neutral-500 text-sm text-center max-w-2xl mx-auto mb-8">
          Every listing is reviewed before it goes live, every agent's track record is visible, and every price includes the true cost of moving in &mdash; no surprises at signing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { t: "Verified listings", d: "Properties are checked before they're published to the platform." },
            { t: "Rated, accountable agents", d: "Real reviews and response times, visible on every agent profile." },
            { t: "Transparent pricing", d: "Agency fees, legal fees, and deposits shown upfront, before you unlock contact details." },
          ].map((f) => (
            <div key={f.t}>
              <PremiumBadge type="doxxaVerified" />
              <p className="text-neutral-200 text-sm font-medium mt-3 mb-1">{f.t}</p>
              <p className="text-neutral-500 text-xs">{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-5 py-14">
          <p className="text-neutral-100 text-xl text-center mb-2" style={{ fontFamily: "Georgia, serif" }}>Meet the team</p>
          <p className="text-neutral-500 text-sm text-center mb-10">The people building DoxxaRentals.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM_LIST.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

