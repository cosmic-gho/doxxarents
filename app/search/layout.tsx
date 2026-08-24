import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Search Properties — DOXXARentals",
  description: "Search and filter rental properties across every district in Abuja, Nigeria. Filter by price, bedrooms, property type and more.",
  openGraph: {
    title: "Search Properties — DOXXARentals",
    description: "Find the perfect rental in Abuja. Filter by district, price, bedrooms and property type.",
    type: "website",
  },

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
