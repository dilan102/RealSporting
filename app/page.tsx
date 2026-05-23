import { Hero } from "@/components/home/Hero";
import { QuickInstitutional } from "@/components/home/QuickInstitutional";
import { RecentTrainings } from "@/components/home/RecentTrainings";
import { SocialStrip } from "@/components/home/SocialStrip";
import { NewsCircleShowcase } from "@/components/news/NewsCircleShowcase";
import { readNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const news = await readNews();

  return (
    <>
      <Hero />
      <QuickInstitutional />
      <NewsCircleShowcase items={news} />
      <RecentTrainings />
      <SocialStrip />
    </>
  );
}
