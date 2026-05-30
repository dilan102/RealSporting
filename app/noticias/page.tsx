import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsManager } from "@/components/news/NewsManager";
import { NewsBadge, NewsVisual } from "@/components/news/NewsVisual";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { readNews } from "@/lib/news-store";
import {
  NEWS_TEXT_PLACEHOLDER,
  NEWS_TITLE_PLACEHOLDER,
  sanitizeVisibleTextOrDefault,
} from "@/lib/validators";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Noticias",
  description: `Noticias, comunicados y actualidad de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Noticias | ${club.name}`,
    `Noticias, comunicados y actualidad de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NoticiasPage() {
  const news = await readNews();
  const orderedNews = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index);
  const leadNews = orderedNews[0];
  const remainingNews = orderedNews.slice(1);

  return (
    <main className="bg-bg pt-20 text-text sm:pt-24">
      <PageHero title="Noticias" subtitle="Actualidad del proceso deportivo" />

      <RevealSection>
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/contacto"
              className="btn-gold inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-black"
            >
              Inscríbete
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </RevealSection>

      {leadNews && (
        <RevealSection>
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
              href={`/noticias/${leadNews.id}`}
              className="mobile-card-lift group grid overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-[var(--accent-gold)]/15 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]"
            >
              <span className="relative min-h-[320px] overflow-hidden bg-surface lg:min-h-[520px]">
                <NewsVisual
                  item={leadNews}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority
                />
                <span className="absolute left-4 top-4">
                  <NewsBadge category={leadNews.category} />
                </span>
              </span>
              <span className="p-6 sm:p-8 lg:flex lg:flex-col lg:justify-center">
                <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {formatDate(leadNews.date)}
                </time>
                <h2 className="mt-4 text-4xl font-black leading-none sm:text-6xl">
                  {sanitizeVisibleTextOrDefault(leadNews.title, NEWS_TITLE_PLACEHOLDER)}
                </h2>
                <span className="mt-5 block max-w-3xl overflow-wrap-anywhere text-base leading-7 text-muted">
                  {sanitizeVisibleTextOrDefault(leadNews.summary, NEWS_TEXT_PLACEHOLDER)}
                </span>
                <span className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-accent/35 bg-accent/10 px-4 text-xs font-black uppercase tracking-[0.14em] text-accent transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-[var(--button-text)]">
                  Leer más
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </span>
            </Link>
          </section>
        </RevealSection>
      )}

      <RevealSection>
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <h2 className="border-b border-border pb-3 text-4xl font-black sm:text-6xl">
            Todas las noticias
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainingNews.map((item) => (
              <Link
                key={item.id}
                href={`/noticias/${item.id}`}
                className="mobile-card-lift group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-[var(--accent-gold)]/15"
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-surface">
                  <NewsVisual
                    item={item}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <span className="absolute left-4 top-4">
                    <NewsBadge category={item.category} />
                  </span>
                </span>
                <span className="block p-5">
                  <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    {formatDate(item.date)}
                  </time>
                  <span className="mt-3 line-clamp-2 block overflow-wrap-anywhere text-2xl font-black leading-none">
                    {sanitizeVisibleTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER)}
                  </span>
                  <span className="mt-3 line-clamp-3 block overflow-wrap-anywhere text-sm leading-6 text-muted">
                    {sanitizeVisibleTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <NewsManager initialItems={orderedNews} showList={false} />
        </section>
      </RevealSection>
    </main>
  );
}
