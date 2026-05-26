import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { SocialStrip } from "@/components/home/SocialStrip";
import { NewsCircleShowcase } from "@/components/news/NewsCircleShowcase";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionArrow } from "@/components/ui/SectionArrow";
import { readNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await readNews();

  return (
    <>
      <RevealSection>
        <div id="inicio">
          <Hero />
        </div>
        <SectionArrow targetId="institucional" className="-mt-20 relative z-20" />
      </RevealSection>
      <RevealSection>
        <div id="institucional">
          <QuickInstitutional />
        </div>
        <SectionArrow targetId="noticias-home" className="-mt-16 relative z-20" />
      </RevealSection>
      <RevealSection>
        <div id="noticias-home">
          <NewsCircleShowcase items={news} />
        </div>
        <SectionArrow targetId="entrenamientos-home" className="-mt-16 relative z-20" />
      </RevealSection>
      <RevealSection>
        <div id="entrenamientos-home">
          <RecentTrainings />
        </div>
        <SectionArrow targetId="redes-home" className="-mt-16 relative z-20" />
      </RevealSection>
      <RevealSection>
        <div id="redes-home">
          <SocialStrip />
        </div>
      </RevealSection>
    </>
  );
}
