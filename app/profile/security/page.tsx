"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { Loader2, Check } from "lucide-react";

export default function SecurityPage() {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/auth/change-password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        // Handle specific field errors from Django
        if (data.old_password) {
          throw new Error(`Old Password: ${data.old_password[0]}`);
        } else if (data.new_password) {
          throw new Error(`New Password: ${data.new_password[0]}`);
        }

        throw new Error(data.detail || "Failed to update password");
      }

      setSuccess(true);
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-ink">Security</h1>
        <p className="mt-1 text-stone-500">Manage your password and security preferences.</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 md:p-8">
        <h2 className="text-lg font-medium text-ink mb-6">Change Password</h2>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Password changed successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Current Password
            </label>
            <input
              type="password"
              value={formData.old_password}
              onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              New Password
            </label>
            <input
              type="password"
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
              minLength={8}
            />
            <p className="mt-2 text-xs text-stone-500">Must be at least 8 characters long.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
              required
              minLength={8}
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
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
