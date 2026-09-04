import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DOXXARentals — Find Your Next Home Without the Stress",
  description:
    "A technology-driven rental platform for Abuja, Nigeria. Verified listings, verified agents, and a rental experience built for trust.",
  icons: {
    icon: "/images/logo/favicon.png",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/components/providers/AppProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AuthProvider>
          <AppProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
