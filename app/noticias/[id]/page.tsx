import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsBadge, NewsVisual } from "@/components/news/NewsVisual";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { readNews } from "@/lib/news-store";
import { pageOpenGraph } from "@/lib/site";
import {
  NEWS_TEXT_PLACEHOLDER,
  NEWS_TITLE_PLACEHOLDER,
  normalizeText,
  sanitizeVisibleTextOrDefault,
} from "@/lib/validators";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const items = await readNews();
  const item = items.find((news) => news.id === id);

  if (!item) {
    return {
      title: "Noticia no encontrada",
    };
  }

  return {
    title: sanitizeVisibleTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
    description: sanitizeVisibleTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
    openGraph: pageOpenGraph(
      `${sanitizeVisibleTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER)} | ${club.name}`,
      sanitizeVisibleTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
    ),
  };
}

export default async function NoticiaDetallePage({ params }: Props) {
  const { id } = await params;
  const items = await readNews();
  const item = items.find((news) => news.id === id);

  if (!item || item.status === "draft") {
    notFound();
  }

  const title = sanitizeVisibleTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER);
  const summary = sanitizeVisibleTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER);
  const body = sanitizeVisibleTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER);
  const showBody =
    normalizeText(body) !== normalizeText(summary) &&
    !normalizeText(body).startsWith(normalizeText(summary));

  return (
    <main className="bg-bg text-text">
      <section className="section-ambient relative isolate overflow-hidden bg-[#050805] text-white">
        <div className="absolute inset-0 opacity-50">
          <NewsVisual item={item} sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,9,0.94),rgba(5,14,9,0.72)_52%,rgba(5,14,9,0.3))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,9,0.2),rgba(5,14,9,0.9))]" />

        <div className="section-shell relative flex min-h-[560px] flex-col justify-end pb-12 pt-32">
          <Link
            href="/noticias"
            className="alive-lift inline-flex w-fit items-center gap-2 rounded-lg border border-white/18 bg-white/10 px-3 py-2 text-sm font-black text-white/82 backdrop-blur transition-colors hover:border-[#f3c548] hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a noticias
          </Link>

          <header className="mt-8">
            <NewsBadge category={item.category} />
            <h1 className="font-newsroom mt-5 max-w-5xl text-balance text-5xl font-black leading-[0.9] sm:text-6xl lg:text-8xl">
              {title}
            </h1>
            <time className="mt-5 block text-xs font-bold uppercase tracking-normal text-white/68">
              {formatDate(item.date)} · {club.name}
            </time>
            <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/84 sm:text-xl">
              {summary}
            </p>
          </header>
        </div>
      </section>

      <RevealSection>
        <article className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">

          <div className="alive-card relative mt-8 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
            <NewsVisual item={item} sizes="(min-width: 1024px) 896px, 100vw" priority />
          </div>

          {showBody && (
            <div className="prose prose-lg mt-10 max-w-none text-text">
              <p className="overflow-wrap-anywhere text-lg leading-9 text-muted">{body}</p>
            </div>
          )}
        </article>
      </RevealSection>
    </main>
  );
}
