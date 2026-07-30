import Link from "next/link";
import Logo from "./Logo";
import { featuredDistrictSlugs, districts } from "@/lib/districts";
import { categories } from "@/lib/categories";

export default function Footer() {
  const topDistricts = districts.filter((d) => featuredDistrictSlugs.includes(d.slug));
  const topCategories = categories.slice(0, 6);

  return (
    <footer className="border-t border-stone-200 bg-ink text-stone-200">
      <div className="container-page grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo className="brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm text-stone-400">
            Find your next home without the stress. A technology-driven rental
            platform built for Abuja, Nigeria.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-paper">Districts</h4>
          <ul className="mt-4 space-y-2">
            {topDistricts.map((d) => (
              <li key={d.slug}>
                <Link href={`/districts/${d.slug}`} className="text-sm text-stone-400 hover:text-paper">
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/districts" className="text-sm text-gold-light hover:text-gold">
                View all districts →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-paper">Property Types</h4>
          <ul className="mt-4 space-y-2">
            {topCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/properties/${c.slug}`} className="text-sm text-stone-400 hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-paper">Company</h4>
          <ul className="mt-4 space-y-2">
            <li><Link href="/about" className="text-sm text-stone-400 hover:text-paper">About Us</Link></li>
            <li><Link href="/agents" className="text-sm text-stone-400 hover:text-paper">Find an Agent</Link></li>
            <li><Link href="/list-your-property" className="text-sm text-stone-400 hover:text-paper">List a Property</Link></li>
            <li><Link href="/contact" className="text-sm text-stone-400 hover:text-paper">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-stone-500 md:flex-row">
          <span>© {new Date().getFullYear()} DOXXARentals. All rights reserved.</span>
          <span>Abuja, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
