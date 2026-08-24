import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Property Details — DOXXARentals",
  description: "View full details, photos, amenities and agent contact for this rental property in Abuja on DOXXARentals.",
  openGraph: {
    title: "Rental Property — DOXXARentals",
    description: "Find verified rental properties in Abuja, Nigeria. View details, book an inspection and contact the agent directly.",
    type: "website",
  },

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
