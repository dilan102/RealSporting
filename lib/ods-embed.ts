import type { OdsItem } from "@/lib/content";
import { odsDrivePreviewUrl } from "@/lib/ods-drive";

export type OdsEmbedKind = "pdf" | "image";

type OdsEmbedSource = {
  src: string;
  kind: OdsEmbedKind;
};

/** PDF/PNG locales en public/ODS (carga rápida en el visor). */
const ODS_LOCAL_EMBED: Record<string, OdsEmbedSource> = {
  "ods-3": {
    src: "/ODS/2309739_S_SDG_2023_infographics_3-3.pdf",
    kind: "pdf",
  },
  "ods-4": {
    src: "/ODS/ods4-instantanea_ODS4-5.png",
    kind: "image",
  },
  "ods-5": {
    src: "/ODS/2309739_S_SDG_2023_infographics_5-5.pdf",
    kind: "pdf",
  },
  "ods-10": {
    src: "/ODS/2309739_S_SDG_2023_infographics_10-10.pdf",
    kind: "pdf",
  },
  "ods-11": {
    src: "/ODS/2309739_S_SDG_2023_infographics_11-11.pdf",
    kind: "pdf",
  },
  "ods-16": {
    src: "/ODS/2309739_S_SDG_2023_infographics_16-16.pdf",
    kind: "pdf",
  },
};

export function getOdsEmbedSource(item: OdsItem): OdsEmbedSource {
  return ODS_LOCAL_EMBED[item.id] ?? { src: odsDrivePreviewUrl(item.documentUrl), kind: "pdf" };
}

export function odsPdfViewerSrc(path: string) {
  return `${path}#view=FitH&toolbar=0`;
}
