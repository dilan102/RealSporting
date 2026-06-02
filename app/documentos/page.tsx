import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye, FileText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import {
  getDocumentEmbedUrl,
  getOfficialDocumentById,
  officialDocuments,
} from "@/lib/documents";

export const metadata: Metadata = {
  title: "Documentos",
  description: "Visor de documentos oficiales del Club Deportivo Real Sporting.",
};

type DocumentPageProps = {
  searchParams: Promise<{ id?: string; archivo?: string }>;
};

export default async function DocumentPage({ searchParams }: DocumentPageProps) {
  const { id, archivo } = await searchParams;

  if (archivo) {
    notFound();
  }

  const document = getOfficialDocumentById(id ?? "") ?? officialDocuments[0];
  const viewerUrl = getDocumentEmbedUrl(document);

  return (
    <main className="bg-bg text-text">
      <PageHero
        title="Documentos"
        subtitle="Biblioteca institucional, modelo deportivo y proyecto CDRS 2026."
        eyebrow="Documentación oficial"
        image="/brand/gallery-team.jpg"
      />

      <section className="section-band border-b border-border">
        <div className="section-shell py-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Documento activo</p>
              <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
                {document.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                {document.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#visor"
                className="btn-green inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
              >
                Ver aquí
                <Eye size={17} aria-hidden="true" />
              </a>
              <a
                href={document.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
              >
                Abrir en Google
                <Download size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {officialDocuments.map((item) => {
              const active = item.id === document.id;

              return (
                <Link
                  key={item.id}
                  href={`/documentos?id=${encodeURIComponent(item.id)}`}
                  className={`premium-card-hover flex min-h-40 flex-col justify-between rounded-lg border p-5 ${
                    active
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-elevated"
                  }`}
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-accent/14 text-accent">
                    <FileText size={22} aria-hidden="true" />
                  </span>
                  <span className="mt-5 block">
                    <span className="block text-lg font-black">{item.title}</span>
                    <span className="mt-2 block text-sm leading-6 text-muted">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="visor" className="section-shell scroll-mt-28 py-8">
        <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm">
          <iframe
            title={`Vista previa: ${document.title}`}
            src={viewerUrl}
            className="h-[72vh] min-h-[520px] w-full bg-white"
            allow="autoplay"
          />
        </div>
        <div className="mt-6">
          <Link href="/contacto#documentos" className="text-sm font-black text-accent">
            Volver a documentos
          </Link>
        </div>
      </section>
    </main>
  );
}
