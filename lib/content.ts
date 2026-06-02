export const club = {
  name: "Club Deportivo Real Sporting",
  tagline:
    "Formación deportiva integral, disciplina competitiva y proyección humana desde Usme",
  mission:
    "El Club Deportivo Real Sporting tiene como misión formar integralmente niños, niñas y jóvenes mediante procesos deportivos de alta calidad, promoviendo valores, disciplina, liderazgo, trabajo en equipo y desarrollo humano a través del fútbol como herramienta de transformación social, inclusión y proyección profesional.",
  vision:
    "Ser un club deportivo reconocido a nivel distrital y nacional por su excelencia formativa, impacto social y proyección competitiva, consolidándose como una institución referente en el desarrollo deportivo y humano de nuevas generaciones.",
  history:
    "El Club Deportivo Real Sporting impulsa procesos formativos para niños, niñas y jóvenes de Usme, integrando metodología deportiva, acompañamiento humano y sentido de pertenencia territorial. El fútbol es nuestra plataforma para formar carácter, hábitos, liderazgo y proyecto de vida.",
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
      year: "Marzo 2022",
      event: "Consolidación del club y apertura del primer proceso formativo.",
    },
    {
      year: "Agosto 2022",
      event: "Estructuración de categorías infantiles y juveniles.",
    },
    { year: "2023", event: "Participación competitiva en torneos de proyección local." },
    {
      year: "2024-2025",
      event: "Continuidad del proceso formativo y consolidación de categorías competitivas.",
    },
    {
      year: "2026",
      event: "Renovación institucional, metodológica y digital del proyecto deportivo.",
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

export const odsItems = [
  {
    id: "ods-3",
    code: "ODS 3",
    title: "Salud y Bienestar",
    shortText: "Actividad física, hábitos saludables y acompañamiento emocional.",
    detail:
      "El fútbol se trabaja como herramienta de salud física, bienestar mental y prevención mediante rutinas formativas constantes.",
  },
  {
    id: "ods-4",
    code: "ODS 4",
    title: "Educación de Calidad",
    shortText: "Valores, disciplina y habilidades para la vida.",
    detail:
      "Cada entrenamiento combina aprendizaje deportivo con comunicación, liderazgo, convivencia y responsabilidad.",
  },
  {
    id: "ods-5",
    code: "ODS 5",
    title: "Igualdad de Género",
    shortText: "Acceso y trato digno para todos los géneros.",
    detail:
      "El proceso promueve oportunidades deportivas sin discriminación y con un entorno de respeto.",
  },
  {
    id: "ods-10",
    code: "ODS 10",
    title: "Reducción de Desigualdades",
    shortText: "Inclusión social para poblaciones diversas.",
    detail:
      "El club abre espacios formativos para niños, niñas y jóvenes del territorio con enfoque comunitario.",
  },
  {
    id: "ods-11",
    code: "ODS 11",
    title: "Comunidades Sostenibles",
    shortText: "Tejido social, familias y territorio.",
    detail:
      "La práctica deportiva fortalece redes de cuidado, participación familiar y pertenencia local en Usme.",
  },
  {
    id: "ods-16",
    code: "ODS 16",
    title: "Paz e Instituciones Sólidas",
    shortText: "Cultura de paz, juego limpio y convivencia.",
    detail:
      "El fútbol se usa para formar respeto por normas, diálogo y resolución pacífica de conflictos.",
  },
];

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
    description:
      "Córners ofensivos, faltas laterales y transiciones rápidas post-rebote.",
    image: "/trainings/6.svg",
    hidden: true,
    status: "draft",
  },
];

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/club", label: "El Club" },
  { href: "/equipo", label: "Categorías" },
  { href: "/entrenamientos", label: "Galería" },
  { href: "/noticias", label: "Noticias" },
  { href: "/contacto", label: "Inscripción" },
];
