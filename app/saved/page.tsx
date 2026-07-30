"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2, Loader2, MapPin, Bed, Bath } from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth";
import { API_BASE, Property, formatPrice } from "@/lib/api";
import Image from "next/image";

interface SavedProperty {
  id: number;
  property: Property;
  date_saved: string;
}

export default function SavedPropertiesPage() {
  return (
    <ProtectedRoute>
      <SavedPropertiesContent />
    </ProtectedRoute>
  );
}

function SavedPropertiesContent() {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/saved/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedProperties(data.results || []);
      }
    } catch (error) {
      console.error("Failed to fetch saved properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSaved = async (id: number) => {
    setRemovingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/saved/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (res.ok) {
        setSavedProperties((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove saved property:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-ink">Saved Properties</h1>
            <p className="text-sm text-stone-500">
              {savedProperties.length} property
              {savedProperties.length !== 1 ? "ies" : "y"} saved
            </p>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <Heart className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="mt-6 font-display text-xl text-ink">
              No saved properties yet
            </h3>
            <p className="mt-2 text-stone-600">
              Start browsing and save your favorite properties here
            </p>
            <Link
              href="/properties/2-bedroom"
              className="mt-6 inline-block rounded-lg bg-ink px-6 py-3 text-white hover:bg-stone-800"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((saved) => (
              <SavedPropertyCard
                key={saved.id}
                saved={saved}
                onRemove={() => removeSaved(saved.id)}
                isRemoving={removingId === saved.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SavedPropertyCard({
  saved,
  onRemove,
  isRemoving,
}: {
  saved: SavedProperty;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const property = saved.property;
  const primaryImage = property.images?.find((img) => img.is_primary) || property.images?.[0];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lg">
      {/* Image */}
      <Link href={`/properties/p/${property.id}`} className="relative block aspect-[4/3]">
        {primaryImage?.image ? (
          <Image
            src={primaryImage.image}
            alt={property.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone-100">
            <span className="text-stone-400">No Image</span>
          </div>
        )}
      </Link>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition hover:bg-white hover:text-red-600 disabled:opacity-50"
      >
        {isRemoving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-lg text-ink">
              {formatPrice(property.monthly_rent)}
              <span className="text-sm font-normal text-stone-500">/mo</span>
            </p>
            <h3 className="mt-1 font-medium text-ink line-clamp-1">{property.title}</h3>
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1 text-sm text-stone-500">
          <MapPin className="h-4 w-4" />
          {property.address}
          {property.district_details && `, ${property.district_details.name}`}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-4 text-sm text-stone-600">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} bath
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-stone-400">
          Saved on {new Date(saved.date_saved).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
