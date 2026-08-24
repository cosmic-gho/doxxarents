import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car } from "lucide-react";
import TrustBadge, { StatusPill } from "./TrustBadge";
import { Property, formatPrice } from "@/lib/properties";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/p/${property.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusPill status={property.status} />
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {property.badges.map((b) => (
            <TrustBadge key={b} type={b} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-ink">{property.title}</h3>
        </div>
        <p className="mt-1 text-sm text-stone-500">{property.district.name}, Abuja</p>
        <p className="mt-2 font-display text-lg text-ink">{formatPrice(property.price)}</p>

        <div className="mt-3 flex items-center gap-4 border-t border-stone-100 pt-3 text-sm text-stone-500">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Car className="h-4 w-4" /> {property.parking}
          </span>
        </div>
      </div>
    </Link>
  );
}
