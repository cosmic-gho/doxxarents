import Image from "next/image";
import Link from "next/link";

// Single source of truth for the brand mark. Every surface that needs the
// DOXXARentals logo (navbar, footer, auth pages, dashboard, sidebar, mobile
// nav, favicon) should import this component rather than referencing the
// image path directly.
const LOGO_SRC = "/images/logo/doxxarents-logo.jpg";

type LogoProps = {
  className?: string;
  variant?: "full" | "mark";
  href?: string | null;
};

export default function Logo({ className = "", href = "/" }: LogoProps) {
  const img = (
    <Image
      src={LOGO_SRC}
      alt="DOXXARentals"
      width={220}
      height={72}
      priority
      className={`h-8 w-auto object-contain md:h-9 ${className}`}
    />
  );

  if (!href) return img;
  return (
    <Link href={href} aria-label="DOXXARentals home">
      {img}
    </Link>
  );
}
