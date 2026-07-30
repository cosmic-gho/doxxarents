import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, GraduationCap, HeartPulse, ShoppingBag, UtensilsCrossed, ArrowRight } from "lucide-react";
import { fetchDistrict, fetchDistricts, fetchCategories, fetchProperties, getAgentsForDistrict, getNearby } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import DistrictCard from "@/components/DistrictCard";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const districts = await fetchDistricts();
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const district = await fetchDistrict(params.slug);
  if (!district) return {};
  return { title: `${district.name}, Abuja — DOXXARentals` };
}

export default async function DistrictPage({ params }: { params: { slug: string } }) {
  const [district, districts, categories] = await Promise.all([
    fetchDistrict(params.slug),
    fetchDistricts(),
    fetchCategories(),
  ]);
  if (!district) notFound();

  const properties = await fetchProperties({ districtSlug: district.slug, pageSize: 6 });
  const featured = properties.slice(0, 3);
  const agents = getAgentsForDistrict(district.slug, 3);
  const nearby = getNearby(district);
  const similar = districts.filter((d) => d.slug !== district.slug).slice(0, 4);

  return (
    <>
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-ink">
        <Image
          src={district.image}
          alt={`${district.name}, Abuja`}
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        <div className="container-page relative z-10 pb-12 text-paper">
          <p className="nameplate-divider text-xs text-gold-light">
            <span>Abuja, Nigeria</span>
          </p>
          <h1 className="nameplate mt-4 text-5xl md:text-7xl">{district.name}</h1>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 md:grid-cols-3 md:py-20">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl text-ink">District overview</h2>
          <p className="mt-4 leading-relaxed text-stone-600">{district.lifestyle}.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {district.popularTypes.map((t) => (
              <span key={t} className="rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-600">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <p className="text-sm font-medium text-gold-dark">Average rent</p>
          <p className="mt-2 font-display text-2xl text-ink">{district.avgRent}</p>
          <div className="mt-6 border-t border-stone-200 pt-4">
            <p className="text-sm font-medium text-stone-700">Landmarks</p>
            <ul className="mt-2 space-y-1 text-sm text-stone-500">
              {district.landmarks.map((l) => (
                <li key={l} className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> {l}
                </li>
              ))}
              {district.landmarks.length === 0 && (
                <li className="text-stone-400">Landmarks coming soon.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Featured properties in {district.name}</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length > 0 ? featured : properties).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
            {featured.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-400">
                No featured listings yet — check back soon, or browse all available listings below.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <h2 className="font-display text-2xl text-ink md:text-3xl">Available listings</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
          {properties.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-400">
              No listings in {district.name} right now. Check nearby districts or set an alert in the future.
            </div>
          )}
        </div>
      </section>

      <section className="bg-stone-100 py-16 md:py-20">
        <div className="container-page">
          <h2 className="font-display text-2xl text-ink md:text-3xl">Browse by property type in {district.name}</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                href={`/properties/${c.slug}?district=${district.slug}`}
                className="rounded-xl border border-stone-200 bg-white px-4 py-4 text-center text-sm font-medium text-stone-700 shadow-card transition hover:border-ink hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <h2 className="font-display text-2xl text-ink md:text-3xl">Featured agents in {district.name}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.slug} className="rounded-2xl border border-stone-200 p-6">
              <div className="h-12 w-12 rounded-full bg-stone-200" aria-hidden />
              <p className="mt-4 font-medium text-ink">{a.name}</p>
              <p className="text-sm text-stone-500">{a.specialty}</p>
              <p className="mt-3 text-sm text-stone-400">{a.listings} listings</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-100 py-16 md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, title: "Nearby Schools", items: nearby.schools },
            { icon: HeartPulse, title: "Nearby Hospitals", items: nearby.hospitals },
            { icon: ShoppingBag, title: "Nearby Shopping", items: nearby.shopping },
            { icon: UtensilsCrossed, title: "Nearby Restaurants", items: nearby.restaurants },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title}>
              <h3 className="flex items-center gap-2 font-medium text-ink">
                <Icon className="h-4 w-4 text-gold-dark" /> {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((it) => (
                  <li key={it.name} className="flex items-center justify-between text-sm text-stone-600">
                    <span>{it.name}</span>
                    <span className="text-stone-400">{it.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <h2 className="font-display text-2xl text-ink md:text-3xl">{district.name} on the map</h2>
        <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-400">
          Interactive map coming soon — plug in your maps provider of choice here.
        </div>
      </section>

      <section className="bg-stone-100 py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Similar districts</h2>
            <Link href="/districts" className="hidden items-center gap-1 text-sm font-medium text-ink md:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((d) => (
              <DistrictCard key={d.slug} district={d} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
