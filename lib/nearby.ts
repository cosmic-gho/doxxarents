import { District } from "./districts";

export type NearbyPlace = { name: string; distance: string };

// Lightweight mock data so every district page has believable nearby-places
// sections. Swap for a real places API (already scaffolded as an
// "Interactive Map Placeholder" on the district page) without touching
// the page template.
export function getNearby(district: District) {
  const base = district.name;
  const schools: NearbyPlace[] = [
    { name: `${base} International School`, distance: "0.8 km" },
    { name: "British Model Academy", distance: "1.4 km" },
    { name: `${base} Community Primary School`, distance: "2.1 km" },
  ];
  const hospitals: NearbyPlace[] = [
    { name: `${base} District Hospital`, distance: "1.1 km" },
    { name: "Nisa Premier Hospital", distance: "2.6 km" },
    { name: "Garki General Hospital", distance: "3.9 km" },
  ];
  const shopping: NearbyPlace[] = [
    { name: `${base} Shopping Complex`, distance: "0.6 km" },
    { name: "Jabi Lake Mall", distance: "4.2 km" },
    { name: "Silverbird Galleria", distance: "5.5 km" },
  ];
  const restaurants: NearbyPlace[] = [
    { name: `${base} Grill House`, distance: "0.5 km" },
    { name: "Yellow Chilli", distance: "2.3 km" },
    { name: "Cravings Restaurant", distance: "3.1 km" },
  ];
  return { schools, hospitals, shopping, restaurants };
}
