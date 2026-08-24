"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { fetchProperties, Property } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Plus, Building2, Pencil, Trash2, Eye } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function DashboardProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.id) {
        try {
          const data = await fetchProperties({ agentId: user.id, pageSize: 50 });
          setProperties(data);
        } catch (err) {
          console.error("Failed to fetch agent properties", err);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [user?.id]);



  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        alert("Failed to delete property.");
      }
    } catch {
      alert("Failed to delete property.");
    }
  };

  return (
    <ProtectedRoute requireAgent>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display text-ink">My Listings</h1>
            <p className="mt-1 text-stone-500">Manage your active and pending properties.</p>
          </div>
          <Link
            href="/properties/new"
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-500">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-50 mb-4">
                <Building2 className="h-8 w-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-ink">No properties yet</h3>
              <p className="mt-1 text-stone-500 max-w-sm mx-auto">
                Get started by adding your first property to the DOXXARentals platform.
              </p>
              <Link
                href="/properties/new"
                className="mt-6 inline-flex rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                List New Property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-medium text-stone-500">Property</th>
                    <th className="px-6 py-4 font-medium text-stone-500">Price</th>
                    <th className="px-6 py-4 font-medium text-stone-500">Status</th>
                    <th className="px-6 py-4 font-medium text-stone-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 relative">
                            <Image src={p.image} alt={p.title} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-ink line-clamp-1">{p.title}</div>
                            <div className="text-stone-500 flex items-center gap-1 mt-1 text-xs">
                              <MapPin className="h-3 w-3" /> {p.district.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-ink">₦{p.price.toLocaleString()}</span>
                        <span className="text-stone-500 text-xs">/yr</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize
                          ${p.status === 'available' ? 'bg-green-100 text-green-700' :
                            p.status === 'under-review' ? 'bg-red-100 text-red-700' :
                              p.status === 'pending-verification' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-stone-100 text-stone-700'}`}>
                          {p.status.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/properties/p/${p.id}`}
                            title="View Listing"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 transition"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </Link>
                          <Link
                            href={`/dashboard/properties/${p.id}/edit`}
                            title="Edit Property"
                            className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 transition"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Delete Property"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
