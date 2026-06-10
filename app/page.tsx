import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import SectionCard from "@/components/SectionCard";
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
      <SectionCard variant="full" className="glass-card relative overflow-hidden">
        <Hero
          copy={{
            badge: club.name,
            subtitle: club.tagline,
            cta: "Conocer el club",
            location: "Usme · Bogotá D.C.",
          }}
        />
      </SectionCard>
      <RevealLine label="// proyecto institucional" />
      <SectionCard className="mx-4 mt-4 mb-8 glass-card rounded-[32px]">
        <QuickInstitutional />
      </SectionCard>
      <SectionDivider label="ruta formativa" />
      <RevealLine label="// ruta formativa" />
      <div className="glass-card mx-4 my-8 rounded-[32px]">
        <HomeGallerySection />
      </div>
      <SectionDivider label="entrenamientos" />
      <div className="glass-card mx-4 my-8 rounded-[32px]">
        <RecentTrainings />
      </div>
      <SectionDivider label="impacto social" />
      <RevealLine label="// impacto social" />
      <div className="glass-card mx-4 my-8 rounded-[32px]">
        <LazyOdsHomeSection />
      </div>
      <div className="glass-card mx-4 my-8 rounded-[32px]">
        <HomeContactBand />
      </div>
      <div className="glass-card mx-4 my-8 rounded-[32px]">
        <SocialStrip />
      </div>
    </>
  );
}
