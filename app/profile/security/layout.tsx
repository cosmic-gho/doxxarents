import type { Metadata } from 'next';

export const metadata: Metadata = {

  title: "Security Settings — DOXXARentals",
  description: "Change your password and manage security settings for your DOXXARentals account.",

};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
