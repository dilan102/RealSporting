import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye } from "lucide-react";
import { getOfficialDocumentById, officialDocuments } from "@/lib/documents";

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
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const encodedPath = encodeURI(document.filePath);
  const absoluteUrl = host ? `${protocol}://${host}${encodedPath}` : encodedPath;
  const viewerUrl =
    document.type === "docx"
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`
      : encodedPath;

  return (
    <div className="bg-bg pt-24 text-text sm:pt-28">
      <section className="border-b border-border bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-accent-secondary">
            Documentación oficial
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                {document.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                {document.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {document.type === "pdf" && (
                <a
                  href="#visor"
                  className="btn-green inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
                >
                  Ver aquí
                  <Eye size={17} aria-hidden="true" />
                </a>
              )}
              <a
                href={encodedPath}
                download
                className="btn-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
              >
                Descargar
                <Download size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="visor" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm">
          <iframe
            title={document.title}
            src={viewerUrl}
            className="h-[72vh] min-h-[520px] w-full bg-white"
          />
        </div>
        <div className="mt-6">
          <Link href="/contacto#documentos" className="text-sm font-black text-accent">
            Volver a documentos
          </Link>
        </div>
      </section>
    </div>
  );
}
