import DistrictCard from "@/components/DistrictCard";
import { fetchDistricts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = { title: "All Districts — DOXXARentals" };

export default async function DistrictsIndexPage() {
  const districts = await fetchDistricts();

  return (
    <section className="container-page py-16 md:py-24">
      <p className="text-sm font-medium text-gold-dark">Abuja, Nigeria</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">All districts</h1>
      <p className="mt-4 max-w-xl text-stone-600">
        {districts.length} districts across Abuja, each with its own rent
        benchmarks, lifestyle, and listings.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {districts.map((d) => (
          <DistrictCard key={d.slug} district={d} />
        ))}
      </div>
    </section>
  );
}
