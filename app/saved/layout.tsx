import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Saved Properties — DOXXARentals",
  description: "View and manage your saved rental properties on DOXXARentals.",

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
