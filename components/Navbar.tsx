"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import Logo from "./Logo";

const LINKS = [
  { href: "/districts", label: "Districts" },
  { href: "/properties/2-bedroom", label: "Browse Properties" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
          <Link
            href="/properties/2-bedroom"
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-ink hover:text-ink"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            href="/list-your-property"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-stone-800"
          >
            List a Property
          </Link>
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
            <Link
              href="/list-your-property"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-paper"
            >
              List a Property
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
