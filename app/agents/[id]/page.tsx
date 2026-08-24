import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAgentProfile, fetchProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import TrustBadge from "@/components/TrustBadge";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AgentProfilePage({ params }: { params: { id: string } }) {
  const agent = await fetchAgentProfile(params.id);

  if (!agent) {
    notFound();
  }

  const properties = await fetchProperties({
    agentId: Number(params.id),
    moderationStatus: "APPROVED",
    pageSize: 20,
  });

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container-page py-3">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            All agents
          </Link>
        </div>
      </div>

      <section className="bg-stone-50 border-b border-stone-200">
        <div className="container-page py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm bg-stone-200">
              {agent.profile_picture ? (
                <Image
                  src={agent.profile_picture}
                  alt={agent.username}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-stone-400 text-4xl uppercase">
                  {agent.username.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-4xl text-ink">{agent.username}</h1>
                <TrustBadge type="verified-agent" />
                {agent.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Agent
                  </span>
                )}
              </div>
              <p className="mt-2 text-stone-600 max-w-xl">
                Real Estate Agent specializing in premium residential and commercial properties across Abuja.
                Dedicated to finding the perfect match for every client.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Abuja, Nigeria
                </span>
                {agent.email && (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {agent.email}
                  </span>
                )}
                {agent.phone_number && (
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {agent.phone_number}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto mt-6 md:mt-0">
              {agent.phone_number && (
                <a
                  href={`tel:${agent.phone_number}`}
                  className="w-full text-center rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  Call Agent
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="w-full text-center rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
                >
                  Email Agent
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex items-center justify-between border-b border-stone-200 pb-6">
          <h2 className="text-xl font-medium text-ink">
            Active Listings ({properties.length})
          </h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
          {properties.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-stone-300 p-12 text-center">
              <p className="font-medium text-ink">No active listings.</p>
              <p className="mt-2 text-sm text-stone-500">
                This agent currently has no approved properties on the market.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

