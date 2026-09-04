// @ts-nocheck
import React from "react";
import { Stars } from "./ui/Icons";
import { AgentAvatar } from "./SharedUI";
import { getTeamPhoto } from "@/lib/mock-data";

export function TeamCard({ member }) {
  const photo = getTeamPhoto(member.photoKey);
  return (
    <div className="doxxa-card-premium bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col items-center text-center">
      {photo ? (
        <img src={photo} alt={member.name} className="w-24 h-24 rounded-full object-cover border border-neutral-700 mb-3" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-neutral-800 border border-neutral-700 mb-3 flex items-center justify-center text-neutral-500 text-xl">
          {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
      )}
      <p className="text-neutral-50 font-medium" style={{ fontFamily: "Georgia, serif" }}>{member.name}</p>
      <p className="text-amber-400 text-xs mb-2">{member.role}</p>
      <p className="text-neutral-400 text-xs leading-relaxed mb-2">{member.bio}</p>
      <p className="text-neutral-600 text-[11px] leading-relaxed mb-3">{member.experience}</p>
      <div className="flex items-center gap-3 mt-auto">
        <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`} className="text-neutral-500 hover:text-amber-400">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.98 3.5C4.98 4.9 3.94 6 2.5 6S0 4.9 0 3.5 1.06 1 2.5 1s2.48 1.1 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.98 8.25h4.31v2.01h.06c.6-1.1 2.06-2.26 4.24-2.26 4.53 0 5.37 2.85 5.37 6.56V23h-4.5v-6.66c0-1.59-.03-3.63-2.2-3.63-2.2 0-2.54 1.72-2.54 3.51V23h-4.5V8.25z" /></svg>
        </a>
        <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="text-neutral-500 hover:text-amber-400">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 6l10 7 10-7" /></svg>
        </a>
      </div>
    </div>
  );
}

export function AgentMiniCard({ agent, onOpen }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex gap-3 items-center">
      <AgentAvatar agent={agent} size={56} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-neutral-100 text-sm font-medium truncate">{agent.name}</p>
          {agent.verified && <Badge tone="verified">Verified</Badge>}
        </div>
        <p className="text-neutral-500 text-xs truncate">{agent.agency}</p>
        <div className="flex items-center gap-1 mt-1">
          <Stars value={agent.rating} />
          <span className="text-neutral-500 text-xs">{agent.rating} ({agent.reviewCount})</span>
        </div>
      </div>
      <button onClick={() => onOpen(agent.id)} className="text-xs text-amber-400 hover:underline whitespace-nowrap">
        View profile
      </button>
    </div>
  );
}

