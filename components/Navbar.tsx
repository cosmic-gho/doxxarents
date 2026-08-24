"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Heart, User, Plus, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "/districts", label: "Districts" },
  { href: "/search", label: "Browse Properties" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-stone-600 transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-lg font-bold text-stone-400 hover:bg-stone-200 transition"
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-stone-100 px-4 py-2">
                    <p className="font-medium text-ink">{user?.username}</p>
                    <p className="truncate text-xs text-stone-500">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    {user?.role === "AGENT" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-ink"
                      >
                        Agent Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-ink"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/saved"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-ink"
                    >
                      <Heart className="mr-3 h-4 w-4" />
                      Saved Properties
                    </Link>
                  </div>

                  <div className="border-t border-stone-100 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-600 transition hover:text-ink px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/properties/new"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-stone-800"
              >
                List a Property
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="mt-4 border-t border-stone-200 pt-4 pb-2">
                  <p className="px-3 text-xs font-medium uppercase text-stone-500">Account</p>
                </div>
                {user?.role === "AGENT" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Agent Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/saved"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
                >
                  Saved Properties
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/properties/new"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-paper"
                >
                  List a Property
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
