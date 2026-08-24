import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, MapPin, Search, ArrowRight } from "lucide-react";
import { fetchDistricts, fetchCategories, featuredDistrictSlugs } from "@/lib/api";
import DistrictCard from "@/components/DistrictCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [districts, categories] = await Promise.all([
    fetchDistricts(),
    fetchCategories(),
  ]);
  const featured = districts.filter((d) => featuredDistrictSlugs.includes(d.slug));
  const displayCategories = categories.slice(0, 12);

  return (
    <>
      <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/districts/asokoro.jpg"
          alt="Aerial view of Asokoro, Abuja"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <div className="container-page relative z-10 pb-16 pt-32 text-paper md:pb-24">
          <p className="nameplate-divider text-xs text-gold-light">
            <span>Abuja, Nigeria</span>
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-4xl leading-tight md:text-6xl">
            Find your next home, without the stress.
          </h1>
          <p className="mt-5 max-w-xl text-base text-stone-300 md:text-lg">
            DOXXARentals brings verified listings, verified agents, and every
            district in Abuja onto one trustworthy platform — built for
            renters, buyers, agents, and landlords alike.
          </p>

          <div className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-card backdrop-blur md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-3">
              <MapPin className="h-5 w-5 text-stone-400" />
              <span className="text-sm text-stone-500">Any district — Maitama, Wuse II, Gwarinpa…</span>
            </div>
            <div className="hidden h-8 w-px bg-stone-200 md:block" />
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-3">
              <Search className="h-5 w-5 text-stone-400" />
              <span className="text-sm text-stone-500">Any property type</span>
            </div>
            <Link
              href="/search"
              className="rounded-xl bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition hover:bg-stone-800"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-10 text-sm text-stone-600 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-dark" /> Verified listings
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-dark" /> Verified agents
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-dark" /> {districts.length} Abuja districts
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-dark" /> Book inspections online
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-gold-dark">Explore Abuja</p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Featured districts</h2>
          </div>
          <Link href="/districts" className="hidden items-center gap-1 text-sm font-medium text-ink md:flex">
            View all {districts.length} districts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {(featured.length > 0 ? featured : districts.slice(0, 6)).map((d) => (
            <DistrictCard key={d.slug} district={d} />
          ))}
        </div>

        <Link href="/districts" className="mt-6 flex items-center gap-1 text-sm font-medium text-ink md:hidden">
          View all {districts.length} districts <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="bg-stone-100 py-20">
        <div className="container-page">
          <p className="text-sm font-medium text-gold-dark">Every kind of home</p>
          <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Browse by property type</h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {displayCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/properties/${c.slug}`}
                className="rounded-xl border border-stone-200 bg-white px-4 py-4 text-center text-sm font-medium text-stone-700 shadow-card transition hover:border-ink hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <h2 className="font-display text-3xl text-ink md:text-4xl">Renting, simplified</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            { step: "01", title: "Search by district", body: "Filter by district, budget, bedrooms, and more to find homes that actually match your life in Abuja." },
            { step: "02", title: "Book an inspection", body: "Choose a date, time, and contact method. No back-and-forth phone tag required." },
            { step: "03", title: "Move in with confidence", body: "Verified agents and Doxxa Verified listings mean fewer surprises on move-in day." },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-stone-200 p-8">
              <p className="font-display text-sm text-gold-dark">{s.step}</p>
              <h3 className="mt-3 text-lg font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
