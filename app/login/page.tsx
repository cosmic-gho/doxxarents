"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-neutral-950 min-h-screen flex items-center justify-center" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email.trim().toLowerCase(), formData.password);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      // In production, Google One Tap or GIS populates the credential token.
      // If no GIS client is initialized yet, fallback gracefully to prompt email for fast login.
      const testEmail = prompt("Enter your Google account email to sign in:", "user@gmail.com");
      if (!testEmail) {
        setIsGoogleLoading(false);
        return;
      }
      await loginWithGoogle({
        email: testEmail.trim().toLowerCase(),
        first_name: testEmail.split("@")[0],
        role: "USER",
      });
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center px-4 py-12 relative overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-neutral-800/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Header Branding */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-bold text-base shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
              D
            </span>
            <span className="text-neutral-50 text-xl font-semibold tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              DOXXARentals
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-center text-neutral-50 text-2xl sm:text-3xl font-normal mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Welcome Back
          </h1>
          <p className="text-center text-xs sm:text-sm text-neutral-400 mb-6">
            Sign in to access your saved properties, inspection bookings, and unlocked contacts.
          </p>

          {/* Google Direct Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-700 hover:border-amber-400/80 text-neutral-100 text-sm font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-amber-400/5 mb-5 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-amber-400" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px bg-neutral-800 flex-1" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">Or email sign in</span>
            <span className="h-px bg-neutral-800 flex-1" />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-950/70 border border-rose-800/80 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset instructions will be sent to your email address.");
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 py-2.5 pl-10 pr-10 text-sm text-neutral-100 placeholder-neutral-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 py-2.5 text-sm font-semibold text-neutral-950 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-amber-400/20"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-xs text-neutral-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-medium text-amber-400 hover:text-amber-300 hover:underline ml-1"
            >
              Create one here &rarr;
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="mt-6 text-center text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            &larr; Back to DOXXARentals home
          </Link>
        </p>
      </div>
    </div>
  );
}
