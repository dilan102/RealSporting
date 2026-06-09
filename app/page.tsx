import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { HomeGallerySection } from "@/components/home/HomeGallerySection";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { OdsHomeSection } from "@/components/home/OdsHomeSection";
import { HomeContactBand } from "@/components/home/HomeContactBand";
import { SocialStrip } from "@/components/home/SocialStrip";
import SectionDivider from "@/components/SectionDivider";
import { club } from "@/lib/content";

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
      <QuickInstitutional />
      <SectionDivider label="ruta formativa" />
      <HomeGallerySection />
      <SectionDivider label="entrenamientos" />
      <RecentTrainings />
      <SectionDivider label="impacto social" />
      <OdsHomeSection />
      <HomeContactBand />
      <SocialStrip />
    </>
  );
}
