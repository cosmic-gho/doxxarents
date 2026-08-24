"use client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — DOXXARentals",
  description: "Join DOXXARentals as a renter or agent. Create your account to start browsing verified listings or list your properties in Abuja, Nigeria.",
};



import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Building2, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password2: "",
    role: "USER" as "USER" | "AGENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        password: formData.password,
        password2: formData.password2,
        role: formData.role,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container-page flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink">
                <span className="font-display text-lg font-bold text-gold">D</span>
              </div>
              <span className="font-display text-xl text-ink">DOXXA</span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <h1 className="text-center font-display text-2xl text-ink">
              Create Your Account
            </h1>
            <p className="mt-2 text-center text-sm text-stone-500">
              Join DOXXARentals to find your perfect home
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Account Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "USER" })}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${formData.role === "USER"
                      ? "border-ink bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                    }`}
                >
                  <UserCircle className="h-6 w-6 text-stone-600" />
                  <span className="text-sm font-medium text-stone-700">Renter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "AGENT" })}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition ${formData.role === "AGENT"
                      ? "border-ink bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                    }`}
                >
                  <Building2 className="h-6 w-6 text-stone-600" />
                  <span className="text-sm font-medium text-stone-700">Agent</span>
                </button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="johndoe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-4 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-10 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword2 ? "text" : "password"}
                    value={formData.password2}
                    onChange={(e) =>
                      setFormData({ ...formData, password2: e.target.value })
                    }
                    className="w-full rounded-lg border border-stone-200 py-2.5 pl-10 pr-10 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword2 ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-stone-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-gold-dark hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <p className="mt-6 text-center text-sm text-stone-500">
            <Link href="/" className="hover:text-ink">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
