export const club = {
  name: "Club Deportivo Real Sporting",
  tagline:
    "Formación deportiva integral, disciplina competitiva y proyección humana desde Usme",
  mission:
    "El Club Deportivo Real Sporting tiene como misión formar integralmente niños, niñas y jóvenes mediante procesos deportivos de alta calidad, promoviendo valores, disciplina, liderazgo, trabajo en equipo y desarrollo humano a través del fútbol como herramienta de transformación social, inclusión y proyección profesional.",
  vision:
    "Ser un club deportivo reconocido a nivel distrital y nacional por su excelencia formativa, impacto social y proyección competitiva, consolidándose como una institución referente en el desarrollo deportivo y humano de nuevas generaciones.",
  about: {
    lead:
      "Desde Usme, el Club Deportivo Real Sporting articula fútbol sala, formación humana y pertenencia territorial para niños, niñas y jóvenes que buscan crecer con método, acompañamiento y proyección.",
    paragraphs: [
      "Nacimos en 2022 con la convicción de que el deporte puede ser un espacio seguro de aprendizaje, convivencia y oportunidades. Cada proceso combina planificación técnica, seguimiento por categorías y trabajo cercano con familias, cuerpo técnico y comunidad.",
      "Nuestro modelo integra la metodología SCM (Sinergia Cognitivo-Motriz), valores institucionales y un proyecto deportivo alineado con el desarrollo sostenible. No solo entrenamos para competir: formamos hábitos, liderazgo, resiliencia y sentido de pertenencia que acompañan el proyecto de vida de cada integrante.",
      "Hoy consolidamos categorías formativas, participación en torneos de proyección y una presencia digital que facilita la inscripción, la comunicación y la transparencia institucional hacia las familias de la UPZ 61 y el territorio.",
    ],
  },
  values: [
    {
      title: "Disciplina",
      description:
        "Cumplimiento, constancia y responsabilidad en el entrenamiento, el estudio y la convivencia dentro y fuera de la cancha.",
    },
    {
      title: "Comunidad",
      description:
        "Articulamos familias, cuerpo técnico, aliados y territorio para fortalecer un entorno deportivo seguro e incluyente.",
    },
    {
      title: "Excelencia",
      description:
        "Trabajamos con planificación, seguimiento y mejora continua en cada sesión, partido y decisión técnica.",
    },
    {
      title: "Respeto",
      description:
        "Promovemos juego limpio, comunicación asertiva y reconocimiento del rival, árbitros, cuerpo técnico y comunidad.",
    },
    {
      title: "Formación",
      description:
        "Priorizamos el desarrollo humano, deportivo y competitivo de cada integrante del proceso formativo.",
    },
  ],
  milestones: [
    {
      period: "Marzo 2022",
      title: "Arranque del proyecto",
      event:
        "Consolidación del club y apertura del primer proceso formativo en Usme, con énfasis en inclusión y formación integral.",
    },
    {
      period: "Agosto 2022",
      title: "Estructura por categorías",
      event:
        "Organización de grupos infantiles y juveniles con planificación técnica, convivencia y seguimiento familiar.",
    },
    {
      period: "2023",
      title: "Proyección competitiva",
      event:
        "Participación en torneos locales que fortalecen experiencia de juego, disciplina y comportamiento en competencia.",
    },
    {
      period: "2024-2025",
      title: "Consolidación formativa",
      event:
        "Continuidad del proceso, maduración de categorías y consolidación de una cultura deportiva estable en el territorio.",
    },
    {
      period: "2026",
      title: "Renovación institucional",
      event:
        "Actualización metodológica, digital y del proyecto CDRS 2026, con inscripción en línea y documentación oficial accesible.",
    },
  ],
};

import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/site";

export const social = {
  instagram: "https://www.instagram.com/realsportingdeusme/",
  facebook: "https://www.facebook.com/profile.php?id=100091922545253",
  email: CONTACT_EMAIL,
  phone: PHONE_DISPLAY,
  location: "Parque Ciudadela Nuevo Usme, Usme, Bogotá D.C., Colombia",
};

export const institutionalStats = [
  { value: "2022", label: "Inicio del proceso", detail: "Trabajo formativo desde Usme" },
  { value: "7", label: "Categorías", detail: "Rangos por año de nacimiento" },
  { value: "6", label: "ODS priorizados", detail: "Salud, educación, igualdad e inclusión" },
  { value: "2026", label: "Proyección", detail: "Renovación metodológica y digital" },
];

