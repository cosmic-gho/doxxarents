import Image from "next/image";
import { TeamMember } from "@/lib/team";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
      <div className="relative aspect-[4/5] w-full bg-stone-900">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-ink">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-gold-dark">{member.role}</p>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">{member.bio}</p>
        <div className="mt-4 border-t border-stone-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Experience</p>
          <p className="mt-1 text-sm text-stone-600">{member.experience}</p>
        </div>
      </div>
    </div>
  );
}
