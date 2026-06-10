import type { Metadata } from "next";
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
import { OG_IMAGE_URL, siteMetadata } from "@/lib/site";
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
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${allFonts.map((font) => font.variable).join(" ")}`}
    >
      <head>
      </head>
      <body suppressHydrationWarning className="relative min-h-screen flex flex-col overflow-x-hidden">
        <ThemeProvider>
          <SmoothScrollProvider />
          <StarField />
          <PagePreloader />
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
      </body>
    </html>
  );
}
