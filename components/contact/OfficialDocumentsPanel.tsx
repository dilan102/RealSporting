"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText, X } from "lucide-react";
import {
  getDocumentEmbedUrl,
  getOfficialDocumentById,
  officialDocuments,
  type OfficialDocument,
} from "@/lib/documents";

type OfficialDocumentsPanelProps = {
  /** Si se indica, solo se muestran estos documentos (por id). */
  documentIds?: string[];
};

export function OfficialDocumentsPanel({ documentIds }: OfficialDocumentsPanelProps = {}) {
  const documents = useMemo<OfficialDocument[]>(() => {
    if (!documentIds?.length) {
      return officialDocuments;
    }

    return officialDocuments.filter((document) => documentIds.includes(document.id));
  }, [documentIds]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeDocument = useMemo(
    () => (activeId ? getOfficialDocumentById(activeId) : undefined),
    [activeId],
  );

  const viewerSrc = useMemo(() => {
    if (!activeDocument) {
      return "";
    }

    return getDocumentEmbedUrl(activeDocument);
  }, [activeDocument]);

  const openDocument = (id: string) => {
    setActiveId(id);
    window.setTimeout(() => {
      document.getElementById("visor-documentos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  return (
    <div className="mt-8 space-y-6">
      <div
        className={`grid gap-5 ${documents.length === 1 ? "max-w-2xl" : "md:grid-cols-2"}`}
      >
        {documents.map((document) => {
          const isActive = activeId === document.id;

          return (
            <button
              key={document.id}
              type="button"
              onClick={() => openDocument(document.id)}
              className={`light-panel group flex min-h-48 w-full flex-col justify-between rounded-lg border p-6 text-left text-text shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg sm:p-7 ${
                isActive
                  ? "border-[var(--accent-gold)] ring-2 ring-[color-mix(in_srgb,var(--accent-gold)_35%,transparent)]"
                  : "border-border bg-bg hover:border-[var(--accent-gold)]"
              }`}
            >
              <span className="grid size-12 place-items-center rounded-lg bg-[var(--accent-green)] text-white transition-all duration-300 ease-in-out group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--button-text)]">
                <FileText size={24} aria-hidden="true" />
              </span>
              <span className="mt-7 block">
                <h3 className="text-xl font-black">{document.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {document.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-accent">
                  <Eye size={16} aria-hidden="true" />
                  Ver aquí
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {activeDocument && viewerSrc && (
        <div
          id="visor-documentos"
          className="scroll-mt-28 overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-normal text-accent">
                Visor integrado
              </p>
              <p className="truncate text-sm font-black">{activeDocument.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={activeDocument.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-black sm:text-sm"
              >
                Abrir en Google
                <Download size={15} aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-xs font-black text-muted transition-colors hover:border-accent hover:text-text sm:text-sm"
                aria-label="Cerrar visor de documento"
              >
                Cerrar
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
          <iframe
            title={`Vista previa: ${activeDocument.title}`}
            src={viewerSrc}
            className="h-[72vh] min-h-[520px] w-full bg-white"
            allow="autoplay"
          />
        </div>
      )}
    </div>
  );
}
