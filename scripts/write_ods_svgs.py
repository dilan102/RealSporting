#!/usr/bin/env python3
"""Genera SVG de infografías ODS en public/brand/ods/. Ejecutar: python3 scripts/write_ods_svgs.py"""

from pathlib import Path

ODS = [
    {
        "id": "ods-3",
        "number": 3,
        "code": "ODS 3",
        "title": "Salud y Bienestar",
        "color": "#4C9F38",
        "short": "Promovemos la salud física y emocional mediante la práctica constante del fútbol.",
        "infographic_title": "ODS 3 — Salud y Bienestar",
        "bullets": [
            "⚽ Entrenamientos semanales permanentes",
            "❤️ Promoción de hábitos saludables",
            "🧠 Bienestar emocional y confianza personal",
            "🏃 Desarrollo físico integral",
            "🤝 Prevención de riesgos sociales mediante el deporte",
        ],
        "stats": [("Semanal", "Entrenamientos"), ("7", "Categorías"), ("2022", "Proceso en Usme")],
        "objective": "Formar deportistas sanos física y emocionalmente",
        "impact": "Deportistas con hábitos activos y bienestar integral.",
    },
    {
        "id": "ods-4",
        "number": 4,
        "code": "ODS 4",
        "title": "Educación de Calidad",
        "color": "#C5192D",
        "short": "El fútbol fortalece valores, disciplina, liderazgo y habilidades para la vida.",
        "infographic_title": "ODS 4 — Educación de Calidad",
        "bullets": [
            "📚 Aprendizaje dentro y fuera de la cancha",
            "🗣 Desarrollo de comunicación efectiva",
            "⭐ Formación en liderazgo",
            "🤝 Trabajo en equipo",
            "🎯 Disciplina y responsabilidad",
            "⚽ Educación a través del deporte",
        ],
        "stats": [("5", "Valores"), ("100%", "Enfoque formativo"), ("Usme", "Proyección educativa")],
        "objective": "Formar personas íntegras con herramientas para la vida",
        "impact": "Competencias sociales y liderazgo transferibles.",
    },
    {
        "id": "ods-5",
        "number": 5,
        "code": "ODS 5",
        "title": "Igualdad de Género",
        "color": "#FF3A21",
        "short": "Espacios deportivos inclusivos con igualdad de oportunidades y respeto.",
        "infographic_title": "ODS 5 — Igualdad de Género",
        "bullets": [
            "👧 Participación femenina",
            "👦 Participación masculina en igualdad",
            "⚖️ Igualdad de oportunidades",
            "🤝 Respeto mutuo",
            "🚫 Cero discriminación",
            "⚽ Fútbol para todos",
        ],
        "stats": [("0", "Discriminación"), ("7", "Categorías"), ("100%", "Inclusión")],
        "objective": "Garantizar inclusión y respeto en cada espacio deportivo",
        "impact": "Mismas oportunidades para niñas y niños.",
    },
    {
        "id": "ods-10",
        "number": 10,
        "code": "ODS 10",
        "title": "Reducción de las Desigualdades",
        "color": "#DD1367",
        "short": "Oportunidades deportivas inclusivas y comunitarias en Usme.",
        "infographic_title": "ODS 10 — Reducción de las Desigualdades",
        "bullets": [
            "🌎 Inclusión para todos",
            "⚽ Acceso a procesos deportivos",
            "🤝 Integración comunitaria",
            "🏘 Participación territorial",
            "⭐ Desarrollo de talentos diversos",
            "🎯 Igualdad de oportunidades",
        ],
        "stats": [("Usme", "Territorio"), ("7", "Categorías"), ("6", "ODS priorizados")],
        "objective": "Abrir el deporte a distintos contextos en Usme",
        "impact": "Mayor inclusión y acceso equitativo.",
    },
    {
        "id": "ods-11",
        "number": 11,
        "code": "ODS 11",
        "title": "Ciudades y Comunidades Sostenibles",
        "color": "#FD9D24",
        "short": "Fortalecemos el tejido social de Usme mediante el deporte y las familias.",
        "infographic_title": "ODS 11 — Comunidades Sostenibles",
        "bullets": [
            "🏘 Fortalecimiento comunitario",
            "👨‍👩‍👧 Participación de las familias",
            "⚽ Espacios deportivos seguros",
            "🤝 Redes de apoyo social",
            "📍 Identidad territorial en Usme",
            "🌱 Construcción de comunidad",
        ],
        "stats": [("Usme", "Sede local"), ("Familias", "Vinculación"), ("2022", "Proceso comunitario")],
        "objective": "Consolidar comunidad, familia y territorio",
        "impact": "Comunidad más cohesionada.",
    },
    {
        "id": "ods-16",
        "number": 16,
        "code": "ODS 16",
        "title": "Paz, Justicia e Instituciones Sólidas",
        "color": "#00689D",
        "short": "Convivencia pacífica, respeto y juego limpio en la formación.",
        "infographic_title": "ODS 16 — Paz e Instituciones Sólidas",
        "bullets": [
            "🕊 Cultura de paz",
            "🤝 Respeto por los demás",
            "⚽ Juego limpio",
            "📋 Cumplimiento de normas",
            "🏘 Convivencia comunitaria",
            "🎯 Formación ciudadana responsable",
        ],
        "stats": [("100%", "Juego limpio"), ("5", "Valores"), ("Usme", "Convivencia")],
        "objective": "Formar deportistas comprometidos con la paz",
        "impact": "Cultura de respeto y resolución pacífica.",
    },
]


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def build_svg(item: dict) -> str:
    bullets = "\n".join(
        f'  <text x="56" y="{360 + i * 48}" font-family="Arial, sans-serif" font-size="20" fill="#1a241f">{esc(b)}</text>'
        for i, b in enumerate(item["bullets"])
    )
    stats = "\n".join(
        f'  <text x="{56 + i * 240}" y="780" font-family="Arial Black, sans-serif" font-size="32" font-weight="700" fill="{item["color"]}">{esc(v)}</text>'
        f'  <text x="{56 + i * 240}" y="810" font-family="Arial, sans-serif" font-size="15" fill="#4a5d50">{esc(l)}</text>'
        for i, (v, l) in enumerate(item["stats"])
    )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
  <rect width="800" height="1100" fill="#f8faf7"/>
  <rect width="800" height="140" fill="{item["color"]}"/>
  <text x="48" y="100" font-family="Arial Black, sans-serif" font-size="80" font-weight="700" fill="#fff">{item["number"]}</text>
  <text x="150" y="68" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#fff">{esc(item["code"])}</text>
  <text x="150" y="108" font-family="Arial Black, sans-serif" font-size="30" font-weight="700" fill="#fff">{esc(item["title"])}</text>
  <text x="48" y="188" font-family="Arial Black, sans-serif" font-size="24" fill="{item["color"]}">{esc(item["infographic_title"])}</text>
  <text x="48" y="232" font-family="Arial, sans-serif" font-size="19" fill="#1a241f">{esc(item["short"])}</text>
  <text x="48" y="312" font-family="Arial Black, sans-serif" font-size="17" fill="#4a5d50">ACCIONES DEL CLUB</text>
{bullets}
  <text x="48" y="748" font-family="Arial Black, sans-serif" font-size="17" fill="#4a5d50">ESTADÍSTICAS DEL CLUB</text>
{stats}
  <rect x="48" y="850" width="704" height="110" rx="10" fill="{item["color"]}"/>
  <text x="72" y="888" font-family="Arial Black, sans-serif" font-size="16" fill="#fff">OBJETIVO DEL CLUB</text>
  <text x="72" y="928" font-family="Arial, sans-serif" font-size="21" fill="#fff">{esc("«" + item["objective"] + "»")}</text>
  <text x="48" y="1000" font-family="Arial, sans-serif" font-size="17" fill="#4a5d50">Impacto: {esc(item["impact"])}</text>
  <text x="48" y="1040" font-family="Arial Black, sans-serif" font-size="15" fill="{item["color"]}">Club Deportivo Real Sporting · Usme</text>
</svg>
"""


def main() -> None:
    out = Path(__file__).resolve().parents[1] / "public" / "brand" / "ods"
    out.mkdir(parents=True, exist_ok=True)
    for item in ODS:
        path = out / f"{item['id']}-infografia.svg"
        path.write_text(build_svg(item), encoding="utf-8")
        print("Wrote", path.name)


if __name__ == "__main__":
    main()