export const sportCategoryCards = [
  {
    id: "2020-2019",
    name: "Pre-Benjamín",
    range: "2020-2019",
    description: "Iniciación motriz, juego guiado, confianza y vínculo positivo con el balón.",
    image: "/brand/gallery-youth.jpg",
  },
  {
    id: "2018-2017",
    name: "Benjamín",
    range: "2018-2017",
    description: "Fundamentos técnicos, cooperación, lectura básica del juego y hábitos de equipo.",
    image: "/brand/gallery-team.jpg",
  },
  {
    id: "2016-2015",
    name: "Alevín",
    range: "2016-2015",
    description: "Perfeccionamiento técnico, toma de decisiones y comunicación en cancha.",
    image: "/brand/hero-training.jpg",
  },
  {
    id: "2014-2013",
    name: "Infantil",
    range: "2014-2013",
    description: "Consolidación táctica, preparación física general y responsabilidad competitiva.",
    image: "/brand/gallery-night.jpg",
  },
  {
    id: "2012-2011",
    name: "Cadete",
    range: "2012-2011",
    description: "Especialización inicial, seguimiento por posición y rendimiento formativo.",
    image: "/brand/gallery-team.jpg",
  },
  {
    id: "2010-2009",
    name: "Juvenil",
    range: "2010-2009",
    description: "Alta exigencia formativa, lectura de juego y preparación para competencia.",
    image: "/brand/gallery-night.jpg",
  },
  {
    id: "2008-2007",
    name: "Sub-20",
    range: "2008-2007",
    description: "Proyección competitiva, liderazgo y madurez deportiva dentro del proceso.",
    image: "/brand/hero-training.jpg",
  },
];

export type OdsDocumentType = "pdf" | "image";

export type OdsItem = {
  id: string;
  number: number;
  code: string;
  title: string;
  /** Color institucional oficial del ODS (ONU) */
  color: string;
  image: string;
  /** Infografía o documento oficial en public/ODS */
  documentUrl: string;
  documentType: OdsDocumentType;
  shortText: string;
  /** Texto breve en el reverso de la tarjeta */
  backText: string;
  detail: string;
  infographicTitle: string;
  bullets: { icon: string; text: string }[];
  clubObjective: string;
  stats: { value: string; label: string }[];
  impact: string;
};

export const odsClosingPhrase =
  "El deporte transforma vidas, fortalece comunidades y construye un mejor futuro para Usme.";

