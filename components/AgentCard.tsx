import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Building2 } from "lucide-react";
import type { BackendAgent } from "@/lib/api";

export default function AgentCard({ agent }: { agent: BackendAgent }) {
    return (
        <Link
            href={`/agents/${agent.id}`}
            className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            {/* Avatar */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-stone-100 bg-stone-100 shadow-sm">
                {agent.profile_picture ? (
                    <Image
                        src={agent.profile_picture}
                        alt={agent.username}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-200 text-2xl font-medium uppercase text-stone-500">
                        {agent.username.charAt(0)}
                    </div>
                )}
            </div>

            {/* Name + verified */}
            <div className="mt-4 flex items-center gap-1.5">
                <span className="font-medium text-ink">{agent.username}</span>
                {agent.is_verified && (
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                )}
            </div>

            {/* Listing count */}
            <div className="mt-2 flex items-center gap-1 text-sm text-stone-500">
                <Building2 className="h-4 w-4" />
                <span>{agent.active_listings_count ?? 0} active listing{(agent.active_listings_count ?? 0) !== 1 ? "s" : ""}</span>
            </div>

            {/* CTA */}
            <span className="mt-5 w-full rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-ink transition group-hover:border-ink group-hover:bg-stone-50">
                View Profile
            </span>
        </Link>
    );
}
