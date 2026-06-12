import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes = [
  "",
  "/club",
  "/equipo",
  "/entrenamientos",
  "/torneos",
  "/noticias",
  "/contacto",
  "/documentos",
  "/formulario-miembros-2026",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency:
      route === "" || route === "/noticias" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.72,
  }));
}
