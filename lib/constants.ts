export {
  SITE_URL,
  WHATSAPP_NUMBER,
  PHONE_DISPLAY,
  PHONE_TEL,
  CONTACT_EMAIL,
  OG_IMAGE_PATH,
  OG_IMAGE_URL,
  NEWS_FALLBACK_IMAGE,
  DEFAULT_WHATSAPP_MESSAGE,
  buildWhatsAppUrl,
  siteMetadata,
  pageOpenGraph,
} from "@/lib/site";

import { buildWhatsAppUrl } from "@/lib/site";

/** URL completa de WhatsApp con mensaje prellenado para inscripciones. */
export const WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Real Sporting, quiero información sobre inscripciones generales.",
);

export const CLUB_NAME = "Club Deportivo Real Sporting";

export const VENUE_NAME = "Parque Ciudadela Nuevo Usme";
export const VENUE_ADDRESS = "Parque Ciudadela Nuevo Usme, Usme, Bogotá D.C., Colombia";
