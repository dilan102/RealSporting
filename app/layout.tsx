import type { Metadata } from "next";
import Script from "next/script";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SitePreloader } from "@/components/ui/SitePreloader";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
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
      <body className="min-h-screen flex flex-col">
        <Script id="preloader-boot" strategy="beforeInteractive">
          {`(function(){try{var p=location.pathname;if(p==='/'||p===''){document.documentElement.classList.add('preloader-pending');}}catch(e){}})();`}
        </Script>
        <SitePreloader />
        <ThemeProvider>
          <AuthProvider>
            <div id="site-content" className="site-content flex min-h-screen flex-col">
              <Navbar />
              <AdminPortal />
              <WhatsAppFloat />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
