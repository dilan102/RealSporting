import type { OdsItem } from "@/lib/content";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOdsInfographicSvg(item: OdsItem) {
  const bulletRows = item.bullets
    .map((bullet, index) => {
      const y = 360 + index * 52;
      return `<text x="56" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#1a241f">${escapeXml(`${bullet.icon}  ${bullet.text}`)}</text>`;
    })
    .join("\n");

  const statRows = item.stats
    .map((stat, index) => {
      const x = 56 + index * 240;
      return `
        <text x="${x}" y="780" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="700" fill="${item.color}">${escapeXml(stat.value)}</text>
        <text x="${x}" y="812" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#4a5d50">${escapeXml(stat.label)}</text>
      `;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" role="img">
  <title>${escapeXml(item.infographicTitle)}</title>
  <rect width="800" height="1100" fill="#f8faf7"/>
  <rect width="800" height="148" fill="${item.color}"/>
  <text x="48" y="108" font-family="Arial Black, Arial, sans-serif" font-size="88" font-weight="700" fill="#ffffff">${item.number}</text>
  <text x="160" y="72" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#ffffff" opacity="0.92">${escapeXml(item.code)}</text>
  <text x="160" y="112" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">${escapeXml(item.title)}</text>
  <text x="48" y="196" font-family="Arial Black, Arial, sans-serif" font-size="26" font-weight="700" fill="${item.color}">${escapeXml(item.infographicTitle)}</text>
  <text x="48" y="248" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#1a241f">${escapeXml(item.shortText)}</text>
  <rect x="48" y="288" width="704" height="2" fill="${item.color}" opacity="0.35"/>
  <text x="48" y="328" font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="700" fill="#4a5d50">ACCIONES DEL CLUB</text>
  ${bulletRows}
  <rect x="48" y="720" width="704" height="2" fill="${item.color}" opacity="0.35"/>
  <text x="48" y="756" font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="700" fill="#4a5d50">ESTADÍSTICAS DEL CLUB</text>
  ${statRows}
  <rect x="48" y="860" width="704" height="120" rx="12" fill="${item.color}"/>
  <text x="72" y="900" font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="700" fill="#ffffff">OBJETIVO DEL CLUB</text>
  <text x="72" y="940" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#ffffff">${escapeXml(`«${item.clubObjective}»`)}</text>
  <text x="48" y="1020" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#4a5d50">Impacto esperado: ${escapeXml(item.impact)}</text>
  <text x="48" y="1060" font-family="Arial Black, Arial, sans-serif" font-size="16" font-weight="700" fill="${item.color}">Club Deportivo Real Sporting · Usme</text>
</svg>`;
}
