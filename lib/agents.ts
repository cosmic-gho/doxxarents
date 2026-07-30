export type Agent = {
  slug: string;
  name: string;
  specialty: string;
  districts: string[];
  listings: number;
  verified: boolean;
};

// Placeholder roster — replace with real agent records once onboarding
// is live. Shape stays the same so agent cards don't need to change.
export const agents: Agent[] = [
  { slug: "agent-adaeze-okoro", name: "Adaeze Okoro", specialty: "Luxury residential", districts: ["maitama", "asokoro", "guzape"], listings: 24, verified: true },
  { slug: "agent-ibrahim-suleiman", name: "Ibrahim Suleiman", specialty: "Family estates", districts: ["gwarinpa", "life-camp", "kado"], listings: 31, verified: true },
  { slug: "agent-chiamaka-nwosu", name: "Chiamaka Nwosu", specialty: "Affordable housing", districts: ["kubwa", "lugbe", "dawaki"], listings: 40, verified: true },
  { slug: "agent-tunde-bello", name: "Tunde Bello", specialty: "Commercial & office", districts: ["wuse-2", "utako", "jabi"], listings: 18, verified: true },
];

export function getAgentsForDistrict(districtSlug: string, count = 3): Agent[] {
  const matched = agents.filter((a) => a.districts.includes(districtSlug));
  const rest = agents.filter((a) => !matched.includes(a));
  return [...matched, ...rest].slice(0, count);
}
