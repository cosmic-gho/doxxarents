"use client";

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

  // Social media broadcast ingestion state
  const [showSocialImport, setShowSocialImport] = useState(false);
  const [socialText, setSocialText] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState("");

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

  const handleParseSocial = async () => {
    if (!socialText.trim()) return;
    setImportLoading(true);
    setImportSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/ingest-social/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: socialText,
          source: "WhatsApp Broadcast / Social Media",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to parse listing text.");
      }

      const data = await res.json();
      const parsed = data.parsed || {};

      // Match district
      const matchedDist = districts.find(
        (d) => d.name.toLowerCase() === data.district?.toLowerCase()
      );

      // Match category
      const matchedCat = categories.find((c) =>
        c.slug.includes(String(parsed.bedrooms)) ||
        (parsed.bedrooms === 1 && c.slug.includes("1-bedroom")) ||
        (parsed.bedrooms === 2 && c.slug.includes("2-bedroom")) ||
        (parsed.bedrooms === 3 && c.slug.includes("3-bedroom"))
      );

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        annual_rent: data.annual_rent ? String(parseInt(data.annual_rent)) : prev.annual_rent,
        bedrooms: parsed.bedrooms != null ? String(parsed.bedrooms) : prev.bedrooms,
        bathrooms: parsed.bathrooms != null ? String(parsed.bathrooms) : prev.bathrooms,
        district: matchedDist ? String(matchedDist.id) : prev.district,
        category: matchedCat ? matchedCat.id : prev.category,
        description: socialText.trim(),
        address: `${data.district || "Abuja"}, FCT`,
      }));

      // Auto check amenities
      const toCheck: number[] = [];
      const textLower = socialText.toLowerCase();
      amenities.forEach((am) => {
        const n = am.name.toLowerCase();
        if (
          (n.includes("security") && textLower.includes("security")) ||
          (n.includes("borehole") && (textLower.includes("borehole") || textLower.includes("water"))) ||
          (n.includes("pop") && textLower.includes("pop")) ||
          (n.includes("power") && (textLower.includes("power") || textLower.includes("light") || textLower.includes("gen"))) ||
          (n.includes("pool") && textLower.includes("pool")) ||
          (n.includes("kitchen") && textLower.includes("kitchen")) ||
          (n.includes("parking") && textLower.includes("parking"))
        ) {
          toCheck.push(am.id);
        }
      });
      if (toCheck.length > 0) {
        setFormData((prev) => ({
          ...prev,
          selectedAmenities: Array.from(new Set([...prev.selectedAmenities, ...toCheck])),
        }));
      }

      setImportSuccess(
        `✓ Parsed successfully: ${parsed.bedrooms || 2} beds in ${data.district || "Abuja"} at ₦${parseInt(data.annual_rent || "0").toLocaleString()}. Form auto-filled! Attach photos below.`
      );
    } catch (err: any) {
      setError(err.message || "Failed to parse listing text.");
    } finally {
      setImportLoading(false);
    }
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950">
      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-amber-400/40 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
              Agent Portal
            </span>
            <h1
              className="text-neutral-50 text-2xl md:text-3xl font-semibold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              List Your Property
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-0.5">
              Publish verified luxury and residential rentals across Abuja districts.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-rose-950/60 border border-rose-500/40 p-4 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Social Media / WhatsApp Fast Ingestion Section */}
        <div className="mb-8 bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl shadow-amber-400/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-neutral-950 text-lg font-bold shadow-md shadow-amber-400/20">
                ⚡
              </span>
              <div>
                <h3
                  className="text-neutral-100 font-medium text-sm md:text-base"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Quick Ingest from WhatsApp / Social Media
                </h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Paste landlord broadcasts, WhatsApp messages, or Instagram listings to auto-fill the form instantly.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSocialImport(!showSocialImport)}
              className="px-4 py-2 bg-neutral-950 border border-amber-400/50 text-amber-300 hover:text-amber-200 hover:bg-neutral-900 text-xs rounded-xl font-medium transition-all shrink-0"
            >
              {showSocialImport ? "Hide Paste Box" : "Paste Broadcast Text"}
            </button>
          </div>

          {showSocialImport && (
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <textarea
                value={socialText}
                onChange={(e) => setSocialText(e.target.value)}
                placeholder={`Paste your broadcast text here, e.g.:\nDIRECT BRIEF:\nNewly finished 2 bedroom flat in Jahi by Gilmore.\nRent: 4.5m\nService charge: 500k\nFeatures: POP ceiling, borehole, 24/7 security, fitted kitchen, parking.\nContact: 08052345678`}
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 text-neutral-100 text-xs rounded-xl p-3 focus:outline-none placeholder:text-neutral-600"
              />
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-neutral-500">
                  Extracts district, price, bedroom count, amenities, and contact info automatically.
                </p>
                <button
                  type="button"
                  disabled={importLoading || !socialText.trim()}
                  onClick={handleParseSocial}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-400/10 shrink-0"
                >
                  {importLoading ? "Parsing..." : "⚡ Auto-Fill Form from Text"}
                </button>
              </div>
              {importSuccess && (
                <div className="mt-3 p-3 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{importSuccess}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs md:text-sm">
            {["Basic Info", "Details & Location", "Photos", "Review & Publish"].map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${
                  i + 1 <= step ? "text-amber-400 font-medium" : "text-neutral-500"
                }`}
              >
                <div
                  className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-xl text-xs font-semibold ${
                    i + 1 <= step
                      ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden sm:inline">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-neutral-900 border border-neutral-800">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-300 shadow-sm shadow-amber-400/50"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 md:p-8 shadow-2xl"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2
                className="text-neutral-50 text-xl font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Basic Information
              </h2>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none placeholder:text-neutral-600"
                  placeholder="e.g., Luxury 3 Bedroom Apartment in Maitama"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Property Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: Number(e.target.value) })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none"
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
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none placeholder:text-neutral-600"
                  placeholder="Describe your property, its features, road access, and what makes it special..."
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2
                className="text-neutral-50 text-xl font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Property Details & Location
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Bedrooms *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bedrooms: e.target.value })
                      }
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-3 pl-10 pr-4 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Bathrooms *
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bathrooms: e.target.value })
                      }
                      className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-3 pl-10 pr-4 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Annual Rent (₦) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-semibold">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={formData.annual_rent}
                    onChange={(e) =>
                      setFormData({ ...formData, annual_rent: e.target.value })
                    }
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-3 pl-9 pr-4 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 4500000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  District (Abuja) *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none"
                  required
                >
                  <option value="">Select an Abuja district</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-3 pl-10 pr-4 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none placeholder:text-neutral-600"
                    placeholder="e.g., 14 Yedseram Street, Maitama, Abuja"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Virtual Tour 3D / Matterport URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.tour_url}
                  onChange={(e) =>
                    setFormData({ ...formData, tour_url: e.target.value })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-100 text-sm focus:border-amber-400 focus:outline-none placeholder:text-neutral-600"
                  placeholder="e.g., https://my.matterport.com/show/?m=..."
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="mb-3 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Select Available Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => {
                    const isSelected = formData.selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-amber-400 text-neutral-950 border-amber-400 font-semibold shadow-sm shadow-amber-400/20"
                            : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {amenity.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2
                className="text-neutral-50 text-xl font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Property Photographs
              </h2>

              <div>
                <label className="mb-3 block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Upload Photos (High Resolution)
                </label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950/80 text-rose-400 border border-rose-500/30 shadow-md backdrop-blur-sm hover:scale-105 transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-neutral-950">
                          Main Cover
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-800 bg-neutral-950/60 transition hover:border-amber-400/60 hover:bg-neutral-950">
                    <Upload className="h-7 w-7 text-amber-400/80" />
                    <span className="text-xs text-neutral-400 font-medium">Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  The first photo will serve as the primary card cover.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2
                className="text-neutral-50 text-xl font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Review & Submit Listing
              </h2>

              <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-5">
                <h3 className="font-semibold text-neutral-200 text-sm mb-4">
                  Listing Preview Summary
                </h3>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <dt className="text-neutral-400">Title</dt>
                    <dd className="font-medium text-neutral-100">{formData.title}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <dt className="text-neutral-400">Category</dt>
                    <dd className="font-medium text-neutral-100">
                      {categories.find((c) => c.id === Number(formData.category))?.name || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <dt className="text-neutral-400">Annual Rent</dt>
                    <dd className="font-semibold text-amber-400">
                      ₦{formData.annual_rent ? parseInt(formData.annual_rent).toLocaleString() : 0}/year
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <dt className="text-neutral-400">Rooms</dt>
                    <dd className="font-medium text-neutral-100">
                      {formData.bedrooms || 0} bed, {formData.bathrooms || 0} bath
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <dt className="text-neutral-400">Address</dt>
                    <dd className="font-medium text-neutral-100">{formData.address}</dd>
                  </div>
                  <div className="flex justify-between pt-1">
                    <dt className="text-neutral-400">Photos</dt>
                    <dd className="font-medium text-neutral-100">{images.length} attached</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-amber-950/30 border border-amber-500/30 p-4 text-xs text-amber-300">
                <Home className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <p>
                  To ensure quality and renter confidence, your listing will undergo rapid verification before appearing in live public searches.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-6">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="rounded-xl px-5 py-2 text-xs font-medium text-neutral-400 transition hover:text-neutral-100 hover:bg-neutral-800/50 disabled:opacity-30"
            >
              Back
            </button>

            <div>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-semibold text-neutral-950 transition hover:bg-amber-300 shadow-md shadow-amber-400/20"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-2.5 text-xs font-semibold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-50 shadow-lg shadow-amber-400/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Listing...
                    </>
                  ) : (
                    "Publish Property Listing"
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

