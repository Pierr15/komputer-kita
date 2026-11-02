import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Komputer Kita | Hardware, Komponen PC & Aksesoris",
    template: "%s | Komputer Kita",
  },
  description: "Temukan kebutuhan komputer, komponen PC, peripheral, dan aksesoris. Pesan online lalu ambil langsung di toko.",
  applicationName: "Komputer Kita",
  openGraph: {
    title: "Komputer Kita | Hardware, Komponen PC & Aksesoris",
    description: "Semua kebutuhan komputer dalam satu tempat.",
    siteName: "Komputer Kita",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
