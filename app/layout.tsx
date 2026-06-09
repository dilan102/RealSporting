import type { Metadata } from "next";
import { GlobalContentManager } from "@/components/admin/GlobalContentManager";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";
import { AIAssistantFloatingButton } from "@/components/ui/AIAssistantFloatingButton";
import { PageTransition } from "@/components/ui/PageTransition";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/ui/Cursor";
import AnimatedGrid from "@/components/AnimatedGrid";
import { club } from "@/lib/content";
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
        {/* Critical: Ensure content is visible even if JS fails */}
        <script dangerouslySetInnerHTML={{
          __html: `
(function() {
  try {
    const html = document.documentElement;
    const body = document.body;
    
    // Force add done class immediately as ultimate fallback
    html.classList.add('preloader-done');
    body.classList.add('preloader-done');
    html.classList.remove('preloader-active', 'preloader-pending');
    body.classList.remove('preloader-active');
    
    console.log('[SSR] Applied preloader-done fallback');
    
    // Double-check: if content is still hidden after 100ms, force show it
    setTimeout(() => {
      const siteContent = document.getElementById('site-content');
      if (siteContent) {
        const style = window.getComputedStyle(siteContent);
        if (style.visibility === 'hidden' || style.opacity === '0') {
          siteContent.style.visibility = 'visible !important';
          siteContent.style.opacity = '1 !important';
          siteContent.style.pointerEvents = 'auto !important';
          console.warn('[SSR] Force-showing hidden content');
        }
      }
    }, 100);
  } catch (e) {
    console.error('[SSR] Error in preloader fallback:', e);
  }
})()
          `
        }} />
      </head>
      <body suppressHydrationWarning className="relative min-h-screen flex flex-col overflow-x-hidden">
        <Preloader logoSrc="/logo.png" duration={3500} />
        <Cursor />
        <div className="pointer-events-none fixed inset-0 z-0">
          <AnimatedGrid />
        </div>
        <ThemeProvider>
          <div id="site-content" className="site-content relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <AdminPortal />
            <GlobalContentManager />
            <AIAssistantWidget />
            <AIAssistantFloatingButton />
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
