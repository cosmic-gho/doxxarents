// Centralized district configuration.
// To add a new district or city later: add one object here and drop an image
// in /public/images/districts/{slug}.{jpg|png}. No component code changes needed.

export type District = {
  slug: string;
  name: string;
  city: string;
  image: string; // resolved at build time, falls back to default hero if missing
  hasCustomImage: boolean;
  avgRent: string;
  lifestyle: string;
  popularTypes: string[];
  landmarks: string[];
};

const DEFAULT_IMAGE = "/images/districts/default-abuja.jpg";

// Districts we have real photography for.
const CUSTOM_IMAGES: Record<string, string> = {
  wuye: "/images/districts/wuye.jpg",
  jahi: "/images/districts/jahi.jpg",
  maitama: "/images/districts/maitama.jpg",
  kubwa: "/images/districts/kubwa.jpg",
  lugbe: "/images/districts/lugbe.jpg",
  apo: "/images/districts/apo.jpg",
  "life-camp": "/images/districts/life-camp.jpg",
  guzape: "/images/districts/guzape.jpg",
  gwarinpa: "/images/districts/gwarinpa.jpg",
  "wuse-2": "/images/districts/wuse-2.jpg",
  asokoro: "/images/districts/asokoro.jpg",
  mabushi: "/images/districts/mabushi.jpg",
};

function resolveImage(slug: string) {
  const custom = CUSTOM_IMAGES[slug];
  return { image: custom ?? DEFAULT_IMAGE, hasCustomImage: Boolean(custom) };
}

type DistrictSeed = Omit<District, "image" | "hasCustomImage">;

