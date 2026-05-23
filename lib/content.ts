export const club = {
  name: "Real Sporting de Usme",
  tagline: "Pasión, disciplina y futuro desde el sur de Bogotá",
  mission:
    "Formar jugadores íntegros con disciplina, técnica y valores, en un ambiente seguro donde cada niño y joven se sienta acompañado.",
  vision:
    "Ser un referente formativo en Usme y Bogotá, reconocido por su metodología, unión familiar y crecimiento deportivo.",
  history:
    "Real Sporting de Usme nació para abrir oportunidades a niños y jóvenes del sur de Bogotá. El balón es nuestra herramienta para formar carácter, hábitos y sentido de pertenencia.",
  values: [
    {
      title: "Disciplina",
      description:
        "Compromiso diario en entrenamiento, estudio y convivencia dentro y fuera de la cancha.",
    },
    {
      title: "Comunidad",
      description:
        "El club pertenece a Usme: familias, vecinos y patrocinadores caminan juntos.",
    },
    {
      title: "Excelencia",
      description:
        "Buscamos mejorar en cada sesión, cada partido y cada decisión técnica.",
    },
    {
      title: "Respeto",
      description:
        "Fair play con rivales, árbitros, cuerpo técnico y público en todo momento.",
    },
    {
      title: "Formación",
      description:
        "Priorizamos el desarrollo humano y deportivo de cada jugador de la cantera.",
    },
  ],
  milestones: [
    { year: "2022", event: "Fundación del club y primer equipo formativo." },
    { year: "2022", event: "Apertura de la escuela de formación infantil." },
    { year: "2023", event: "Clasificación a torneos interlocalidad." },
    { year: "2026", event: "Renovación de identidad y proyecto digital del club." },
  ],
};

export const social = {
  instagram: "https://www.instagram.com/realsportingdeusme/",
  facebook: "https://www.facebook.com/profile.php?id=100091922545253",
  email: "realsportingdeusmeed@gmail.com",
  phone: "3209059855",
  location: "Usme, Bogotá D.C., Colombia",
};

export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  bio: string;
  image: string;
  category: PlayerCategory;
  convocado: "SI" | "NO";
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
    image: "/players/1.svg",
    category: 2010,
    convocado: "SI",
  },
  {
    id: "2",
    name: "Harold zarate",
    number: 4,
    position: "Cierre",
    bio: "Solidez defensiva y salida limpia de balón.",
    image: "/players/2.svg",
    category: 2009,
    convocado: "SI",
  },
  {
    id: "3",
    name: "Jhon triana",
    number: 6,
    position: "Ala",
    bio: "Distribución precisa y recuperación constante.",
    image: "/players/3.svg",
    category: 2008,
    convocado: "SI",
  },
  {
    id: "4",
    name: "Dilan Muñoz",
    number: 8,
    position: "Ala",
    bio: "Creatividad y visión de juego en el último tercio.",
    image: "/players/4.svg",
    category: 2008,
    convocado: "SI",
  },
  {
    id: "5",
    name: "Jhon Valencia",
    number: 7,
    position: "Ala",
    bio: "Instinto goleador y presión alta sin balón.",
    image: "/players/5.svg",
    category: 2009,
    convocado: "SI",
  },
  {
    id: "6",
    name: "Keiner valencia",
    number: 9,
    position: "Pivot",
    bio: "Aguante de balon y definición clínica en el área rival.",
    image: "/players/6.svg",
    category: 2012,
    convocado: "SI",
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
};

export type News = {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string;
  image: string;
};

export const news: News[] = [
  {
    id: "1",
    title: "Convocatoria abierta para nuevos talentos",
    date: "2026-05-18",
    category: "Cantera",
    summary:
      "El club abre espacios de observación para niños y jóvenes de Usme que quieran iniciar proceso formativo.",
    body:
      "Real Sporting de Usme invita a las familias de la localidad a participar en las jornadas de observación para nuevos talentos. El proceso prioriza disciplina, asistencia, actitud y compromiso familiar, con seguimiento deportivo por categorías y acompañamiento del cuerpo técnico.",
    image: "/banner.png",
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
    image: "/trainings/3.svg",
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
    image: "/logo.png",
  },
  {
    id: "4",
    title: "Preparación para torneo local",
    date: "2026-05-06",
    category: "Competencia",
    summary:
      "El equipo ajusta detalles tácticos y físicos antes de los próximos compromisos competitivos.",
    body:
      "Real Sporting de Usme prepara sus próximas presentaciones con énfasis en pelota quieta, repliegue defensivo y definición. El cuerpo técnico evalúa convocatorias por asistencia, rendimiento y comportamiento para representar al club con responsabilidad.",
    image: "/trainings/6.svg",
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
  },
  {
    id: "2",
    title: "Preparación física — resistencia",
    date: "2025-05-12",
    description:
      "Series de intervalos, trabajo de core y movilidad. Sesión orientada al rendimiento del segundo tiempo.",
    image: "/trainings/2.svg",
  },
  {
    id: "3",
    title: "Táctica — presión alta",
    date: "2025-05-15",
    description:
      "Bloque compacto, salida desde el arco y triggers de presión en zona de creación rival.",
    image: "/trainings/3.svg",
  },
  {
    id: "4",
    title: "Partido interno — formato 7v7",
    date: "2025-05-17",
    description:
      "Partido de aplicación con rotaciones. Evaluación de decisiones bajo presión real.",
    image: "/trainings/4.svg",
  },
  {
    id: "5",
    title: "Recuperación activa",
    date: "2025-05-19",
    description:
      "Estiramientos, hidratación y charla de análisis de video de la jornada anterior.",
    image: "/trainings/5.svg",
  },
  {
    id: "6",
    title: "Definición y estrategia a balón parado",
    date: "2025-05-21",
    description:
      "Córners ofensivos, faltas laterales y transiciones rápidas post-rebote.",
    image: "/trainings/6.svg",
  },
];

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/club", label: "El Club" },
  { href: "/equipo", label: "Equipo" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/contacto", label: "Inscripción" },
];
