"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Property, API_BASE, adaptBackendProperty, BackendProperty } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

interface Category {
  id: number;
  slug: string;
  name: string;
}

interface District {
  id: number;
  slug: string;
  name: string;
}

const SORT_OPTIONS = [
  { value: "-date_posted", label: "Newest First" },
  { value: "date_posted", label: "Oldest First" },
  { value: "annual_rent", label: "Price: Low to High" },
  { value: "-annual_rent", label: "Price: High to Low" },
  { value: "-views_count", label: "Most Viewed" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category_slug") || "");
  const [districtId, setDistrictId] = useState(searchParams.get("district") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("ordering") || "-date_posted");

  // Load filter options from the backend
  useEffect(() => {
    fetch(`${API_BASE}/api/categories/`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => { });

    fetch(`${API_BASE}/api/districts/`)
      .then((r) => r.json())
      .then((data) => setDistricts(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => { });
  }, []);

  // Fetch properties whenever filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProperties();
    }, 300); // debounce search input
    return () => clearTimeout(handler);
  }, [searchQuery, minPrice, maxPrice, bedrooms, bathrooms, categorySlug, districtId, sortBy]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      if (bedrooms) params.set("bedrooms", bedrooms);
      if (bathrooms) params.set("bathrooms", bathrooms);
      if (categorySlug) params.set("category_slug", categorySlug);
      if (districtId) params.set("district", districtId);
      params.set("ordering", sortBy);

      const res = await fetch(`${API_BASE}/api/properties/?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const raw: BackendProperty[] = Array.isArray(data) ? data : data.results ?? [];
      setTotalCount(Array.isArray(data) ? data.length : data.count ?? raw.length);
      setProperties(raw.map((bp) => adaptBackendProperty(bp)));
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setBathrooms("");
    setCategorySlug("");
    setDistrictId("");
    setSortBy("-date_posted");
  };

  const activeFiltersCount = [minPrice, maxPrice, bedrooms, bathrooms, categorySlug, districtId]
    .filter(Boolean).length;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Search Header */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white shadow-sm">
        <div className="container-page py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property name..."
                className="w-full rounded-xl border border-stone-200 py-3 pl-12 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition ${isFiltersOpen || activeFiltersCount > 0
                ? "border-ink bg-ink text-white"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-medium text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {isFiltersOpen && (
            <div className="mt-4 border-t border-stone-200 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Price Range */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Price Range (₦/yr)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    />
                    <span className="text-stone-400">-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                      Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                      Bathrooms
                    </label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Type (Category) */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Property Type
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    <option value="">All Types</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    District
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    <option value="">All Districts</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort + Clear */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-stone-700">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results count bar */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-stone-600">
              <span className="font-medium text-ink">{totalCount}</span> propert{totalCount === 1 ? "y" : "ies"} found
            </p>
            {!isFiltersOpen && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 focus:border-ink focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-page py-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <Search className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="mt-6 font-display text-xl text-ink">No properties found</h3>
            <p className="mt-2 text-stone-600">Try adjusting your filters or search query</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-ink px-6 py-3 text-white hover:bg-stone-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
