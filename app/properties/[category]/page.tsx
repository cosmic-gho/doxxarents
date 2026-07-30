import { notFound } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { fetchCategories, fetchDistrict, fetchDistricts, fetchProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import StickyMobileActionBar from "@/components/StickyMobileActionBar";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categories = await fetchCategories();
  const category = categories.find((c) => c.slug === params.category);
  if (!category) return {};
  return { title: `${category.name} in Abuja — DOXXARentals` };
}

const FILTERS = ["District", "Budget", "Bedrooms", "Bathrooms", "Parking", "Furnished", "Serviced", "Pet Friendly", "Verification"];

type PageProps = {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [categories, districts] = await Promise.all([
    fetchCategories(),
    fetchDistricts(),
  ]);
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const districtSlug =
    typeof searchParams?.district === "string" ? searchParams.district : undefined;

  const properties = await fetchProperties({
    categorySlug: category.slug,
    districtSlug,
    pageSize: 12,
  });

  const filterDistrict = districtSlug ? await fetchDistrict(districtSlug) : undefined;

  return (
    <>
      <section className="border-b border-stone-200 bg-stone-100">
        <div className="container-page py-14 md:py-20">
          <p className="text-sm font-medium text-gold-dark">
            {districts.length} districts across Abuja
            {filterDistrict ? ` · ${filterDistrict.name}` : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{category.name}</h1>
          <p className="mt-3 max-w-xl text-stone-600">{category.description}</p>
          {properties.length > 0 && (
            <p className="mt-4 text-sm text-stone-500">{properties.length} listings found</p>
          )}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-6">
          <span className="flex items-center gap-1 text-sm font-medium text-stone-500">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              className="rounded-full border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:border-ink hover:text-ink"
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-sm text-stone-400">Sort: Newest</span>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
          {properties.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-12 text-center">
              <p className="font-medium text-ink">No {category.name.toLowerCase()} listings yet.</p>
              <p className="mt-2 text-sm text-stone-500">
                {filterDistrict
                  ? `Try expanding your search to all of Abuja, or pick a different property type.`
                  : `Check back soon — new listings are added daily.`}
              </p>
            </div>
          )}
        </div>
      </section>

      <StickyMobileActionBar />
    </>
  );
}
