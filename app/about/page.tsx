import { team } from "@/lib/team";
import TeamMemberCard from "@/components/TeamMemberCard";

export const metadata = { title: "About — DOXXARentals" };

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-stone-200 bg-stone-100">
        <div className="container-page py-20 md:py-28">
          <p className="text-sm font-medium text-gold-dark">About DOXXARentals</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl">
            Renting in Abuja, rebuilt around trust.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600">
            DOXXARentals is a technology-driven rental platform built to solve
            the housing and rental challenges renters, agents, and landlords
            face across Abuja — with verified listings, verified agents, and
            a search experience designed for how people actually look for a
            home. We're building the infrastructure to take this experience
            across Nigeria.
          </p>
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-gold-dark">Leadership</p>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            The team building DOXXARentals
          </h2>
          <p className="mt-4 text-stone-600">
            A small team with operating experience in Nigerian real estate,
            marketing, and technology — working together to make renting
            safer, faster, and more transparent.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>
      </section>
    </>
  );
}
