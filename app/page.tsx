import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import RevealLine from "@/components/RevealLine";
import SectionDivider from "@/components/SectionDivider";
import { club } from "@/lib/content";

// Lazy load ALL non-critical components with loading placeholders
const HomeGallerySection = dynamic(
  () => import("@/components/home/HomeGallerySection").then(mod => ({ default: mod.HomeGallerySection })),
  { loading: () => <div className="h-96" /> }
);

const RecentTrainings = dynamic(
  () => import("@/components/home/RecentTrainings").then(mod => ({ default: mod.RecentTrainings })),
  { loading: () => <div className="h-96" /> }
);

const LazyOdsHomeSection = dynamic(
  () => import("@/components/home/OdsHomeSection").then(mod => ({ default: mod.OdsHomeSection })),
  { loading: () => <div className="h-96" /> }
);

const HomeContactBand = dynamic(
  () => import("@/components/home/HomeContactBand").then(mod => ({ default: mod.HomeContactBand })),
  { loading: () => <div className="h-96" /> }
);

const SocialStrip = dynamic(
  () => import("@/components/home/SocialStrip").then(mod => ({ default: mod.SocialStrip })),
  { loading: () => <div className="h-48" /> }
);

export default async function HomePage() {
  return (
    <>
      <Hero
        copy={{
          badge: club.name,
          subtitle: club.tagline,
          cta: "Conocer el club",
          location: "Usme · Bogotá D.C.",
        }}
      />
      <RevealLine label="// proyecto institucional" />
      <section className="section-shell py-10 sm:py-14">
        <QuickInstitutional />
      </section>
      <SectionDivider label="ruta formativa" />
      <RevealLine label="// ruta formativa" />
      <section className="section-shell py-10 sm:py-14">
        <HomeGallerySection />
      </section>
      <SectionDivider label="entrenamientos" />
      <section className="section-shell py-10 sm:py-14">
        <RecentTrainings />
      </section>
      <SectionDivider label="impacto social" />
      <RevealLine label="// impacto social" />
      <section className="section-shell py-10 sm:py-14">
        <LazyOdsHomeSection />
      </section>
      <section className="section-shell py-10 sm:py-14">
        <HomeContactBand />
      </section>
      <section className="section-shell py-10 sm:py-14">
        <SocialStrip />
      </section>
    </>
  );
}
