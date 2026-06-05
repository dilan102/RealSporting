export type EditableContentField = {
  key: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
};

export type EditableContentGroup = {
  id: string;
  title: string;
  description: string;
  fields: EditableContentField[];
};

export const editableContentGroups: EditableContentGroup[] = [
  {
    id: "home",
    title: "Inicio",
    description: "Encabezado principal y bloques de la página de inicio.",
    fields: [
      {
        key: "home.hero.badge",
        label: "Etiqueta hero",
        defaultValue: "Club Deportivo Real Sporting de Usme",
      },
      {
        key: "home.hero.title",
        label: "Título hero",
        defaultValue: "Desde Usme,\nCon disciplina,\nHacia el futuro.",
        multiline: true,
      },
      {
        key: "home.hero.subtitle",
        label: "Subtítulo hero",
        defaultValue:
          "Formación deportiva integral, disciplina competitiva y proyección humana desde Usme. Formamos jugadores con método, valores y sentido de pertenencia territorial.",
        multiline: true,
      },
      { key: "home.hero.cta", label: "Botón hero", defaultValue: "Conocer el club" },
      {
        key: "home.hero.location",
        label: "Ubicación hero",
        defaultValue: "Usme · Bogotá D.C.",
      },
    ],
  },
  {
    id: "pages",
    title: "Encabezados",
    description: "Heroes de las páginas principales.",
    fields: [
      { key: "noticias.hero.eyebrow", label: "Noticias etiqueta", defaultValue: "Actualidad" },
      { key: "noticias.hero.title", label: "Noticias título", defaultValue: "Noticias" },
      {
        key: "noticias.hero.subtitle",
        label: "Noticias subtítulo",
        defaultValue: "Comunicados, convocatorias y actualidad del proceso deportivo.",
        multiline: true,
      },
      {
        key: "entrenamientos.hero.eyebrow",
        label: "Entrenamientos etiqueta",
        defaultValue: "Entrenamientos",
      },
      {
        key: "entrenamientos.hero.title",
        label: "Entrenamientos título",
        defaultValue: "Entrenamientos",
      },
      {
        key: "entrenamientos.hero.subtitle",
        label: "Entrenamientos subtítulo",
        defaultValue: "Registro visual de sesiones, comunidad y proceso deportivo.",
        multiline: true,
      },
      { key: "equipo.hero.eyebrow", label: "Equipo etiqueta", defaultValue: "Equipo" },
      { key: "equipo.hero.title", label: "Equipo título", defaultValue: "Categorías" },
      {
        key: "equipo.hero.subtitle",
        label: "Equipo subtítulo",
        defaultValue: "Rangos formativos, convocatorias y registro deportivo del proceso 2026.",
        multiline: true,
      },
      { key: "club.hero.eyebrow", label: "Club etiqueta", defaultValue: "Institucional" },
      { key: "club.hero.title", label: "Club título", defaultValue: "Conócenos" },
      {
        key: "club.hero.subtitle",
        label: "Club subtítulo",
        defaultValue:
          "Historia, identidad, valores y el camino que recorremos como club formativo en Usme.",
        multiline: true,
      },
      { key: "contacto.hero.eyebrow", label: "Inscripción etiqueta", defaultValue: "Contacto" },
      { key: "contacto.hero.title", label: "Inscripción título", defaultValue: "Inscripción" },
      {
        key: "contacto.hero.subtitle",
        label: "Inscripción subtítulo",
        defaultValue: "Ingreso al proceso deportivo, social y formativo de Real Sporting",
        multiline: true,
      },
      {
        key: "documentos.hero.eyebrow",
        label: "Documentos etiqueta",
        defaultValue: "Documentación oficial",
      },
      { key: "documentos.hero.title", label: "Documentos título", defaultValue: "Documentos" },
      {
        key: "documentos.hero.subtitle",
        label: "Documentos subtítulo",
        defaultValue: "Biblioteca institucional, modelo deportivo y proyecto CDRS 2026.",
        multiline: true,
      },
    ],
  },
  {
    id: "tournaments",
    title: "Torneos",
    description: "Encabezado, secciones y formulario de torneos.",
    fields: [
      { key: "torneos.hero.eyebrow", label: "Etiqueta", defaultValue: "Competencia" },
      { key: "torneos.hero.title", label: "Título", defaultValue: "Torneos" },
      {
        key: "torneos.hero.subtitle",
        label: "Subtítulo",
        defaultValue: "Programación competitiva, resultados, participaciones y próximos retos del club.",
        multiline: true,
      },
      {
        key: "torneos.sections.played.title",
        label: "Jugados título",
        defaultValue: "Torneos jugados",
      },
      {
        key: "torneos.sections.played.description",
        label: "Jugados descripción",
        defaultValue: "Participaciones finalizadas que fortalecen experiencia y proceso competitivo.",
        multiline: true,
      },
      {
        key: "torneos.sections.won.title",
        label: "Ganados título",
        defaultValue: "Torneos ganados",
      },
      {
        key: "torneos.sections.won.description",
        label: "Ganados descripción",
        defaultValue: "Logros competitivos y campeonatos que marcan la historia del club.",
        multiline: true,
      },
      {
        key: "torneos.sections.future.title",
        label: "Por jugar título",
        defaultValue: "Torneos por jugar",
      },
      {
        key: "torneos.sections.future.description",
        label: "Por jugar descripción",
        defaultValue: "Próximas competencias en planeación o confirmadas por la institución.",
        multiline: true,
      },
      { key: "torneos.admin.eyebrow", label: "Admin etiqueta", defaultValue: "Administrador" },
      { key: "torneos.admin.title", label: "Admin título", defaultValue: "Subir programación" },
    ],
  },
  {
    id: "sections",
    title: "Bloques",
    description: "Textos destacados dentro de páginas.",
    fields: [
      {
        key: "noticias.list.title",
        label: "Lista de noticias",
        defaultValue: "Todas las noticias",
      },
      {
        key: "entrenamientos.gallery.eyebrow",
        label: "Galería etiqueta",
        defaultValue: "Memoria visual",
      },
      {
        key: "entrenamientos.gallery.title",
        label: "Galería título",
        defaultValue: "Sesiones que muestran disciplina, trabajo técnico y comunidad.",
        multiline: true,
      },
      {
        key: "entrenamientos.gallery.description",
        label: "Galería descripción",
        defaultValue:
          "Las publicaciones del administrador aparecen debajo como registro público. Las imágenes de apoyo editorial refuerzan la identidad visual mientras el club suma material propio.",
        multiline: true,
      },
      {
        key: "entrenamientos.published.eyebrow",
        label: "Publicados etiqueta",
        defaultValue: "Entrenamientos publicados",
      },
      {
        key: "entrenamientos.published.title",
        label: "Publicados título",
        defaultValue: "Registro de sesiones",
      },
      { key: "equipo.intro.eyebrow", label: "Equipo bloque etiqueta", defaultValue: "Proceso por edades" },
      {
        key: "equipo.intro.title",
        label: "Equipo bloque título",
        defaultValue: "Cada categoría tiene una intención técnica y humana.",
        multiline: true,
      },
      {
        key: "equipo.intro.description",
        label: "Equipo bloque descripción",
        defaultValue:
          "El registro de jugadores se organiza por año de nacimiento. Haz clic en una categoría para ver su plantilla, convocatorias y seguimiento público.",
        multiline: true,
      },
      { key: "equipo.intro.cta", label: "Equipo botón", defaultValue: "Inscribirme" },
    ],
  },
];

export const editableContentDefaults = editableContentGroups.reduce<Record<string, string>>(
  (accumulator, group) => {
    group.fields.forEach((field) => {
      accumulator[field.key] = field.defaultValue;
    });

    return accumulator;
  },
  {},
);
