"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./SharedUI";

export default function Footer() {
  return (
    <div className="border-t border-neutral-900 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size={22} />
        <div className="flex items-center gap-5 text-neutral-500 text-xs">
          <Link href="/about" className="hover:text-neutral-300">About us</Link>
          <Link href="/register" className="hover:text-neutral-300">Sign up</Link>
          <span>Nigeria &middot;</span>
        </div>
      </div>
    </div>
  );
}