export const odsItems: OdsItem[] = [
  {
    id: "ods-3",
    number: 3,
    code: "ODS 3",
    title: "Salud y Bienestar",
    color: "#4C9F38",
    image: "/brand/ods/ODS-3.png",
    documentUrl:
      "https://drive.google.com/file/d/1hB5VEWfRI7J7uMxJh5iitAOWuS-kX5us/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "Promovemos la salud física y emocional mediante la práctica constante del fútbol, fortaleciendo hábitos saludables y el bienestar integral de nuestros deportistas.",
    backText:
      "El deporte como herramienta de desarrollo saludable. Entrenamientos regulares y acompañamiento formativo fortalecen bienestar físico, mental y emocional.",
    detail:
      "El Club Deportivo Real Sporting entiende el deporte como una herramienta fundamental para el desarrollo saludable de niños, niñas y jóvenes. A través de entrenamientos regulares, actividad física estructurada y acompañamiento formativo, se fortalecen hábitos que contribuyen al bienestar físico, mental y emocional. La práctica deportiva también ayuda a prevenir factores de riesgo asociados al sedentarismo, la violencia y el aislamiento social, promoviendo estilos de vida activos y saludables.",
    infographicTitle: "ODS 3 — Salud y Bienestar",
    bullets: [
      { icon: "⚽", text: "Entrenamientos semanales permanentes" },
      { icon: "❤️", text: "Promoción de hábitos saludables" },
      { icon: "🧠", text: "Bienestar emocional y confianza personal" },
      { icon: "🏃", text: "Desarrollo físico integral" },
      { icon: "🤝", text: "Prevención de riesgos sociales mediante el deporte" },
    ],
    clubObjective: "Formar deportistas sanos física y emocionalmente",
    stats: [
      { value: "Semanal", label: "Entrenamientos permanentes" },
      { value: "7", label: "Categorías formativas" },
      { value: "2022", label: "Proceso activo en Usme" },
    ],
    impact:
      "Deportistas con hábitos activos, bienestar integral y menor exposición a riesgos sociales.",
  },
  {
    id: "ods-4",
    number: 4,
    code: "ODS 4",
    title: "Educación de Calidad",
    color: "#C5192D",
    image: "/brand/ods/ODS-4.png",
    documentUrl:
      "https://drive.google.com/file/d/1nJYugoSwv9s1LyZv1mRjPl0rjY1HJp90/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "El fútbol se convierte en un espacio de aprendizaje donde se fortalecen valores, disciplina, liderazgo y habilidades para la vida.",
    backText:
      "Aprendizaje más allá del deporte: comunicación, trabajo en equipo, responsabilidad y toma de decisiones. Complementa educación académica con experiencias prácticas.",
    detail:
      "Cada sesión de entrenamiento representa una oportunidad para aprender más allá del deporte. Los participantes desarrollan capacidades como la comunicación efectiva, el trabajo en equipo, la responsabilidad y la toma de decisiones. El proceso formativo contribuye al crecimiento personal y complementa la educación académica mediante experiencias prácticas que fortalecen competencias sociales y ciudadanas.",
    infographicTitle: "ODS 4 — Educación de Calidad",
    bullets: [
      { icon: "📚", text: "Aprendizaje dentro y fuera de la cancha" },
      { icon: "🗣", text: "Desarrollo de comunicación efectiva" },
      { icon: "⭐", text: "Formación en liderazgo" },
      { icon: "🤝", text: "Trabajo en equipo" },
      { icon: "🎯", text: "Disciplina y responsabilidad" },
      { icon: "⚽", text: "Educación a través del deporte" },
    ],
    clubObjective: "Formar personas íntegras con herramientas para la vida",
    stats: [
      { value: "5", label: "Valores del proceso" },
      { value: "100%", label: "Sesiones con enfoque formativo" },
      { value: "Usme", label: "Proyección educativa territorial" },
    ],
    impact:
      "Jóvenes con competencias sociales, liderazgo y disciplina transferibles a la vida cotidiana.",
  },
  {
    id: "ods-5",
    number: 5,
    code: "ODS 5",
    title: "Igualdad de Género",
    color: "#FF3A21",
    image: "/brand/ods/ODS-5.png",
    documentUrl:
      "https://drive.google.com/file/d/1qO4OWTQiQwK7Nh4aTKI-5v68yFtYolUU/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "Promovemos espacios deportivos inclusivos donde todas las personas puedan participar con igualdad de oportunidades y respeto.",
    backText:
      "Ambiente seguro donde niñas, niños y jóvenes desarrollan capacidades sin discriminación. Acceso equitativo fortalece cultura de respeto, inclusión y participación.",
    detail:
      "El club fomenta un ambiente seguro y respetuoso donde niñas, niños y jóvenes pueden desarrollar sus capacidades deportivas sin discriminación. La igualdad de género se fortalece mediante el acceso equitativo a procesos formativos, actividades deportivas y oportunidades de participación, contribuyendo a la construcción de una cultura de respeto e inclusión.",
    infographicTitle: "ODS 5 — Igualdad de Género",
    bullets: [
      { icon: "👧", text: "Participación femenina en el deporte" },
      { icon: "👦", text: "Participación masculina en igualdad" },
      { icon: "⚖️", text: "Igualdad de oportunidades" },
      { icon: "🤝", text: "Respeto mutuo" },
      { icon: "🚫", text: "Cero discriminación" },
      { icon: "⚽", text: "Fútbol para todos" },
    ],
    clubObjective: "Garantizar inclusión y respeto en cada espacio deportivo",
    stats: [
      { value: "0", label: "Tolerancia a la discriminación" },
      { value: "7", label: "Categorías abiertas al acceso" },
      { value: "100%", label: "Enfoque inclusivo" },
    ],
    impact:
      "Entornos deportivos seguros donde niñas y niños participan con las mismas oportunidades.",
  },
  {
    id: "ods-10",
    number: 10,
    code: "ODS 10",
    title: "Reducción de las Desigualdades",
    color: "#DD1367",
    image: "/brand/ods/ODS-10.png",
    documentUrl:
      "https://drive.google.com/file/d/1Vqoqwsm_hH3QmkN3ptQI2TOwmsuxKTW8/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "Generamos oportunidades deportivas para niños, niñas y jóvenes de diferentes contextos sociales mediante un enfoque inclusivo y comunitario.",
    backText:
      "Reducimos barreras de acceso a formación deportiva y reconocemos diversidad como fortaleza. El deporte impulsa integración social, igualdad de oportunidades y desarrollo de capacidades.",
    detail:
      "El club trabaja para reducir barreras de acceso a la formación deportiva, ofreciendo espacios de participación donde la diversidad es reconocida como una fortaleza. A través del deporte se promueve la integración social, la igualdad de oportunidades y el desarrollo de capacidades personales que fortalecen la inclusión dentro de la comunidad.",
    infographicTitle: "ODS 10 — Reducción de las Desigualdades",
    bullets: [
      { icon: "🌎", text: "Inclusión para todos" },
      { icon: "⚽", text: "Acceso a procesos deportivos" },
      { icon: "🤝", text: "Integración comunitaria" },
      { icon: "🏘", text: "Participación territorial" },
      { icon: "⭐", text: "Desarrollo de talentos diversos" },
      { icon: "🎯", text: "Igualdad de oportunidades" },
    ],
    clubObjective: "Abrir el deporte a niños y jóvenes de distintos contextos en Usme",
    stats: [
      { value: "Usme", label: "Enfoque territorial" },
      { value: "7", label: "Categorías por edad" },
      { value: "6", label: "ODS priorizados" },
    ],
    impact:
      "Mayor inclusión social y acceso equitativo a oportunidades deportivas en el territorio.",
  },
  {
    id: "ods-11",
    number: 11,
    code: "ODS 11",
    title: "Ciudades y Comunidades Sostenibles",
    color: "#FD9D24",
    image: "/brand/ods/ODS-11.png",
    documentUrl:
      "https://drive.google.com/file/d/14581c-L3QqlDVTU_qSFw2NJqW4LtcFje/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "Fortalecemos el tejido social de Usme mediante el deporte, la participación familiar y el sentido de pertenencia comunitaria.",
    backText:
      "Construimos comunidades más cohesionadas con espacios deportivos seguros y participativos. Vinculación de familias, entrenadores y deportistas fortalece redes de apoyo y convivencia.",
    detail:
      "El club contribuye a la construcción de comunidades más cohesionadas a través de espacios deportivos seguros y participativos. La vinculación de familias, entrenadores y deportistas fortalece las redes de apoyo comunitario, promueve la convivencia y genera un impacto positivo en el territorio.",
    infographicTitle: "ODS 11 — Comunidades Sostenibles",
    bullets: [
      { icon: "🏘", text: "Fortalecimiento comunitario" },
      { icon: "👨‍👩‍👧", text: "Participación de las familias" },
      { icon: "⚽", text: "Espacios deportivos seguros" },
      { icon: "🤝", text: "Redes de apoyo social" },
      { icon: "📍", text: "Identidad territorial en Usme" },
      { icon: "🌱", text: "Construcción de comunidad" },
    ],
    clubObjective: "Consolidar comunidad, familia y territorio alrededor del deporte",
    stats: [
      { value: "Usme", label: "Sede y pertenencia local" },
      { value: "Familias", label: "Vinculación activa" },
      { value: "2022", label: "Proceso comunitario" },
    ],
    impact:
      "Comunidad más cohesionada con redes de apoyo y participación en el territorio.",
  },
  {
    id: "ods-16",
    number: 16,
    code: "ODS 16",
    title: "Paz, Justicia e Instituciones Sólidas",
    color: "#00689D",
    image: "/brand/ods/ODS-16.png",
    documentUrl:
      "https://drive.google.com/file/d/1N-Ti6p7xv7oTM1KJL1ka-z24z18kWXOY/view?usp=sharing",
    documentType: "pdf",
    shortText:
      "Promovemos la convivencia pacífica, el respeto y el juego limpio como principios fundamentales de la formación deportiva.",
    backText:
      "El deporte fortalece resolución pacífica de conflictos, tolerancia y respeto por las reglas. Juego limpio y convivencia forman deportistas comprometidos con la paz.",
    detail:
      "La práctica deportiva permite fortalecer valores relacionados con la resolución pacífica de conflictos, la tolerancia y el respeto por las reglas. A través del juego limpio y la convivencia, el club contribuye a formar ciudadanos comprometidos con la paz, la participación y la construcción de entornos más seguros.",
    infographicTitle: "ODS 16 — Paz e Instituciones Sólidas",
    bullets: [
      { icon: "🕊", text: "Cultura de paz" },
      { icon: "🤝", text: "Respeto por los demás" },
      { icon: "⚽", text: "Juego limpio" },
      { icon: "📋", text: "Cumplimiento de normas" },
      { icon: "🏘", text: "Convivencia comunitaria" },
      { icon: "🎯", text: "Formación ciudadana responsable" },
    ],
    clubObjective: "Formar deportistas y ciudadanos comprometidos con la paz",
    stats: [
      { value: "100%", label: "Énfasis en juego limpio" },
      { value: "5", label: "Valores institucionales" },
      { value: "Usme", label: "Convivencia territorial" },
    ],
    impact:
      "Cultura de respeto, diálogo y resolución pacífica de conflictos en la cancha y la comunidad.",
  },
];

