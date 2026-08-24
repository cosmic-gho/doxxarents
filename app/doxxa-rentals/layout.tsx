import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Doxxa Rentals — Explore Abuja Districts",
  description: "Explore an interactive 3D overview of rental districts in Abuja with DOXXARentals. Find your next home in Katampe, Maitama, Wuse, Jabi and more.",
  openGraph: {
    title: "Explore Abuja Districts — DOXXARentals",
    description: "Interactive 3D district explorer for rental properties in Abuja, Nigeria.",
    type: "website",
  },

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
