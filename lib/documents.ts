export type OfficialDocument = {
  id: string;
  title: string;
  description: string;
  /** URL `/preview` para incrustar en iframe sin ERR_BLOCKED_BY_RESPONSE */
  previewUrl: string;
  /** Enlace para abrir o descargar fuera del visor */
  downloadUrl: string;
  type: "pdf" | "docx";
};

const ALLOWED_DOCUMENTS: Record<string, OfficialDocument> = {
  "modelo-scm": {
    id: "modelo-scm",
    title: "Modelo de Entrenamiento Deportivo SCM",
    description:
      "Metodología Sinergia Cognitivo-Motriz, sesión tipo, pilares de trabajo y macrociclo de 8 semanas.",
    previewUrl:
      "https://drive.google.com/file/d/1xwc1kk8BzHxsXg0Ntsxfdf_UkNmihop4/preview",
    downloadUrl:
      "https://drive.google.com/file/d/1xwc1kk8BzHxsXg0Ntsxfdf_UkNmihop4/view?usp=sharing",
    type: "pdf",
  },
  "proyecto-2026": {
    id: "proyecto-2026",
    title: "Proyecto Deportivo CDRS 2026",
    description:
      "Proyecto social, misión, visión, objetivos ODS, metodología por edades y plan de trabajo deportivo.",
    previewUrl:
      "https://docs.google.com/document/d/170ynpkZxi_YgzFbt32yFhNmSyr6Acb-S/preview",
    downloadUrl:
      "https://docs.google.com/document/d/170ynpkZxi_YgzFbt32yFhNmSyr6Acb-S/edit?usp=sharing",
    type: "docx",
  },
};

export const officialDocuments = Object.values(ALLOWED_DOCUMENTS);

export function getOfficialDocumentById(id: string): OfficialDocument | undefined {
  if (!id || !(id in ALLOWED_DOCUMENTS)) {
    return undefined;
  }

  return ALLOWED_DOCUMENTS[id];
}

export function getOfficialDocumentHref(id: string) {
  return `/documentos?id=${encodeURIComponent(id)}`;
}

export function getDocumentEmbedUrl(document: OfficialDocument) {
  return document.previewUrl;
}