const SEED: DistrictSeed[] = [
  { slug: "maitama", name: "Maitama", city: "Abuja", avgRent: "₦12M – ₦45M / year", lifestyle: "Diplomatic, quiet, high-net-worth residential", popularTypes: ["Duplex", "Detached House", "Penthouse"], landmarks: ["Aso Rock", "Maitama District Hospital", "Transcorp Hilton"] },
  { slug: "asokoro", name: "Asokoro", city: "Abuja", avgRent: "₦15M – ₦60M / year", lifestyle: "Government, embassies, ultra-premium security", popularTypes: ["Detached House", "Duplex", "Office Space"], landmarks: ["Presidential Villa", "National Hospital Abuja"] },
  { slug: "jabi", name: "Jabi", city: "Abuja", avgRent: "₦2.5M – ₦9M / year", lifestyle: "Young professionals, lakeside leisure, nightlife", popularTypes: ["2 Bedroom", "3 Bedroom", "Studio Apartment"], landmarks: ["Jabi Lake Mall", "Jabi Motor Park"] },
  { slug: "wuse", name: "Wuse", city: "Abuja", avgRent: "₦3M – ₦12M / year", lifestyle: "Central commercial district, mixed residential", popularTypes: ["Office Space", "Shop", "2 Bedroom"], landmarks: ["Wuse Market", "National Christian Centre"] },
  { slug: "wuse-2", name: "Wuse II", city: "Abuja", avgRent: "₦4M – ₦18M / year", lifestyle: "Upscale commercial and residential core", popularTypes: ["Office Space", "3 Bedroom", "Penthouse"], landmarks: ["Silverbird Galleria", "Nnamdi Azikiwe Express Way"] },
  { slug: "gwarinpa", name: "Gwarinpa", city: "Abuja", avgRent: "₦1.8M – ₦6M / year", lifestyle: "Africa's largest housing estate, family-oriented", popularTypes: ["3 Bedroom", "Semi Detached House", "Terrace House"], landmarks: ["Gwarinpa Shopping Mall", "1st Avenue"] },
  { slug: "guzape", name: "Guzape", city: "Abuja", avgRent: "₦8M – ₦35M / year", lifestyle: "Hilltop luxury villas overlooking the city", popularTypes: ["Detached House", "Duplex"], landmarks: ["Guzape Hills", "Jabi Lake views"] },
  { slug: "katampe", name: "Katampe", city: "Abuja", avgRent: "₦2M – ₦10M / year", lifestyle: "Rapidly developing residential district", popularTypes: ["3 Bedroom", "Duplex", "Land"], landmarks: ["Katampe District Park"] },
  { slug: "katampe-extension", name: "Katampe Extension", city: "Abuja", avgRent: "₦1.5M – ₦7M / year", lifestyle: "Emerging estates, growing infrastructure", popularTypes: ["Mini Flat", "2 Bedroom", "Land"], landmarks: ["Northern Foreshore"] },
  { slug: "life-camp", name: "Life Camp", city: "Abuja", avgRent: "₦2M – ₦8M / year", lifestyle: "Family estates, schools, quiet streets", popularTypes: ["3 Bedroom", "Terrace House", "Duplex"], landmarks: ["Games Village", "Kado Fish Market"] },
  { slug: "apo", name: "Apo", city: "Abuja", avgRent: "₦1.5M – ₦6M / year", lifestyle: "Balanced residential and commercial strip", popularTypes: ["2 Bedroom", "Self Contain", "Shop"], landmarks: ["Apo Resettlement", "Apo Mechanic Village"] },
  { slug: "lugbe", name: "Lugbe", city: "Abuja", avgRent: "₦800K – ₦3.5M / year", lifestyle: "Airport-adjacent, affordable, fast-growing", popularTypes: ["Self Contain", "Mini Flat", "2 Bedroom"], landmarks: ["Nnamdi Azikiwe International Airport"] },
  { slug: "kubwa", name: "Kubwa", city: "Abuja", avgRent: "₦600K – ₦2.8M / year", lifestyle: "Satellite town, high density, budget-friendly", popularTypes: ["Self Contain", "Room & Parlour", "2 Bedroom"], landmarks: ["Kubwa Market", "Byazhin"] },
  { slug: "utako", name: "Utako", city: "Abuja", avgRent: "₦2.5M – ₦9M / year", lifestyle: "Central, walkable, close to Central Business District", popularTypes: ["2 Bedroom", "Office Space", "Shop"], landmarks: ["Utako Market", "Jabi Express Way"] },
  { slug: "lokogoma", name: "Lokogoma", city: "Abuja", avgRent: "₦1.2M – ₦5M / year", lifestyle: "Quiet, developing, popular with young families", popularTypes: ["2 Bedroom", "3 Bedroom", "Land"], landmarks: ["Lokogoma District Park"] },
  { slug: "jahi", name: "Jahi", city: "Abuja", avgRent: "₦2M – ₦8M / year", lifestyle: "Modern estates, close to Jabi's amenities", popularTypes: ["Duplex", "3 Bedroom", "Terrace House"], landmarks: ["Jahi District Park"] },
  { slug: "wuye", name: "Wuye", city: "Abuja", avgRent: "₦2M – ₦9M / year", lifestyle: "Emerging premium district near Central Area", popularTypes: ["3 Bedroom", "Duplex", "Office Space"], landmarks: ["Wuye District Park"] },
  { slug: "mabushi", name: "Mabushi", city: "Abuja", avgRent: "₦2.2M – ₦8.5M / year", lifestyle: "Mixed-use, close to Jabi and Utako", popularTypes: ["2 Bedroom", "Office Space", "Shop"], landmarks: ["Mabushi Market"] },
  { slug: "kado", name: "Kado", city: "Abuja", avgRent: "₦1.8M – ₦7M / year", lifestyle: "Lakeside estates, growing fast", popularTypes: ["3 Bedroom", "Duplex"], landmarks: ["Kado Fish Market", "Jabi Lake"] },
  { slug: "dawaki", name: "Dawaki", city: "Abuja", avgRent: "₦1.5M – ₦6M / year", lifestyle: "Affordable estates near Gwarinpa", popularTypes: ["2 Bedroom", "3 Bedroom", "Land"], landmarks: ["Dawaki District Park"] },
];

export const districts: District[] = SEED.map((d) => ({ ...d, ...resolveImage(d.slug) }));

export function getDistrict(slug: string): District | undefined {
  return districts.find((d) => d.slug === slug);
}

export const featuredDistrictSlugs = ["maitama", "asokoro", "wuse-2", "jabi", "gwarinpa", "guzape"];
