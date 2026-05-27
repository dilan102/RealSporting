import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { getOfficialDocument, officialDocuments } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Documentos",
  description: "Visor de documentos oficiales del Club Deportivo Real Sporting.",
};

type DocumentPageProps = {
  searchParams: Promise<{ archivo?: string }>;
};

export default async function DocumentPage({ searchParams }: DocumentPageProps) {
  const { archivo } = await searchParams;
  const document = getOfficialDocument(archivo ?? "") ?? officialDocuments[0];
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const absoluteUrl = host ? `${protocol}://${host}${document.href}` : document.href;
  const viewerUrl =
    document.type === "docx"
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`
      : document.href;

  return (
    <div className="bg-bg pt-24 text-text sm:pt-28">
      <section className="border-b border-border bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-accent-secondary">
            Documentacion oficial
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
              <a
                href="#visor"
                className="btn-green inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
              >
                Ver aqui
                <Eye size={17} aria-hidden="true" />
              </a>
              <a
                href={document.href}
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
        {document.type === "docx" && (
          <p className="mt-4 rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm text-muted">
            La vista previa de Word usa el visor de Microsoft y necesita que el
            archivo este disponible en una URL publica. En local puedes usar Descargar.
          </p>
        )}
        <div className="mt-6">
          <Link href="/contacto#documentos" className="text-sm font-black text-accent">
            Volver a documentos
          </Link>
        </div>
      </section>
    </div>
  );
}