export const scmTrainingModel = [
  {
    title: "Motricidad",
    text: "Alfabetización motora, apoyos, orientación espacial, coordinación y toma de decisiones con estímulos variables.",
  },
  {
    title: "Físico",
    text: "Potencia metabólica, fuerza funcional, prevención de lesiones y sprints repetidos con transferencia inmediata al juego.",
  },
  {
    title: "Técnica-táctica",
    text: "Micro-situaciones de caos controlado, superioridades, finalización bajo presión y lectura del espacio en fútbol sala.",
  },
  {
    title: "Macrociclo SCM",
    text: "Plan de 8 semanas con bloques de cimentación, caos, alta intensidad y maestría competitiva.",
  },
] as const;

export const registrationSteps = [
  {
    step: "01",
    title: "Formulario",
    text: "Envía los datos del aspirante y el canal de contacto familiar.",
  },
  {
    step: "02",
    title: "Documentación",
    text: "Revisa requisitos, modelo deportivo y documentos institucionales.",
  },
  {
    step: "03",
    title: "Confirmación",
    text: "El club responde por correo o WhatsApp para orientar el ingreso.",
  },
];

export const galleryItems = [
  {
    title: "Disciplina diaria",
    category: "Entrenamiento",
    image: "/brand/hero-training.jpg",
  },
  {
    title: "Formación de base",
    category: "Cantera",
    image: "/brand/gallery-youth.jpg",
  },
  {
    title: "Trabajo en equipo",
    category: "Comunidad",
    image: "/brand/gallery-team.jpg",
  },
  {
    title: "Competencia con carácter",
    category: "Proyección",
    image: "/brand/gallery-night.jpg",
  },
];

