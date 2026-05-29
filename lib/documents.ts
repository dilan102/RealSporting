export type OfficialDocument = {
  id: string;
  title: string;
  description: string;
  filePath: string;
  type: "pdf" | "docx";
};

const ALLOWED_DOCUMENTS: Record<string, OfficialDocument> = {
  "modelo-scm": {
    id: "modelo-scm",
    title: "Modelo de Entrenamiento Deportivo SCM",
    description:
      "Metodología Sinergia Cognitivo-Motriz, sesión tipo, pilares de trabajo y macrociclo de 8 semanas.",
    filePath: "/MODELO DE ENTRENAMIENTO DEPORTIVO SCM.pdf",
    type: "pdf",
  },
  "proyecto-2026": {
    id: "proyecto-2026",
    title: "Proyecto Deportivo CDRS 2026",
    description:
      "Proyecto social, misión, visión, objetivos ODS, metodología por edades y plan de trabajo deportivo.",
    filePath: "/Proyecto Deportivo CDRS 2026.docx",
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
