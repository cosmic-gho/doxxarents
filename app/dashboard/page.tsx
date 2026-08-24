"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import { Building2, Eye, ClipboardList } from "lucide-react";
import Link from "next/link";

interface Analytics {
  total_properties: number;
  active_properties: number;
  total_views: number;
  total_inspection_requests: number;
}

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/analytics/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <ProtectedRoute requireAgent>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display text-ink">Welcome back, {user?.first_name || user?.username}</h1>
            <p className="mt-1 text-stone-500">Here's what's happening with your properties today.</p>
          </div>
          <Link
            href="/properties/new"
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-light"
          >
            List New Property
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-stone-200 bg-white p-6 h-32"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-ink">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">Total Properties</p>
                  <p className="text-2xl font-display text-ink">{analytics?.total_properties || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">Active Listings</p>
                  <p className="text-2xl font-display text-ink">{analytics?.active_properties || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">Total Views</p>
                  <p className="text-2xl font-display text-ink">{analytics?.total_views || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-light text-gold-dark">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">Inspections</p>
                  <p className="text-2xl font-display text-ink">{analytics?.total_inspection_requests || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 rounded-xl border border-stone-200 bg-white">
          <div className="border-b border-stone-200 p-6">
            <h2 className="text-lg font-medium text-ink">Recent Activity</h2>
          </div>
          <div className="p-12 text-center">
            <p className="text-stone-500">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
