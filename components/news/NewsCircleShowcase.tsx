import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { News } from "@/lib/content";
import { NewsBadge, NewsVisual } from "./NewsVisual";

type Props = {
  items: News[];
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NewsCircleShowcase({ items }: Props) {
  const orderedItems = [...items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 6);
  const leadNews = orderedItems[0];
  const secondaryNews = orderedItems.slice(1);

  if (!leadNews) {
    return null;
  }

  return (
    <section className="section-ambient border-y border-border bg-bg text-text">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mobile-reveal flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Actualidad
            </p>
            <h2 className="font-newsroom kinetic-heading mt-3 text-[3rem] font-black leading-none sm:text-[5rem]">
              Noticias
            </h2>
          </div>
          <Link
            href="/noticias"
            className="alive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-bold text-text transition-all hover:scale-[1.03] hover:border-accent hover:text-accent hover:shadow-lg hover:shadow-[var(--accent-gold)]/15"
          >
            Ver todas las noticias
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          <Link
            href={`/noticias/${leadNews.id}`}
            className="alive-card mobile-card-lift group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-[var(--accent-gold)]/15"
          >
            <div className="relative aspect-[16/10] min-h-[340px] overflow-hidden">
              <NewsVisual
                item={leadNews}
                sizes="(min-width: 1024px) 62vw, 100vw"
                priority
              />
              <span className="absolute left-4 top-4">
                <NewsBadge category={leadNews.category} />
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <time className="text-xs font-bold uppercase tracking-normal text-muted">
                {formatDate(leadNews.date)}
              </time>
              <h3 className="font-newsroom mt-3 text-4xl font-black leading-none sm:text-6xl">
                {leadNews.title}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                {leadNews.summary}
              </p>
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {secondaryNews.map((item) => (
              <Link
                key={item.id}
                href={`/noticias/${item.id}`}
                className="alive-card mobile-card-lift group grid min-h-32 grid-cols-[104px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-[var(--accent-gold)]/15 sm:min-h-36 sm:grid-cols-[120px_minmax(0,1fr)]"
              >
                <span className="relative min-h-32 overflow-hidden sm:min-h-36">
                  <NewsVisual item={item} sizes="120px" />
                </span>
                <span className="p-4">
                  <NewsBadge category={item.category} />
                  <span className="font-newsroom mt-3 line-clamp-2 block text-xl font-black leading-none">
                    {item.title}
                  </span>
                  <time className="mt-3 block text-xs font-semibold text-muted">
                    {formatDate(item.date)}
                  </time>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
