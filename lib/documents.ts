export const officialDocuments = [
  {
    title: "Modelo de Entrenamiento Deportivo SCM",
    description:
      "Metodologia Sinergia Cognitivo-Motriz, sesion tipo, pilares de trabajo y macrociclo de 8 semanas.",
    href: "/MODELO%20DE%20ENTRENAMIENTO%20DEPORTIVO%20SCM.pdf",
    type: "pdf",
  },
  {
    title: "Proyecto Deportivo CDRS 2026",
    description:
      "Proyecto social, mision, vision, objetivos ODS, metodologia por edades y plan de trabajo deportivo.",
    href: "/Proyecto%20Deportivo%20CDRS%202026.docx",
    type: "docx",
  },
] as const;

export function getOfficialDocument(href: string) {
  return officialDocuments.find((document) => document.href === href);
}
