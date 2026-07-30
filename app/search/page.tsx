"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Bed,
  Bath,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Property, formatPrice, API_BASE } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";

interface Filters {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  district: string;
  amenities: string[];
  sortBy: string;
}

const SORT_OPTIONS = [
  { value: "-date_posted", label: "Newest First" },
  { value: "date_posted", label: "Oldest First" },
  { value: "monthly_rent", label: "Price: Low to High" },
  { value: "-monthly_rent", label: "Price: High to Low" },
  { value: "-views_count", label: "Most Viewed" },
];

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "STUDIO", label: "Studio" },
  { value: "1_BEDROOM", label: "1 Bedroom" },
  { value: "2_BEDROOM", label: "2 Bedroom" },
  { value: "3_BEDROOM", label: "3 Bedroom" },
  { value: "4_BEDROOM", label: "4 Bedroom" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "VILLA", label: "Villa" },
];

const AMENITIES_LIST = [
  "Air Conditioning",
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Generator",
  "Furnished",
  "Water Heater",
  "WiFi",
  "Balcony",
  "Garden",
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<Filters>({
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    propertyType: searchParams.get("apartment_type") || "",
    district: searchParams.get("district") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("ordering") || "-date_posted",
  });

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    fetchProperties();
  }, [filters, searchQuery]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) params.set("search", searchQuery);
      if (filters.minPrice) params.set("min_price", filters.minPrice);
      if (filters.maxPrice) params.set("max_price", filters.maxPrice);
      if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
      if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
      if (filters.propertyType)
        params.set("apartment_type", filters.propertyType);
      if (filters.district) params.set("district", filters.district);
      if (filters.amenities.length > 0)
        params.set("amenities", filters.amenities.join(","));
      params.set("ordering", filters.sortBy);

      const res = await fetch(`${API_BASE}/api/properties/?${params}`);
      const data = await res.json();
      setProperties(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
    if (filters.propertyType) params.set("apartment_type", filters.propertyType);
    if (filters.district) params.set("district", filters.district);
    if (filters.amenities.length > 0)
      params.set("amenities", filters.amenities.join(","));
    params.set("ordering", filters.sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
      district: "",
      amenities: [],
      sortBy: "-date_posted",
    });
    setSearchQuery("");
  };

  const activeFiltersCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.bathrooms,
    filters.propertyType,
    filters.district,
    ...filters.amenities,
  ].filter(Boolean).length;

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
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition ${
                isFiltersOpen || activeFiltersCount > 0
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
                    Price Range (₦)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      placeholder="Min"
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    />
                    <span className="text-stone-400">-</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
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
                      value={filters.bedrooms}
                      onChange={(e) =>
                        setFilters({ ...filters, bedrooms: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}+
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700">
                      Bathrooms
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) =>
                        setFilters({ ...filters, bathrooms: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}+
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          amenities: prev.amenities.includes(amenity)
                            ? prev.amenities.filter((a) => a !== amenity)
                            : [...prev.amenities, amenity],
                        }));
                      }}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        filters.amenities.includes(amenity)
                          ? "bg-ink text-white"
                          : "bg-white text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
                  <span className="text-sm text-stone-500">
                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-stone-600">
              <span className="font-medium text-ink">{totalCount}</span> properties
              found
            </p>
            {searchQuery && (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-600">
                Searching: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-stone-400 hover:text-stone-600"
                >
                  <X className="inline h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl bg-stone-200"
                />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
                <Search className="h-10 w-10 text-stone-400" />
              </div>
              <h3 className="mt-6 font-display text-xl text-ink">
                No properties found
              </h3>
              <p className="mt-2 text-stone-600">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-lg bg-ink px-6 py-3 text-white hover:bg-stone-800"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination - simplified */}
          {totalCount > 20 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100">
                Previous
              </button>
              <span className="px-4 text-sm text-stone-600">Page 1 of 5</span>
              <button className="rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