export type PublishStatus = "published" | "draft";

export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  bio: string;
  image: string;
  category: PlayerCategory;
  convocado: "SI" | "NO";
  visible_publico?: boolean;
  status?: PublishStatus;
};

export type TeamBirthYear =
  | 2020
  | 2019
  | 2018
  | 2017
  | 2016
  | 2015
  | 2014
  | 2013
  | 2012
  | 2011
  | 2010
  | 2009
  | 2008
  | 2007;

export type TeamCategoryId =
  | "2020-2019"
  | "2018-2017"
  | "2016-2015"
  | "2014-2013"
  | "2012-2011"
  | "2010-2009"
  | "2008-2007";

export type PlayerCategory = TeamCategoryId | TeamBirthYear | `${TeamBirthYear}`;

export const teamCategories: TeamCategoryId[] = [
  "2020-2019",
  "2018-2017",
  "2016-2015",
  "2014-2013",
  "2012-2011",
  "2010-2009",
  "2008-2007",
];

export const getPlayerCategory = (
  category: PlayerCategory
): TeamCategoryId | undefined => {
  if (teamCategories.includes(category as TeamCategoryId)) {
    return category as TeamCategoryId;
  }

  const birthYear = Number(category);

  return teamCategories.find((teamCategory) =>
    teamCategory
      .split("-")
      .map(Number)
      .includes(birthYear)
  );
};

export type TeamSlot = {
  id: string;
  player?: Player;
};

export type TeamGroup = {
  id: string;
  title: string;
  description: string;
  slots: TeamSlot[];
};

export type TeamSection = {
  id: string;
  title: string;
  description: string;
  groups: TeamGroup[];
};

