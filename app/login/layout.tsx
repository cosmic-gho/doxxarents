import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Sign In — DOXXARentals",
  description: "Sign in to your DOXXARentals account to access saved properties, book inspections and manage your listings.",

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
