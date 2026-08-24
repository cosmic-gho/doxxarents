import { fetchAgents } from "@/lib/api";
import AgentCard from "@/components/AgentCard";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Our Agents | DOXXARentals",
    description: "Browse our verified real estate agents in Abuja.",
};

export default async function AgentsPage() {
    const agents = await fetchAgents();

    return (
        <>
            {/* Header */}
            <section className="bg-stone-50 border-b border-stone-200">
                <div className="container-page py-12 md:py-16">
                    <p className="text-sm font-medium text-gold-dark">Our Team</p>
                    <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
                        Meet our agents
                    </h1>
                    <p className="mt-4 max-w-xl text-stone-600">
                        Every agent on DOXXARentals is vetted and accountable. Browse their
                        active listings and get in touch directly.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <section className="container-page py-12">
                {agents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 text-center">
                        <Users className="h-10 w-10 text-stone-300" />
                        <p className="mt-4 font-medium text-ink">No agents yet</p>
                        <p className="mt-2 text-sm text-stone-500">
                            Agents with approved listings will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="mb-8 text-sm text-stone-500">
                            {agents.length} agent{agents.length !== 1 ? "s" : ""} found
                        </p>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {agents.map((agent) => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </>
    );
}
