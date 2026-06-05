import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SitePreloader } from "@/components/ui/SitePreloader";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { PageTransition } from "@/components/ui/PageTransition";
import Cursor from "@/components/ui/Cursor";
import { club } from "@/lib/content";
import { PRELOADER_BOOT_SCRIPT, PRELOADER_CRITICAL_CSS } from "@/lib/preloader";
import { OG_IMAGE_URL, siteMetadata } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: club.name,
    template: `%s | ${club.name}`,
  },
  description: club.tagline,
  keywords: [
    "fútbol",
    "Usme",
    "Bogotá",
    "formación deportiva",
    "Club Deportivo Real Sporting",
  ],
  openGraph: {
    title: club.name,
    description: club.tagline,
    locale: siteMetadata.openGraph.locale,
    type: siteMetadata.openGraph.type,
    images: [OG_IMAGE_URL],
  },
  twitter: siteMetadata.twitter,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: PRELOADER_CRITICAL_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <SitePreloader />
        <Cursor />
        <ThemeProvider>
          <div id="site-content" className="site-content flex min-h-screen flex-col">
            <Navbar />
            <AdminPortal />
            <WhatsAppFloat />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
