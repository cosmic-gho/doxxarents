"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./SharedUI";
import { useApp } from "./providers/AppProvider";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { saved, compareIds, searchQuery, setSearchQuery } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm px-1 pb-1 border-b-2 transition-colors ${
          isActive
            ? "border-amber-400 text-neutral-100 font-medium"
            : "border-transparent text-neutral-400 hover:text-neutral-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={28} />
        </Link>
        <div className="hidden md:flex items-center gap-5">
          <NavItem href="/" label="Home" />
          <NavItem href="/search" label="Search" />
          <NavItem href="/about" label="About" />
          <NavItem href="/saved" label={`Saved (${saved.length})`} />
          <NavItem href="/compare" label={`Compare (${compareIds.length})`} />
        </div>
        <div className="flex-1 flex justify-end items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/search");
            }}
            className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden max-w-xs w-full"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district or type"
              className="bg-transparent text-sm text-neutral-200 placeholder-neutral-500 px-3 py-2 flex-1 outline-none"
            />
            <button type="submit" className="px-3 text-neutral-400 hover:text-amber-400" aria-label="Search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </form>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === "AGENT" && (
                <Link
                  href="/dashboard"
                  className="shrink-0 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3 py-2 whitespace-nowrap transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className="shrink-0 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 rounded-lg px-3 py-2 whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {user?.username || "Account"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="shrink-0 text-xs font-medium text-neutral-400 hover:text-rose-400 px-2 py-2 whitespace-nowrap transition-colors"
                title="Sign out"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="shrink-0 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg px-3.5 py-2 whitespace-nowrap transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="shrink-0 text-xs font-medium text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg px-3.5 py-2 whitespace-nowrap transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-neutral-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950/98 px-5 py-4 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              router.push("/search");
            }}
            className="flex sm:hidden items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden w-full mb-3"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district or type"
              className="bg-transparent text-sm text-neutral-200 placeholder-neutral-500 px-3 py-2 flex-1 outline-none"
            />
            <button type="submit" className="px-3 text-neutral-400 hover:text-amber-400" aria-label="Search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </form>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1.5 transition-colors ${
                pathname === "/" ? "text-amber-400 font-medium" : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Home
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1.5 transition-colors ${
                pathname === "/search" ? "text-amber-400 font-medium" : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Search
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1.5 transition-colors ${
                pathname === "/about" ? "text-amber-400 font-medium" : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              About
            </Link>
            <Link
              href="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1.5 transition-colors ${
                pathname === "/saved" ? "text-amber-400 font-medium" : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Saved ({saved.length})
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm py-1.5 transition-colors ${
                pathname === "/compare" ? "text-amber-400 font-medium" : "text-neutral-300 hover:text-neutral-100"
              }`}
            >
              Compare ({compareIds.length})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
