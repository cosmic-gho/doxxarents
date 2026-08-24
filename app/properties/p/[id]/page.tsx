"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Heart,
  Share2,
  Calendar,
  Check,
  ArrowLeft,
  Loader2,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import { PropertyMap } from "@/components/PropertyMap";
import { VirtualTourViewer } from "@/components/VirtualTourViewer";

interface Property {
  id: number;
  title: string;
  description: string;
  annual_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  is_verified: boolean;
  status: string;
  category_details?: { id: number; name: string; icon: string } | null;
  district_details?: {
    id: number;
    name: string;
    slug: string;
  };
  agent: {
    id: number;
    username: string;
    email: string;
    phone_number?: string;
    profile_picture?: string | null;
  } | null;
  amenities_details: { id: number; name: string }[];
  images: { id: number; image: string | null; is_primary: boolean }[];
  views_count: number;
  date_posted: string;
  tour_url?: string | null;
  has_unlocked_virtual_tour?: boolean;
  has_virtual_tour?: boolean;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  useEffect(() => {
    if (isAuthenticated && property) {
      checkIfSaved();
    }
  }, [isAuthenticated, property]);

  const fetchProperty = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/properties/${params.id}/`);
      if (!res.ok) throw new Error("Property not found");
      const data = await res.json();
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/saved/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const saved = data.results?.some(
          (item: { property: number }) => item.property === Number(params.id)
        );
        setIsSaved(saved);
      }
    } catch {
      // Ignore errors
    }
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/p/${params.id}`);
      return;
    }

    try {
      if (isSaved) {
        await fetch(`${API_BASE}/api/saved/${params.id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setIsSaved(false);
      } else {
        await fetch(`${API_BASE}/api/saved/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ property: params.id }),
        });
        setIsSaved(true);
      }
    } catch {
      // Handle error
    }
  };

  const formatPrice = (price: number) => {
    return "₦" + price.toLocaleString("en-GB");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl text-ink">Property Not Found</h1>
        <p className="mt-4 text-stone-600">
          {error || "This property may have been removed or is no longer available."}
        </p>
        <Link
          href="/properties/2-bedroom"
          className="mt-6 inline-block rounded-lg bg-ink px-6 py-3 text-white hover:bg-stone-800"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  const primaryImage = property.images.find((img) => img.is_primary) || property.images[0];
  const agent = property.agent;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-page pt-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="container-page mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
            {primaryImage?.image ? (
              <Image
                src={primaryImage.image}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">
                No Image
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {property.images.slice(0, 4).map((img, idx) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-stone-100"
              >
                {img.image ? (
                  <Image
                    src={img.image}
                    alt={`${property.title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-400">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Virtual Tour Section */}
        {property.has_virtual_tour && (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-ink mb-6">3D Virtual Inspection</h2>
            <VirtualTourViewer
              propertyId={property.id}
              hasUnlocked={property.has_unlocked_virtual_tour}
              tourUrl={property.tour_url}
              onUnlockSuccess={fetchProperty}
            />
          </div>
        )}
      </div>

      <div className="container-page mt-8 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-3xl text-ink">{property.title}</h1>
                <p className="mt-2 flex items-center gap-1 text-stone-600">
                  <MapPin className="h-4 w-4" />
                  {property.address}
                  {property.district_details && (
                    <>, {property.district_details.name}</>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-ink">
                  {formatPrice(property.annual_rent)}
                </p>
                <p className="text-sm text-stone-500">/ year</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2">
                <Bed className="h-5 w-5 text-stone-600" />
                <span className="font-medium text-stone-700">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2">
                <Bath className="h-5 w-5 text-stone-600" />
                <span className="font-medium text-stone-700">{property.bathrooms} Bathrooms</span>
              </div>
              {property.square_feet && (
                <div className="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2">
                  <Square className="h-5 w-5 text-stone-600" />
                  <span className="font-medium text-stone-700">{property.square_feet} sq ft</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl text-ink">Description</h2>
              <p className="mt-3 leading-relaxed text-stone-600">
                {property.description}
              </p>
            </div>

            {property.amenities_details.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-ink">Amenities</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {property.amenities_details.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-2 text-sm text-stone-600"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-xl text-ink">Property Information</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <span className="text-stone-500">Property Type</span>
                  <span className="font-medium text-stone-700">
                    {property.category_details?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <span className="text-stone-500">Status</span>
                  <span className="font-medium text-stone-700">{property.status}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <span className="text-stone-500">Verified</span>
                  <span className="font-medium text-stone-700">
                    {property.is_verified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-100 py-2">
                  <span className="text-stone-500">Listed On</span>
                  <span className="font-medium text-stone-700">
                    {formatDate(property.date_posted)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500">Views</span>
                  <span className="font-medium text-stone-700">
                    {property.views_count}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-12">
              <h2 className="font-display text-xl text-ink mb-4">Location Map</h2>
              <PropertyMap
                latitude={property.latitude ?? null}
                longitude={property.longitude ?? null}
                address={property.address}
              />
            </div>
          </div>

          <div className="space-y-6">
            {agent && (
              <div className="rounded-2xl bg-white p-6 shadow-card">
                <h3 className="font-display text-lg text-ink">Contact Agent</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-stone-200">
                    {agent.profile_picture ? (
                      <Image
                        src={agent.profile_picture}
                        alt={agent.username}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-400">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{agent.username}</p>
                    <p className="text-sm text-stone-500">Property Agent</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {agent.phone_number && (
                    <a
                      href={`tel:${agent.phone_number}`}
                      className="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-200"
                    >
                      <Phone className="h-4 w-4" />
                      {agent.phone_number}
                    </a>
                  )}
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-700 transition hover:bg-stone-200"
                  >
                    <Mail className="h-4 w-4" />
                    {agent.email}
                  </a>
                </div>

                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-dark px-4 py-3 text-sm font-medium text-white transition hover:bg-gold"
                >
                  <Calendar className="h-4 w-4" />
                  Book Inspection
                </button>
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex gap-3">
                <button
                  onClick={toggleSave}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition ${isSaved
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-stone-200 hover:border-stone-300"
                    }`}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.title,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-stone-200 px-4 py-3 transition hover:border-stone-300"
                >
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-stone-50 p-6">
              <h4 className="font-medium text-ink">Safety Tips</h4>
              <ul className="mt-3 space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  Inspect the property in person before paying
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  Never send money before viewing
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  Report suspicious listings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showInspectionModal && (
        <InspectionModal
          propertyId={property.id}
          onClose={() => setShowInspectionModal(false)}
        />
      )}
    </div>
  );
}

function InspectionModal({
  propertyId,
  onClose,
}: {
  propertyId: number;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    preferred_date: "",
    preferred_time: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/inspections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          property: propertyId,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mt-4 font-display text-xl text-ink">Request Sent!</h3>
          <p className="mt-2 text-stone-600">
            The agent will contact you soon to confirm your inspection.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-ink py-3 text-white hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-ink">Book Inspection</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Preferred Date *
            </label>
            <input
              type="date"
              value={formData.preferred_date}
              onChange={(e) =>
                setFormData({ ...formData, preferred_date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Preferred Time *
            </label>
            <select
              value={formData.preferred_time}
              onChange={(e) =>
                setFormData({ ...formData, preferred_time: e.target.value })
              }
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
            >
              <option value="">Select a time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              placeholder="Any specific requirements or questions..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold-dark py-3 text-sm font-medium text-white transition hover:bg-gold disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Request Inspection
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
