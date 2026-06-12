import type { Metadata } from "next";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { LoadingInitializer } from "@/components/providers/LoadingInitializer";
import { MainContentRenderer } from "@/components/providers/MainContentRenderer";
import { GlobalContentManager } from "@/components/admin/GlobalContentManager";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { PageTransition } from "@/components/ui/PageTransition";
import PagePreloader from "@/components/ui/PagePreloader";
import StarField from "@/components/ui/StarField";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";
import { AIAssistantFloatingButton } from "@/components/ui/AIAssistantFloatingButton";
import { club } from "@/lib/content";
import { CONTACT_EMAIL, OG_IMAGE_URL, PHONE_DISPLAY, SITE_URL, siteMetadata } from "@/lib/site";
import { allFonts } from "@/lib/fonts";
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: club.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: OG_IMAGE_URL,
    email: CONTACT_EMAIL,
    telephone: PHONE_DISPLAY,
    sport: "Fútbol sala",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Usme",
      addressRegion: "Bogotá D.C.",
      addressCountry: "CO",
    },
  };

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${allFonts.map((font) => font.variable).join(" ")}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning className="relative min-h-screen flex flex-col overflow-x-hidden">
        <LoadingProvider>
          <PagePreloader />
          <LoadingInitializer />
          <MainContentRenderer>
            <ThemeProvider>
              <SmoothScrollProvider />
              <StarField />
              <div id="site-content" className="site-content relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <AdminPortal />
                <GlobalContentManager />
                <AIAssistantWidget />
                <AIAssistantFloatingButton />
                <main className="flex-1">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </MainContentRenderer>
        </LoadingProvider>
      </body>
    </html>
  );
}
