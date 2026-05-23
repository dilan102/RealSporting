import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { News } from "@/lib/content";

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

const portalCategories = ["Cantera", "Entrenamiento", "Comunidad", "Competencia"];

export function NewsCircleShowcase({ items }: Props) {
  const orderedItems = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const preferredItems = orderedItems.filter((item) =>
    portalCategories.some(
      (category) => item.category.toLowerCase() === category.toLowerCase(),
    ),
  );
  const displayItems = preferredItems.length >= 4 ? preferredItems : orderedItems;
  const leadNews = displayItems[0];
  const secondaryNews = displayItems.slice(1, 5);
  const categories = portalCategories;
  const moreNews = displayItems.slice(0, 8);

  if (!leadNews) {
    return null;
  }

  return (
    <section className="border-y border-border bg-bg text-text">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Actualidad
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Noticias
            </h2>
          </div>
          <Link
            href="/noticias"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-bold text-text transition-colors hover:border-accent/50 hover:text-accent"
          >
            Ver todas las noticias
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.34fr)_minmax(300px,0.66fr)]">
          <Link
            href="/noticias"
            className="group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors hover:border-accent/50"
          >
            <div className="relative aspect-[16/9] min-h-[300px] overflow-hidden">
              <Image
                src={leadNews.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 62vw, 100vw"
              />
              <span className="absolute left-4 top-4 rounded-lg bg-bg-elevated px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-accent shadow-sm">
                {leadNews.category}
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                {formatDate(leadNews.date)}
              </time>
              <h3 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
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
                href="/noticias"
                className="group grid min-h-36 grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors hover:border-accent/50"
              >
                <span className="relative min-h-36 overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="120px"
                  />
                </span>
                <span className="p-4">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-accent">
                    {item.category}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-base font-black leading-tight">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {categories.map((category) => {
            const categoryItems = getCategoryItems(displayItems, category);

            return (
              <section key={category}>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-2xl font-black">{category}</h3>
                  <Link
                    href="/noticias"
                    className="text-xs font-black uppercase tracking-[0.12em] text-accent"
                  >
                    Ver todas
                  </Link>
                </div>
                <div className="mt-4 grid gap-4">
                  {categoryItems.map((item, index) => (
                    <Link
                      key={item.id}
                      href="/noticias"
                      className="group border-b border-border pb-4 last:border-b-0"
                    >
                      {index === 0 && (
                        <span className="relative mb-4 block aspect-[16/9] overflow-hidden rounded-lg bg-white">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 1024px) 30vw, 100vw"
                          />
                        </span>
                      )}
                      <span className="line-clamp-2 block text-base font-black leading-tight group-hover:text-accent">
                        {item.title}
                      </span>
                      <time className="mt-2 block text-xs font-semibold text-muted">
                        {formatDate(item.date)}
                      </time>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-14">
          <h3 className="border-b border-border pb-3 text-3xl font-black">
            Más noticias
          </h3>
          <div className="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {moreNews.map((item) => (
              <Link
                key={item.id}
                href="/noticias"
                className="group flex items-start justify-between gap-4 border-b border-border py-4"
              >
                <span>
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-accent">
                    {item.category}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-base font-black leading-tight group-hover:text-accent">
                    {item.title}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  className="mt-6 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
