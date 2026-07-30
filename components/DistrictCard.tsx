import Image from "next/image";
import Link from "next/link";
import { District } from "@/lib/districts";

export default function DistrictCard({ district }: { district: District }) {
  return (
    <Link
      href={`/districts/${district.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink"
    >
      <Image
        src={district.image}
        alt={`${district.name}, Abuja`}
        fill
        className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
        <p className="nameplate text-xl">{district.name}</p>
        <p className="mt-1 text-xs text-stone-300">{district.avgRent}</p>
      </div>
    </Link>
  );
}
