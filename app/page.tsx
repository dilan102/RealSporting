import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { SocialStrip } from "@/components/home/SocialStrip";
import { NewsCircleShowcase } from "@/components/news/NewsCircleShowcase";
import { RevealSection } from "@/components/ui/RevealSection";
import { readNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await readNews();

  return (
    <>
      <RevealSection>
        <Hero />
      </RevealSection>
      <RevealSection>
        <QuickInstitutional />
      </RevealSection>
      <RevealSection>
        <NewsCircleShowcase items={news} />
      </RevealSection>
      <RevealSection>
        <RecentTrainings />
      </RevealSection>
      <RevealSection>
        <SocialStrip />
      </RevealSection>
    </>
  );
}
