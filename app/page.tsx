import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { HomeGallerySection } from "@/components/home/HomeGallerySection";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { OdsHomeSection } from "@/components/home/OdsHomeSection";
import { HomeContactBand } from "@/components/home/HomeContactBand";
import { SocialStrip } from "@/components/home/SocialStrip";
import SectionCard from "@/components/SectionCard";
import RevealLine from "@/components/RevealLine";
import SectionDivider from "@/components/SectionDivider";
import { club } from "@/lib/content";

export default async function HomePage() {
  console.log("[HOME PAGE] Rendering home page...");
  
  return (
    <>
      <SectionCard variant="full" className="relative overflow-hidden">
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
      <SectionCard className="mx-4 mt-4 mb-8 rounded-[32px] border-white/8 bg-black/20 shadow-[0_18px_55px_rgba(0,0,0,0.28)] lg:mx-6">
        <QuickInstitutional />
      </SectionCard>
      <SectionDivider label="ruta formativa" />
      <RevealLine label="// ruta formativa" />
      <HomeGallerySection />
      <SectionDivider label="entrenamientos" />
      <RecentTrainings />
      <SectionDivider label="impacto social" />
      <RevealLine label="// impacto social" />
      <OdsHomeSection />
      <HomeContactBand />
      <SocialStrip />
    </>
  );
}
