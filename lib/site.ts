export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://real-sporting.vercel.app";

export const WHATSAPP_NUMBER = "573209059855";
export const PHONE_DISPLAY = "+57 320 905 9855";
export const PHONE_TEL = "tel:+573209059855";
export const CONTACT_EMAIL = "realsportingdeusmeed@gmail.com";

export const OG_IMAGE_PATH = "/banner.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const NEWS_FALLBACK_IMAGE = "/brand/gallery-team.jpg";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola Real Sporting, quiero información sobre inscripciones.";

export function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const siteMetadata = {
  twitter: {
    card: "summary_large_image" as const,
  },
  openGraph: {
    type: "website" as const,
    locale: "es_CO",
    siteName: "Club Deportivo Real Sporting",
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "Club Deportivo Real Sporting" }],
  },
};

export function pageOpenGraph(title: string, description?: string) {
  return {
    title,
    description,
    ...siteMetadata.openGraph,
    images: siteMetadata.openGraph.images,
  };
}
