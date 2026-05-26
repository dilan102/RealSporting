import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsBadge, NewsVisual } from "@/components/news/NewsVisual";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { readNews } from "@/lib/news-store";

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
    title: item.title,
    description: item.summary,
  };
}

export default async function NoticiaDetallePage({ params }: Props) {
  const { id } = await params;
  const items = await readNews();
  const item = items.find((news) => news.id === id);

  if (!item) {
    notFound();
  }

  return (
    <main className="bg-bg pt-20 text-text">
      <RevealSection>
        <article className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm font-black text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a noticias
          </Link>

          <header className="mt-8">
            <NewsBadge category={item.category} />
            <h1 className="mt-5 text-[4rem] font-black leading-[0.86] sm:text-[6rem]">
              {item.title}
            </h1>
            <time className="mt-5 block text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {formatDate(item.date)} · {club.name}
            </time>
            <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-muted">
              {item.summary}
            </p>
          </header>

          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
            <NewsVisual item={item} sizes="(min-width: 1024px) 896px, 100vw" priority />
          </div>

          <div className="prose prose-lg mt-10 max-w-none text-text">
            <p className="text-lg leading-9 text-muted">{item.body}</p>
          </div>
        </article>
      </RevealSection>
    </main>
  );
}
