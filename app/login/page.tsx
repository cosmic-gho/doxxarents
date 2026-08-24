"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="container-page flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
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
              Welcome Back
            </h1>
            <p className="mt-2 text-center text-sm text-stone-500">
              Sign in to access your saved properties and bookings
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Email Address
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

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">
                  Password
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
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-300 text-ink focus:ring-ink"
                  />
                  <span className="text-stone-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-gold-dark hover:underline"
                >
                  Forgot password?
                </a>
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
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-stone-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-gold-dark hover:underline"
              >
                Create one
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
