"use client";

/** Sede: Parque Ciudadela Nuevo Usme — 4.4720909, -74.1258881 */
export const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=4.4720909,-74.1258881&hl=es&z=17&output=embed";

export default function MapEmbed() {
  return (
    <iframe
      src={MAP_EMBED_SRC}
      width="100%"
      height="300"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Sede Club Deportivo Real Sporting — Parque Ciudadela Nuevo Usme"
    />
  );
}
