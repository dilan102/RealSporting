import type { Metadata } from "next";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Hero } from "@/components/home/Hero";
import { HomeContactBand } from "@/components/home/HomeContactBand";
import { HomeGallerySection } from "@/components/home/HomeGallerySection";
import { OdsHomeSection } from "@/components/home/OdsHomeSection";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { SocialStrip } from "@/components/home/SocialStrip";
import { NewsCircleShowcase } from "@/components/news/NewsCircleShowcase";
import { RevealSection } from "@/components/ui/RevealSection";
import { FloatingSectionArrow } from "@/components/ui/FloatingSectionArrow";
import { club } from "@/lib/content";
import { pageOpenGraph } from "@/lib/site";
import { readNews } from "@/lib/news-store";

export const metadata: Metadata = {
  title: club.name,
  description: club.tagline,
  openGraph: pageOpenGraph(club.name, club.tagline),
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await readNews();

  return (
    <>
      <FloatingSectionArrow
        sectionIds={[
          "inicio",
          "institucional",
          "categorias-home",
          "ods-home",
          "noticias-home",
          "galeria-home",
          "entrenamientos-home",
          "inscripcion-home",
          "redes-home",
        ]}
      />
      <RevealSection>
        <div id="inicio">
          <Hero />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="institucional">
          <QuickInstitutional />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="categorias-home">
          <CategoryShowcase />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="ods-home">
          <OdsHomeSection />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="noticias-home">
          <NewsCircleShowcase items={news} />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="galeria-home">
          <HomeGallerySection />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="entrenamientos-home">
          <RecentTrainings />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="inscripcion-home">
          <HomeContactBand />
        </div>
      </RevealSection>
      <RevealSection>
        <div id="redes-home">
          <SocialStrip />
        </div>
      </RevealSection>
    </>
  );
}
