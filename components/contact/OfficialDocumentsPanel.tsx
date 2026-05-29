"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText, X } from "lucide-react";
import {
  getOfficialDocumentById,
  officialDocuments,
  type OfficialDocument,
} from "@/lib/documents";

function buildViewerSrc(document: OfficialDocument, origin: string) {
  const fileUrl = `${origin}${encodeURI(document.filePath)}`;

  if (document.type === "pdf") {
    return fileUrl;
  }

  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

export function OfficialDocumentsPanel() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeDocument = useMemo(
    () => (activeId ? getOfficialDocumentById(activeId) : undefined),
    [activeId],
  );

  const viewerSrc = useMemo(() => {
    if (!activeDocument || typeof window === "undefined") {
      return "";
    }

    return buildViewerSrc(activeDocument, window.location.origin);
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
      <div className="grid gap-5 md:grid-cols-2">
        {officialDocuments.map((document) => {
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
              <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                Visor integrado
              </p>
              <p className="truncate text-sm font-black">{activeDocument.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={encodeURI(activeDocument.filePath)}
                download
                className="btn-gold inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-black sm:text-sm"
              >
                Descargar
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
            title={activeDocument.title}
            src={viewerSrc}
            className="h-[72vh] min-h-[520px] w-full bg-white"
          />
        </div>
      )}
    </div>
  );
}
