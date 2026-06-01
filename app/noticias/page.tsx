import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NewsManager } from "@/components/news/NewsManager";
import { RevealSection } from "@/components/ui/RevealSection";
import { club, type News } from "@/lib/content";
import { readNews } from "@/lib/news-store";

export const metadata: Metadata = {
  title: "Noticias",
  description: `Noticias, comunicados y actualidad de ${club.name}.`,
};

export const dynamic = "force-dynamic";

const featuredCategories = ["Cantera", "Entrenamiento", "Comunidad", "Competencia"];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryItems(items: News[], category: string) {
  const exactMatches = items.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase(),
  );

  return [...exactMatches, ...items]
    .filter(
      (item, index, list) =>
        list.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, 3);
}

function NewsImage({
  item,
  sizes,
  priority = false,
}: {
  item: News;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={item.image}
      alt={item.title}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default async function NoticiasPage() {
  const news = await readNews();
  const orderedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const leadNews = orderedNews[0];
  const secondaryNews = orderedNews.slice(1, 4);
  const moreNews = orderedNews.slice(0, 8);

  return (
    <main className="bg-bg pt-20 text-text">
      <RevealSection>
      <section className="relative overflow-hidden border-b border-border bg-bg-elevated">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-10 sm:px-6 lg:px-8">
          <div className="relative flex flex-wrap items-end justify-between gap-5">
            <div className="mobile-reveal">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Real Sporting de Usme
              </p>
              <h1 className="mt-3 text-[clamp(3rem,16vw,5rem)] font-black leading-[0.9] tracking-tight sm:text-6xl">
                Noticias
              </h1>
            </div>
            <nav aria-label="Categorías de noticias" className="mobile-reveal mobile-reveal-delay-1 -mx-4 flex gap-2 overflow-x-auto px-4 mobile-scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {featuredCategories.map((category) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase()}`}
                  className="rounded-full border border-border bg-bg px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent/50 hover:text-accent sm:rounded-lg"
                >
                  {category}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
      </RevealSection>

      {leadNews && (
        <RevealSection>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
            <Link
              href={`/noticias/${leadNews.id}`}
              className="mobile-card-lift group block overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors hover:border-accent/50"
            >
              <div className="relative aspect-[16/10] min-h-[220px] overflow-hidden bg-surface sm:aspect-[16/9] sm:min-h-[290px]">
                <NewsImage
                  item={leadNews}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  priority
                />
                <span className="absolute left-4 top-4 rounded-lg bg-bg-elevated px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-accent shadow-sm">
                  {leadNews.category}
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                  {formatDate(leadNews.date)}
                </time>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                  {leadNews.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                  {leadNews.summary}
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
                  {leadNews.body}
                </p>
              </div>
            </Link>

            <aside className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {secondaryNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.id}`}
                  className="mobile-card-lift group grid min-h-32 grid-cols-[104px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm sm:block sm:min-h-36 lg:grid lg:grid-cols-[116px_minmax(0,1fr)]"
                >
                  <div className="relative min-h-32 overflow-hidden bg-surface sm:aspect-[16/10] sm:min-h-36 lg:aspect-auto">
                    <NewsImage
                      item={item}
                      sizes="(min-width: 1024px) 116px, (min-width: 640px) 30vw, 116px"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-accent">
                      {item.category}
                    </p>
                    <h3 className="mt-2 line-clamp-3 text-base font-black leading-tight">
                      {item.title}
                    </h3>
                    <time className="mt-3 block text-xs font-semibold text-muted">
                      {formatDate(item.date)}
                    </time>
                  </div>
                </Link>
              ))}
            </aside>
          </div>
        </section>
        </RevealSection>
      )}

      <RevealSection>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {featuredCategories.map((category) => {
          const categoryItems = getCategoryItems(orderedNews, category);

          return (
            <section key={category} id={category.toLowerCase()} className="mobile-card-lift scroll-mt-28 rounded-lg border border-border bg-bg-elevated/70 p-4 sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-2xl font-black">{category}</h2>
                <ArrowRight size={18} className="text-accent" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-4">
                {categoryItems.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/noticias/${item.id}`}
                    className="group border-b border-border pb-4 last:border-b-0"
                  >
                    {index === 0 && (
                      <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-surface">
                        <NewsImage
                          item={item}
                          sizes="(min-width: 1024px) 25vw, 100vw"
                        />
                      </div>
                    )}
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-accent">
                      {item.category}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                    <time className="mt-2 block text-xs font-semibold text-muted">
                      {formatDate(item.date)}
                    </time>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>
      </RevealSection>

      <RevealSection>
      <section className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="border-b border-border pb-3 text-3xl font-black">
            Más noticias
          </h2>
          <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
            {moreNews.map((item) => (
              <Link
                key={item.id}
                href={`/noticias/${item.id}`}
                className="group flex items-start justify-between gap-4 border-b border-border py-4"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-accent">
                    {item.category}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <time className="mt-2 block text-xs font-semibold text-muted">
                    {formatDate(item.date)}
                  </time>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-6 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
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