export const players: Player[] = [
  {
    id: "1",
    name: "Jesus osuna",
    number: 1,
    position: "Portero",
    bio: "Reflejos rápidos y liderazgo bajo los tres palos.",
    image: "/players/avatar.svg",
    category: 2010,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
  {
    id: "2",
    name: "Harold zarate",
    number: 4,
    position: "Cierre",
    bio: "Solidez defensiva y salida limpia de balón.",
    image: "/players/avatar.svg",
    category: 2009,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
  {
    id: "3",
    name: "Jhon triana",
    number: 6,
    position: "Ala",
    bio: "Distribución precisa y recuperación constante.",
    image: "/players/avatar.svg",
    category: 2008,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
  {
    id: "4",
    name: "Dilan Muñoz",
    number: 8,
    position: "Ala",
    bio: "Creatividad y visión de juego en el último tercio.",
    image: "/players/avatar.svg",
    category: 2008,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
  {
    id: "5",
    name: "Jhon Valencia",
    number: 7,
    position: "Ala",
    bio: "Instinto goleador y presión alta sin balón.",
    image: "/players/avatar.svg",
    category: 2009,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
  {
    id: "6",
    name: "Keiner valencia",
    number: 9,
    position: "Pivot",
    bio: "Aguante de balón y definición clínica en el área rival.",
    image: "/players/avatar.svg",
    category: 2012,
    convocado: "SI",
    visible_publico: true,
    status: "published",
  },
];

const emptySlots = (prefix: string, amount: number): TeamSlot[] =>
  Array.from({ length: amount }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
  }));

const categorySection = (
  id: string,
  title: string,
  convocados: TeamSlot[] = [],
  jugadores: TeamSlot[] = []
): TeamSection => ({
  id,
  title,
  description:
    "Categoría organizada por año de nacimiento para seguimiento formativo, convocatorias y torneos.",
  groups: [
    {
      id: `${id}-convocados`,
      title: "Convocados",
      description:
        "Lista corta para entrenamientos, competencias y llamados recientes del cuerpo técnico.",
      slots: fillSlots(`${id}-convocados`, convocados, 10),
    },
    {
      id: `${id}-jugadores`,
      title: "Jugadores",
      description:
        "Registro completo de integrantes disponibles dentro del proceso de la categoría.",
      slots: fillSlots(`${id}-jugadores`, jugadores, 20),
    },
  ],
});

const fillSlots = (
  prefix: string,
  occupiedSlots: TeamSlot[],
  minimumAmount: number
): TeamSlot[] => [
  ...occupiedSlots,
  ...emptySlots(
    `${prefix}-disponible`,
    Math.max(minimumAmount - occupiedSlots.length, 0)
  ),
];

const playerSlot = (groupId: string, player: Player): TeamSlot => ({
  id: `${groupId}-${player.id}`,
  player,
});

export const buildTeamSections = (items: Player[]): TeamSection[] => [
  ...teamCategories.map((category) => {
    const categoryPlayers = items.filter(
      (player) => getPlayerCategory(player.category) === category
    );
    const convocados = categoryPlayers
      .filter((player) => player.convocado === "SI")
      .map((player) => playerSlot(`${category}-convocado`, player));
    const jugadores = categoryPlayers.map((player) =>
      playerSlot(`${category}-jugador`, player)
    );

    return categorySection(category, category, convocados, jugadores);
  }),
  {
    id: "entrenadores",
    title: "Entrenadores",
    description:
      "Cuerpo técnico encargado de acompañar, formar y orientar cada proceso deportivo.",
    groups: [
      {
        id: "entrenadores-lista",
        title: "Entrenadores",
        description:
          "Espacios para dirección técnica, asistencia, preparación física y apoyo formativo.",
        slots: emptySlots("entrenadores", 10),
      },
    ],
  },
];

export const teamSections: TeamSection[] = buildTeamSections(players);

export type Training = {
  id: string;
  title: string;
  date: string;
  endDate: string;
  description: string;
  image: string;
  images?: string[];
  videos?: string[];
  hidden?: boolean;
  status?: PublishStatus;
};

export type NewsStatus = "published" | "draft";

export type News = {
  id: string;
  title: string;
  date: string;
  endDate: string;
  category: string;
  summary: string;
  body: string;
  image: string;
  status?: NewsStatus;
};

export const news: News[] = [
  {
    id: "1",
    title: "Convocatoria institucional para nuevos talentos",
    date: "2026-05-18",
    endDate: "2026-06-18",
    category: "Cantera",
    summary:
      "El club abre espacios de observación para niños, niñas y jóvenes de Usme interesados en iniciar un proceso deportivo estructurado.",
    body:
      "El Club Deportivo Real Sporting invita a las familias de la localidad a participar en jornadas de observación para nuevos talentos. El proceso prioriza disciplina, asistencia, actitud, compromiso familiar y seguimiento técnico por categorías.",
    image: "/brand/gallery-youth.jpg",
    status: "published",
  },
  {
    id: "2",
    title: "Microciclo enfocado en presión alta",
    date: "2026-05-14",
    endDate: "2026-06-14",
    category: "Entrenamiento",
    summary:
      "Las categorías formativas trabajaron recuperación rápida, cierres coordinados y salida limpia tras robo.",
    body:
      "Durante la semana se desarrolló un microciclo dedicado a la presión alta. Los jugadores practicaron basculaciones, coberturas y decisiones de primer pase para transformar recuperaciones en ataques organizados. El objetivo es sostener intensidad sin perder orden.",
    image: "/brand/hero-training.jpg",
    status: "published",
  },
  {
    id: "3",
    title: "Familias y jugadores fortalecen el proyecto",
    date: "2026-05-10",
    endDate: "2026-06-10",
    category: "Comunidad",
    summary:
      "La comunidad del club acompañó una jornada de integración alrededor del deporte y los valores.",
    body:
      "El encuentro reunió a jugadores, familias y cuerpo técnico en una jornada pensada para reforzar pertenencia, respeto y trabajo en equipo. Estos espacios sostienen la identidad del club y recuerdan que el proceso deportivo también se construye fuera de la cancha.",
    image: "/brand/gallery-team.jpg",
    status: "published",
  },
  {
    id: "4",
    title: "Preparación para torneo local",
    date: "2026-05-06",
    endDate: "2026-06-06",
    category: "Competencia",
    summary:
      "El equipo ajusta detalles tácticos y físicos antes de los próximos compromisos competitivos.",
    body:
      "El Club Deportivo Real Sporting prepara sus próximas presentaciones con énfasis en pelota quieta, repliegue defensivo y definición. El cuerpo técnico evalúa convocatorias por asistencia, rendimiento y comportamiento para representar a la institución con responsabilidad.",
    image: "/brand/gallery-night.jpg",
    status: "published",
  },
];

export const trainings: Training[] = [
  {
    id: "1",
    title: "Sesión técnica — pase y posesión",
    date: "2025-05-10",
    endDate: "2025-06-10",
    description:
      "Trabajo de rondo 4v2, circuitos de pase y finalización en espacios reducidos. Enfoque en primer toque y comunicación.",
    image: "/trainings/1.svg",
    hidden: true,
    status: "draft",
  },
  {
    id: "2",
    title: "Preparación física — resistencia",
    date: "2025-05-12",
    endDate: "2025-06-12",
    description:
      "Series de intervalos, trabajo de core y movilidad. Sesión orientada al rendimiento del segundo tiempo.",
    image: "/trainings/2.svg",
    hidden: true,
    status: "draft",
  },
  {
    id: "3",
    title: "Táctica — presión alta",
    date: "2025-05-15",
    endDate: "2025-06-15",
    description:
      "Bloque compacto, salida desde el arco y triggers de presión en zona de creación rival.",
    image: "/trainings/3.svg",
    hidden: true,
    status: "draft",
  },
  {
    id: "4",
    title: "Partido interno — formato 7v7",
    date: "2025-05-17",
    endDate: "2025-06-17",
    description:
      "Partido de aplicación con rotaciones. Evaluación de decisiones bajo presión real.",
    image: "/trainings/4.svg",
    hidden: true,
    status: "draft",
  },
  {
    id: "5",
    title: "Recuperación activa",
    date: "2025-05-19",
    endDate: "2025-06-19",
    description:
      "Estiramientos, hidratación y charla de análisis de video de la jornada anterior.",
    image: "/trainings/5.svg",
    hidden: true,
    status: "draft",
  },
  {
    id: "6",
    title: "Definición y estrategia a balón parado",
    date: "2025-05-21",
    endDate: "2025-06-21",
    description:
      "Córners ofensivos, faltas laterales y transiciones rápidas post-rebote.",
    image: "/trainings/6.svg",
    hidden: true,
    status: "draft",
  },
];

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/torneos", label: "Torneos" },
  { href: "/equipo", label: "Categorías" },
  { href: "/contacto", label: "Inscripción" },
];
