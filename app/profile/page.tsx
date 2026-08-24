"use client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings — DOXXARentals",
  description: "Manage your DOXXARentals account details, contact information and preferences.",
};



import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { API_BASE } from "@/lib/api";
import { Loader2, Check } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/auth/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload(); // Reload to refresh auth context
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-ink">Personal Info</h1>
        <p className="mt-1 text-stone-500">Update your account details here.</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-ink px-8 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
