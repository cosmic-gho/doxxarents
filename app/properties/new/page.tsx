"use client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List a Property — DOXXARentals",
  description: "List your property on DOXXARentals and reach thousands of renters in Abuja, Nigeria. Free to get started.",
};



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  Bed,
  Bath,
  MapPin,
  Home,
  Loader2,
  Check,
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth";
import { API_BASE } from "@/lib/api";

interface PropertyCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

interface Amenity {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
  slug: string;
}

export default function NewPropertyPage() {
  return (
    <ProtectedRoute requireAgent>
      <NewPropertyForm />
    </ProtectedRoute>
  );
}

function NewPropertyForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories/`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => { });
    fetch(`${API_BASE}/api/amenities/`)
      .then((r) => r.json())
      .then((data) => setAmenities(data.results ?? data))
      .catch(() => { });
    fetch(`${API_BASE}/api/districts/`)
      .then((r) => r.json())
      .then((data) => setDistricts(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => { });
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    annual_rent: "",
    category: "" as unknown as number,
    bedrooms: "",
    bathrooms: "",
    address: "",
    district: "",
    latitude: "",
    longitude: "",
    tour_url: "",
    selectedAmenities: [] as number[],
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages([...images, ...newImages]);
      newImages.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(id)
        ? prev.selectedAmenities.filter((a) => a !== id)
        : [...prev.selectedAmenities, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const propertyRes = await fetch(`${API_BASE}/api/properties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          annual_rent: parseFloat(formData.annual_rent),
          category: Number(formData.category),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          address: formData.address,
          district: formData.district ? parseInt(formData.district) : undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          tour_url: formData.tour_url || undefined,
          amenities: formData.selectedAmenities,
        }),
      });

      if (!propertyRes.ok) {
        const err = await propertyRes.json();
        throw new Error(JSON.stringify(err));
      }

      const property = await propertyRes.json();

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const fd = new FormData();
          fd.append("image", images[i]);
          fd.append("is_primary", i === 0 ? "true" : "false");
          await fetch(`${API_BASE}/api/properties/${property.id}/images/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: fd,
          });
        }
      }

      router.push(`/properties/p/${property.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
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
            <h1 className="font-display text-2xl text-ink">List Your Property</h1>
            <p className="text-sm text-stone-500">
              Fill in the details below to list your property on DOXXA
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm">
            {["Basic Info", "Details", "Photos", "Review"].map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${i + 1 <= step ? "text-ink" : "text-stone-400"
                  }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${i + 1 <= step ? "bg-ink text-white" : "bg-stone-200"
                    }`}
                >
                  {i + 1}
                </div>
                <span className="hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-ink transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-card">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-ink">Basic Information</h2>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  placeholder="e.g., Luxury 3 Bedroom Apartment in Maitama"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Property Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  required
                >
                  <option value="">Select property category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  placeholder="Describe your property, its features, and what makes it special..."
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-ink">Property Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Bedrooms *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bedrooms: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Bathrooms *
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bathrooms: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Annual Rent (₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={formData.annual_rent}
                      onChange={(e) =>
                        setFormData({ ...formData, annual_rent: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-200 py-2.5 pl-8 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                >
                  <option value="">Select a district (optional)</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="e.g., 123 Maitama Street, Abuja"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="e.g., 9.0765"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="e.g., 7.3986"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Virtual Tour 3D File URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.tour_url}
                  onChange={(e) =>
                    setFormData({ ...formData, tour_url: e.target.value })
                  }
                  className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  placeholder="e.g., https://example.com/models/apartment.glb"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="mb-3 block text-sm font-medium text-stone-700">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`rounded-full px-4 py-2 text-sm transition ${formData.selectedAmenities.includes(amenity.id)
                        ? "bg-ink text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                    >
                      {formData.selectedAmenities.includes(amenity.id) && (
                        <Check className="mr-1 inline h-3 w-3" />
                      )}
                      {amenity.name}
                    </button>
                  ))}
                  {amenities.length === 0 && (
                    <p className="text-sm text-stone-400">Loading amenities...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-ink">Photos</h2>

              <div>
                <label className="mb-3 block text-sm font-medium text-stone-700">
                  Property Photos *
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-xl bg-stone-100"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-xs text-white">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 transition hover:border-ink hover:bg-stone-100">
                    <Upload className="h-8 w-8 text-stone-400" />
                    <span className="text-sm text-stone-500">Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-3 text-sm text-stone-500">
                  Upload at least 3 photos. The first photo will be the main image.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl text-ink">Review & Submit</h2>

              <div className="rounded-xl bg-stone-50 p-6">
                <h3 className="font-medium text-ink">Property Summary</h3>
                <dl className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Title</dt>
                    <dd className="font-medium text-ink">{formData.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Category</dt>
                    <dd className="font-medium text-ink">
                      {categories.find((c) => c.id === Number(formData.category))?.name || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Price</dt>
                    <dd className="font-medium text-ink">
                      ₦{parseInt(formData.annual_rent).toLocaleString()}/year
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Rooms</dt>
                    <dd className="font-medium text-ink">
                      {formData.bedrooms} bed, {formData.bathrooms} bath
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Address</dt>
                    <dd className="font-medium text-ink">{formData.address}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Photos</dt>
                    <dd className="font-medium text-ink">{images.length} uploaded</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                <Home className="h-5 w-5 shrink-0" />
                <p>
                  By submitting this listing, you agree to our Terms of Service. Your
                  property will be reviewed before going live.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="rounded-lg px-4 py-2 text-stone-600 transition hover:bg-stone-100 disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="rounded-lg bg-ink px-6 py-2.5 text-white transition hover:bg-stone-800"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-gold-dark px-6 py-2.5 text-white transition hover:bg-gold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "List Property"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
