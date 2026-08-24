"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Loader2, Check, X, Upload, Bed, Bath, MapPin,
} from "lucide-react";
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/api";

interface PropertyCategory { id: number; slug: string; name: string; icon: string; }
interface Amenity { id: number; name: string; }
interface District { id: number; name: string; slug: string; }

export default function EditPropertyPage() {
    return (
        <ProtectedRoute requireAgent>
            <EditPropertyForm />
        </ProtectedRoute>
    );
}

function EditPropertyForm() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [categories, setCategories] = useState<PropertyCategory[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);

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

    // New images to upload
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    // Existing images from the server
    const [existingImages, setExistingImages] = useState<{ id: number; image: string | null; is_primary: boolean }[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        // Fetch dropdown options
        fetch(`${API_BASE}/api/categories/`).then(r => r.json()).then(setCategories).catch(() => { });
        fetch(`${API_BASE}/api/amenities/`).then(r => r.json()).then(d => setAmenities(d.results ?? d)).catch(() => { });
        fetch(`${API_BASE}/api/districts/`).then(r => r.json()).then(d => setDistricts(Array.isArray(d) ? d : d.results ?? [])).catch(() => { });

        // Load existing property data
        fetch(`${API_BASE}/api/properties/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
            .then(data => {
                setFormData({
                    title: data.title ?? "",
                    description: data.description ?? "",
                    annual_rent: String(data.annual_rent ?? ""),
                    category: data.category ?? "",
                    bedrooms: String(data.bedrooms ?? ""),
                    bathrooms: String(data.bathrooms ?? ""),
                    address: data.address ?? "",
                    district: data.district ? String(data.district) : "",
                    latitude: data.latitude ? String(data.latitude) : "",
                    longitude: data.longitude ? String(data.longitude) : "",
                    tour_url: data.tour_url ?? "",
                    selectedAmenities: (data.amenities_details ?? []).map((a: Amenity) => a.id),
                });
                setExistingImages(data.images ?? []);
            })
            .catch(() => setError("Failed to load property."))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const arr = Array.from(files);
        setNewImages(prev => [...prev, ...arr]);
        arr.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setNewImagePreviews(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const removeNewImage = (idx: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== idx));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = async (imgId: number) => {
        const token = localStorage.getItem("access_token");
        try {
            // There's no dedicated delete endpoint; we'll just hide it client-side for now
            // and update the UI
            setExistingImages(prev => prev.filter(img => img.id !== imgId));
        } catch {
            // Silently ignore
        }
    };

    const toggleAmenity = (amenityId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedAmenities: prev.selectedAmenities.includes(amenityId)
                ? prev.selectedAmenities.filter(a => a !== amenityId)
                : [...prev.selectedAmenities, amenityId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        const token = localStorage.getItem("access_token");

        try {
            // 1. PATCH the property fields
            const res = await fetch(`${API_BASE}/api/properties/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    annual_rent: parseFloat(formData.annual_rent),
                    category: Number(formData.category),
                    bedrooms: parseInt(formData.bedrooms),
                    bathrooms: parseInt(formData.bathrooms),
                    address: formData.address,
                    district: formData.district ? parseInt(formData.district) : null,
                    latitude: formData.latitude || null,
                    longitude: formData.longitude || null,
                    tour_url: formData.tour_url || "",
                    amenities: formData.selectedAmenities,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(JSON.stringify(err));
            }

            // 2. Upload any new images
            for (let i = 0; i < newImages.length; i++) {
                const fd = new FormData();
                fd.append("image", newImages[i]);
                fd.append("is_primary", existingImages.length === 0 && i === 0 ? "true" : "false");
                await fetch(`${API_BASE}/api/properties/${id}/images/`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
            }

            setSuccess(true);
            setTimeout(() => router.push("/dashboard/properties"), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update property");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
                <p>{error}</p>
                <Link href="/dashboard/properties" className="mt-4 inline-block text-sm text-ink underline">
                    Back to listings
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/dashboard/properties"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm border border-stone-200"
                >
                    <ArrowLeft className="h-5 w-5 text-stone-600" />
                </Link>
                <div>
                    <h1 className="font-display text-2xl text-ink">Edit Property</h1>
                    <p className="text-sm text-stone-500">Update your listing details below</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
                    <Check className="h-5 w-5" />
                    <span>Property updated successfully! Redirecting…</span>
                </div>
            )}
            {error && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-stone-200">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="font-display text-lg text-ink border-b border-stone-100 pb-3">Basic Information</h2>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Property Category *</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: Number(e.target.value) })}
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                            required
                        >
                            <option value="">Select category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                            required
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h2 className="font-display text-lg text-ink border-b border-stone-100 pb-3">Property Details</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-stone-700">Bedrooms *</label>
                            <div className="relative">
                                <Bed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                                <input type="number" value={formData.bedrooms} min="0" required
                                    onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink" />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-stone-700">Bathrooms *</label>
                            <div className="relative">
                                <Bath className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                                <input type="number" value={formData.bathrooms} min="0" required
                                    onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Annual Rent (₦) *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">₦</span>
                            <input type="number" value={formData.annual_rent} min="0" required
                                onChange={e => setFormData({ ...formData, annual_rent: e.target.value })}
                                className="w-full rounded-lg border border-stone-200 py-2.5 pl-8 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">District</label>
                        <select
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                        >
                            <option value="">Select a district</option>
                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Address *</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                            <input type="text" value={formData.address} required
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                                placeholder="e.g., 123 Maitama Street, Abuja" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-stone-700">Latitude</label>
                            <input type="number" step="any" value={formData.latitude}
                                onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink" placeholder="e.g., 9.0765" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-stone-700">Longitude</label>
                            <input type="number" step="any" value={formData.longitude}
                                onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                                className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink" placeholder="e.g., 7.3986" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">Virtual Tour URL (Optional)</label>
                        <input type="url" value={formData.tour_url}
                            onChange={e => setFormData({ ...formData, tour_url: e.target.value })}
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                            placeholder="https://example.com/tour.glb" />
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <h2 className="font-display text-lg text-ink border-b border-stone-100 pb-3 mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map(a => (
                            <button
                                key={a.id} type="button" onClick={() => toggleAmenity(a.id)}
                                className={`rounded-full px-4 py-2 text-sm transition ${formData.selectedAmenities.includes(a.id) ? "bg-ink text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"}`}
                            >
                                {formData.selectedAmenities.includes(a.id) && <Check className="mr-1 inline h-3 w-3" />}
                                {a.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Photos */}
                <div>
                    <h2 className="font-display text-lg text-ink border-b border-stone-100 pb-3 mb-4">Photos</h2>

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-2 text-sm text-stone-500">Current photos</p>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                {existingImages.map((img, idx) => (
                                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                                        {img.image && (
                                            <img src={img.image} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                                        )}
                                        {img.is_primary && (
                                            <span className="absolute left-1 top-1 rounded-full bg-ink px-2 py-0.5 text-xs text-white">Primary</span>
                                        )}
                                        <button
                                            type="button" onClick={() => removeExistingImage(img.id)}
                                            className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New image uploads */}
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {newImagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                                <img src={preview} alt={`New ${idx + 1}`} className="h-full w-full object-cover" />
                                <button type="button" onClick={() => removeNewImage(idx)}
                                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 transition hover:border-ink hover:bg-stone-100">
                            <Upload className="h-6 w-6 text-stone-400" />
                            <span className="text-xs text-stone-500">Add Photos</span>
                            <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-6">
                    <Link href="/dashboard/properties" className="rounded-lg px-4 py-2 text-stone-600 hover:bg-stone-100">
                        Cancel
                    </Link>
                    <button
                        type="submit" disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-lg bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
                    >
                        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
