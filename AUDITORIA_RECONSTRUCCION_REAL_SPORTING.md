# Auditoría y Reconstrucción UX/UI - Real Sporting Usme

Fecha: 2026-06-12

## 1. Auditoría Técnica

Stack confirmado:

- Next.js App Router con TypeScript.
- Prisma con PostgreSQL/Neon.
- NextAuth y autenticación administrativa propia por sesión.
- Framer Motion, Tailwind CSS y componentes UI locales.
- Stores server-side para noticias, jugadores, torneos, entrenamientos y archivos.

Áreas revisadas:

- `app/`: páginas públicas, rutas API, layout global, metadata y paneles.
- `components/`: layout, home, club, noticias, equipo, torneos, entrenamientos, contacto y admin.
- `lib/`: stores Prisma, auth, validadores, configuración SEO, uploads y contenido.
- `prisma/schema.prisma`: modelos e índices actuales.
- `middleware.ts`: protección general de rutas admin.
- APIs: noticias, jugadores, torneos, entrenamientos, uploads, auth y cron.

Hallazgos principales:

- El preloader tenía un bloqueo circular: esperaba que el Hero notificara carga, pero el layout no renderizaba el contenido mientras el preloader seguía visible.
- `LoadingInitializer` buscaba `[data-hero-image]`, pero el Hero usa `data-critical-image="hero-image"`.
- Existían navbars antiguas no importadas: `Navbar.backup.tsx` y `NavbarOptimized.tsx`.
- Existía una landing antigua pública no conectada al App Router.
- Había múltiples documentos de implementación de preloader que ya no eran fuente funcional.
- Había archivos marcadores vacíos (`node`, `real-sporting-usme@0.1.0`).
- Algunos componentes públicos de home emitían `console.log` en producción.
- El manager de jugadores enviaba `x-training-key` para crear/editar/borrar, pero la API valida `x-admin-key`.
- Faltaban `sitemap.ts`, `robots.ts` y structured data.
- El sitio usaba demasiados contenedores `glass-card` en la home, generando sensación de plantilla y secciones encerradas.

## 2. Limpieza Realizada

Archivos eliminados:

- `components/layout/Navbar.backup.tsx`
- `components/layout/NavbarOptimized.tsx`
- `public/landing-old.html`
- `node`
- `real-sporting-usme@0.1.0`
- `PRELOADER_IMPLEMENTATION_SUMMARY.md`
- `PRELOADER_INDEX.md`
- `PRELOADER_INTEGRATION_GUIDE.md`
- `PRELOADER_PROFESSIONAL_GUIDE.md`
- `PRELOADER_QUICK_START.md`
- `PRELOADER_README.md`
- `PRELOADER_TECHNICAL_DOCS.md`

No se revirtieron cambios previos del usuario en `.env.example`, `.gitignore`, `lib/auth.ts` ni borrados ya existentes en `public`.

## 3. Archivos Modificados

- `app/layout.tsx`: structured data, limpieza de comentarios obsoletos.
- `app/globals.css`: fondo institucional, estilos del nuevo preloader y refinamiento visual.
- `app/page.tsx`: home convertida en secciones limpias sin contenedores flotantes innecesarios.
- `app/noticias/page.tsx`: introducción, carrusel destacado y listado completo.
- `app/equipo/page.tsx`: estructura storytelling para categorías.
- `app/torneos/page.tsx`: arquitectura visible de activos, próximos, históricos y ganados.
- `components/ui/PagePreloader.tsx`: preloader con entrada/salida Framer Motion y uso de `Preloader.json`.
- `contexts/LoadingContext.tsx`: primera carga por sesión, desbloqueo de render y transición segura.
- `components/providers/MainContentRenderer.tsx`: eliminación del bloqueo circular.
- `components/providers/LoadingInitializer.tsx`: selector correcto de imagen crítica.
- `components/equipo/EquipoCategories.tsx`: categoría por fotografía, edades, objetivos, convocados y CTA.
- `components/equipo/PlayerManager.tsx`: corrección de header admin.
- `components/tournaments/TournamentCard.tsx`: enlace a convocados por categoría.
- `components/tournaments/CurrentTournamentCard.tsx`: enlace a convocados por categoría.
- `components/admin/AdminPortal.tsx`: métricas básicas y accesos rápidos más claros.
- `components/layout/Footer.tsx`: bloque institucional de patrocinadores/aliados.
- `components/home/QuickInstitutional.tsx`, `RecentTrainings.tsx`, `TrainingLoopShowcase.tsx`: eliminación de logs/comentarios obsoletos.
- `lib/content.ts`: categorías Sub-7, Sub-9, Sub-11, Sub-13, Sub-15, Sub-17 y Sub-20 con edades y objetivos.

Archivos agregados:

- `app/sitemap.ts`
- `app/robots.ts`
- `AUDITORIA_RECONSTRUCCION_REAL_SPORTING.md`

## 4. Base de Datos

No se modificó `prisma/schema.prisma`.

Justificación:

- Los modelos actuales ya cubren el alcance principal sin migración destructiva:
  - `Noticia`: portada, fecha, categoría, resumen, contenido, publicación.
  - `Jugador`: categoría, convocado, visibilidad pública.
  - `Torneo`: descripción, programación, sede/cancha, categoría, rival, imagen, fechas, estado.
  - `TorneoActual`: galería, programación, categoría, rival, fechas.
  - `Entrenamiento`: imágenes, videos, fechas y publicación.
- Los índices existentes para fecha, publicación, categoría y estado son adecuados para las consultas actuales.
- Para evitar romper datos existentes, la arquitectura de torneos se resolvió con campos actuales y presentación derivada.

## 5. Arquitectura Final

- Layout global con navbar superior transparente/dinámico, footer institucional y preloader de primera carga.
- Home cinematográfica con hero visual, secciones por bandas y lazy loading en contenido no crítico.
- Noticias con hero, introducción, carrusel destacado, noticia principal, listado completo y SEO por metadata.
- Categorías formativas con storytelling, foto, edad, objetivos, CTA y roster/convocados por categoría.
- Torneos segmentados en activos, próximos, históricos y ganados, con programación y enlace a convocados.
- Panel administrativo con métricas básicas, accesos rápidos y managers existentes para contenido.
- Stores Prisma conservados como capa de datos central.

## 6. Rendimiento

Mejoras implementadas:

- Se eliminó el bloqueo circular del preloader.
- El preloader aparece una sola vez por sesión usando `sessionStorage`.
- El contenido se monta durante la carga para permitir medición real de recursos críticos.
- Se conservaron imports dinámicos en la home para secciones no críticas.
- Se eliminaron logs de producción en componentes públicos.
- Se removieron archivos obsoletos y backups no importados.

Limitación:

- No se pudo ejecutar build/lint porque el entorno no tiene `node` ni `npm` en PATH, aunque existen `node_modules` y scripts del proyecto.

## 7. SEO

Mejoras implementadas:

- `app/sitemap.ts` con rutas públicas clave.
- `app/robots.ts` con bloqueo de `/api/`, `/admin/` y formulario privado.
- Structured data JSON-LD tipo `SportsClub`.
- Metadata y Open Graph existentes se conservaron.
- Noticias conservan rutas detalle y contenido sanitizado.

## 8. Problemas Encontrados y Solución

- Preloader infinito: resuelto renderizando el contenido bajo overlay y marcando la carga por recursos reales.
- Selector de imagen crítica incorrecto: corregido a `data-critical-image="hero-image"`.
- Headers incorrectos en jugadores: corregidos a `x-admin-key`.
- Duplicados/backup de navbar: eliminados.
- Landing antigua y archivos vacíos: eliminados.
- Falta de SEO técnico: agregado sitemap, robots y JSON-LD.
- Categorías poco expresivas: convertidas a Sub-7/Sub-9/Sub-11/Sub-13/Sub-15/Sub-17/Sub-20 con objetivos.
