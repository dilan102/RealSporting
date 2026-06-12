# Análisis Exhaustivo del Proyecto Real Sporting Usme
**Fecha de análisis:** 12 de junio de 2026  
**Versión del proyecto:** 0.1.0

---

## ÍNDICE
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estructura de Componentes](#1-estructura-de-componentes)
3. [Estructura de Páginas](#2-estructura-de-páginas)
4. [Sistema de Datos (lib/)](#3-sistema-de-datos-lib)
5. [Base de Datos (Prisma)](#4-base-de-datos-prisma)
6. [API Routes](#5-api-routes)
7. [Middleware y Autenticación](#6-middleware-y-autenticación)
8. [Assets y Recursos Públicos](#7-assets-y-recursos-públicos)
9. [Dependencias y Paquetes](#8-dependencias-y-paquetes)
10. [Componentes Duplicados](#9-componentes-duplicados-y-similares)
11. [Código Muerto y Sin Uso](#10-código-muerto-y-sin-uso)
12. [CSS Muerto](#11-css-muerto)
13. [Problemas Identificados](#12-problemas-identificados)
14. [Recomendaciones](#13-recomendaciones)

---

## RESUMEN EJECUTIVO

El proyecto Real Sporting es una aplicación Next.js 15 con TypeScript, Prisma/PostgreSQL y autenticación NextAuth. La arquitectura es moderna pero tiene áreas de optimización:

**Estadísticas Generales:**
- **Componentes:** 57 componentes (.tsx)
- **Páginas/Rutas:** 8 secciones principales
- **Funciones de librería:** 30+ archivos en lib/
- **Modelos Prisma:** 6 (Noticia, Entrenamiento, Jugador, Torneo, TorneoActual, ArchivoSubido)
- **API Endpoints:** 12 rutas principales

**Problemas Críticos Identificados:** 4
**Componentes Duplicados/Similares:** 3 grupos
**Código Muerto:** 5 archivos/componentes
**CSS Muerto:** Mínimo (bien limpio)

---

## 1. ESTRUCTURA DE COMPONENTES

### 1.1 Componentes de Raíz (`components/`)

| Componente | Tipo | Estado | Observaciones |
|---|---|---|---|
| `AnimatedCounter.tsx` | Utilidad | ✅ Activo | Animación de contadores con CountUp |
| `AnimatedGrid.tsx` | Utilidad | ✅ Activo | Grilla animada (sin uso explícito) |
| `CountUp.tsx` | Utilidad | ✅ Activo | Wrapper de countup.js |
| `FadeUp.tsx` | Animación | ✅ Activo | Efecto de fade-up con Framer Motion |
| `MapEmbed.tsx` | Componente | ✅ Activo | Embed de Google Maps |
| `RevealLine.tsx` | Animación | ✅ Activo | Línea animada para encabezados |
| `ScrambleText.tsx` | Animación | ✅ Activo | Efecto de texto "scrambled" |
| `ScrollReveal.tsx` | Animación | ✅ Activo | Reveal animado al scroll |
| `SectionCard.tsx` | Contenedor | ✅ Activo | Contenedor base para secciones |
| `SectionDivider.tsx` | Utilidad | ✅ Activo | Separador visual entre secciones |
| `WhatsAppFAB.tsx` | Alias | ⚠️ Redundante | Re-exporta `WhatsAppFloat` desde `ui/` |

### 1.2 Subdirectorio `/admin`

| Componente | Función | Estado |
|---|---|---|
| `AdminPortal.tsx` | Panel administrativo principal | ✅ Activo |
| `GlobalContentManager.tsx` | Gestor global de contenido | ✅ Activo |

### 1.3 Subdirectorio `/auth`

| Componente | Función | Estado |
|---|---|---|
| `AdminPasswordLoginForm.tsx` | Formulario login admin | ✅ Activo |
| `GitHubSignInButton.tsx` | Botón de login GitHub (NextAuth) | ✅ Activo |

### 1.4 Subdirectorio `/club`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `OdsCommitment.tsx` | Sección ODS con flip cards | ✅ Activo | Importa OdsFlipCard y OdsInfographicModal |
| `OdsFlipCard.tsx` | Tarjeta flip 3D de ODS | ✅ Activo | Estados: club, training, commitment |
| `OdsInfographicModal.tsx` | Modal con infografía ODS | ✅ Activo | Renderiza SVG o PDF |
| `OdsInfographicPoster.tsx` | Poster infografía ODS | ✅ Activo | Versión estática sin modal |
| `VisionMission.tsx` | Sección Visión, Misión, Valores | ✅ Activo | Contiene `ValuesGrid()` y `Timeline()` |
| `ods-icons.ts` | Iconografía ODS | ✅ Activo | Exporta iconos por ODS |

### 1.5 Subdirectorio `/contact`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `ContactFormSection.tsx` | Sección de contacto | ✅ Activo | En página `/contacto` |
| `MemberInfoForm.tsx` | Formulario info miembros | ✅ Activo | Largo formulario (>600 líneas) |
| `OfficialDocumentsPanel.tsx` | Panel documentos oficiales | ✅ Activo | Muestra documentos PDF/imagen |
| `RegistrationForm.tsx` | Formulario inscripción | ✅ Activo | Completamente funcional |
| `RegistrationModal.tsx` | Modal para inscripciones | ✅ Activo | Wrapper modal |
| `SocialLinks.tsx` | Enlaces sociales | ✅ Activo | WhatsApp, email, teléfono |

### 1.6 Subdirectorio `/equipo`

| Componente | Función | Estado | Observaciones |
|---|---|---|---|
| `CategoryRosterContent.tsx` | Contenido del roster por categoría | ✅ Activo | Renderiza PlayerCard |
| `EquipoCategories.tsx` | Selector de categorías de equipo | ✅ Activo | Interfaz para categorías |
| `PlayerCard.tsx` | Tarjeta individual de jugador | ✅ Activo | Muestra foto, número, posición |
| `PlayerGrid.tsx` | Grilla de jugadores | ✅ Activo | Contenedor para PlayerCard |
| `PlayerManager.tsx` | Gestor CRUD de jugadores (admin) | ✅ Activo | Modal + listado |

### 1.7 Subdirectorio `/home`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `CategoryShowcase.tsx` | Showcase de categorías | ✅ Activo | Muestra el equipo disponible |
| `Hero.tsx` | Sección hero principal | ✅ Activo | Hero crítica con imagen |
| `HomeContactBand.tsx` | Banda de contacto en home | ✅ Activo | CTA a WhatsApp e inscripción |
| `HomeGallerySection.tsx` | Galería de fotos | ✅ Activo | Grid de imágenes |
| `OdsHomeSection.tsx` | Sección ODS en home | ✅ Activo | Muestra compromiso ODS |
| `QuickInstitutional.tsx` | Información institucional rápida | ✅ Activo | Misión, valores, equipo |
| `RecentTrainings.tsx` | Últimos entrenamientos | ✅ Activo | Server component, fetch async |
| `SocialStrip.tsx` | Strip de redes sociales | ✅ Activo | Iconos de redes sociales |
| `TrainingLoopShowcase.tsx` | Carrusel/loop de entrenamientos | ✅ Activo | Mostrador visual de entrenamientos |
| `ValuePillarsStrip.tsx` | Pilares de valor institucional | ✅ Activo | Principios del club |

### 1.8 Subdirectorio `/layout`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `Footer.tsx` | Footer global | ✅ Activo | Contacto, redes, derechos |
| `Navbar.tsx` | Navbar principal | ✅ Activo | Navegación, logo, login |
| `NavWhatsAppLink.tsx` | Enlace WhatsApp en navbar | ✅ Activo | CTA flotante |

### 1.9 Subdirectorio `/news`

| Componente | Función | Estado |
|---|---|---|
| `NewsCard.tsx` | Tarjeta de noticia | ✅ Activo |
| `NewsCircleShowcase.tsx` | Carousel de noticias en círculo | ✅ Activo |
| `NewsGrid.tsx` | Grilla de noticias | ✅ Activo |
| `NewsManager.tsx` | Gestor CRUD de noticias | ✅ Activo |
| `NewsVisual.tsx` | Componentes visuales de noticia (badge, etc) | ✅ Activo |

### 1.10 Subdirectorio `/providers`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `AuthProvider.tsx` | Proveedor de autenticación | ✅ Activo | SessionProvider NextAuth |
| `LoadingInitializer.tsx` | Inicializador del preloader | ✅ Activo | Sesión primera carga |
| `MainContentRenderer.tsx` | Renderizador de contenido principal | ✅ Activo | Evita bloqueo de render |

### 1.11 Subdirectorio `/tournaments`

| Componente | Función | Estado | Detalles |
|---|---|---|---|
| `CurrentTournamentCard.tsx` | Tarjeta de torneo actual | ✅ Activo | Mostrador visual |
| `CurrentTournamentManager.tsx` | Gestor CRUD torneo actual | ✅ Activo | Admin panel completo |
| `TournamentCard.tsx` | Tarjeta de torneo histórico | ✅ Activo | Mostrador visual |
| `TournamentEditModal.tsx` | Modal edición torneo | ✅ Activo | Formulario completo |
| `TournamentManager.tsx` | Gestor CRUD torneos | ✅ Activo | Admin panel |
| `TournamentSectionsManager.tsx` | Gestor secciones torneo | ✅ Activo | Subsecciones del torneo |
| `TournamentsList.tsx` | Listado de torneos | ✅ Activo | Listado público |

### 1.12 Subdirectorio `/trainings`

| Componente | Función | Estado | Observaciones |
|---|---|---|---|
| `ScmTrainingModelSection.tsx` | Sección modelo SCM | ✅ Activo | Metodología de entrenamiento |
| `TrainingCard.tsx` | Tarjeta de entrenamiento | ✅ Activo | Mostrador visual complejo |
| `TrainingGrid.tsx` | Grilla de entrenamientos | ✅ Activo | Grid responsivo |
| `TrainingManager.tsx` | Gestor CRUD entrenamientos | ✅ Activo | Admin completo |
| `TrainingModalShell.tsx` | Shell modal para entrenamientos | ✅ Activo | Contenedor modal |
| `UploadMock.tsx` | Mock de formulario upload | ⚠️ Desactualizado | Etiquetado como "Demo - fase 2" |

### 1.13 Subdirectorio `/ui`

| Componente | Función | Estado | Observaciones |
|---|---|---|---|
| `AIAssistantFloatingButton.tsx` | Botón flotante IA | ✅ Activo | Intenta integrar Dealism |
| `AIAssistantWidget.tsx` | Widget IA completo | ✅ Activo | Carga script Dealism |
| `Cursor.tsx` | Cursor personalizado | ✅ Activo | Animado, solo desktop |
| `Cursor.module.css` | Estilos cursor | ✅ Activo | Module CSS |
| `DayNightScrollIndicator.tsx` | Indicador scroll día/noche | ✅ Activo | Visual decorator |
| `FloatingSectionArrow.tsx` | Flecha flotante secciones | ✅ Activo | Navegación visual |
| `HeroScrollEffect.tsx` | Efecto scroll en hero | ✅ Activo | Animación scroll |
| `OptimizedImage.tsx` | Componente imagen optimizada | ✅ Activo | Next Image wrapper |
| `PageHero.tsx` | Hero genérico página | ✅ Activo | Reutilizable |
| `PagePreloader.tsx` | Preloader de página | ✅ Activo | Crítico primera carga |
| `PageTransition.tsx` | Transición entre páginas | ✅ Activo | Framer Motion |
| `PublicationDateText.tsx` | Texto fecha publicación | ✅ Activo | Formato especial fechas |
| `RevealSection.tsx` | Sección con reveal | ✅ Activo | Animación entrada |
| `ScrollDecorator.tsx` | Decoración al scroll | ✅ Activo | Visual effect |
| `SectionArrow.tsx` | Flecha sección | ✅ Activo | CTA visual |
| `SectionHeading.tsx` | Encabezado sección | ✅ Activo | Tipografía estándar |
| `SmoothScrollProvider.tsx` | Scroll suave | ✅ Activo | UX improvement |
| `StarField.tsx` | Campo de estrellas | ✅ Activo | Background decorator |
| `ThemeProvider.tsx` | Proveedor de tema (claro/oscuro) | ✅ Activo | next-themes |
| `ThemeToggle.tsx` | Toggle tema | ✅ Activo | Botón día/noche |
| `VoidSquare.tsx` | Cuadrado vacío | ⚠️ Sin uso | Elemento CSS sin lógica |
| `WhatsAppFloat.tsx` | Botón flotante WhatsApp | ✅ Activo | FAB fijo |

---

## 2. ESTRUCTURA DE PÁGINAS

### 2.1 Rutas Públicas (`app/`)

| Ruta | Página | Archivo | Estado |
|---|---|---|---|
| `/` | Home | `app/page.tsx` | ✅ Activo |
| `/noticias` | Noticias | `app/noticias/page.tsx` | ✅ Activo |
| `/equipo` | Equipo/Jugadores | `app/equipo/page.tsx` | ✅ Activo |
| `/club` | Club/Institución | `app/club/page.tsx` | ✅ Activo |
| `/torneos` | Torneos | `app/torneos/page.tsx` | ✅ Activo |
| `/entrenamientos` | Entrenamientos | `app/entrenamientos/page.tsx` | ✅ Activo |
| `/contacto` | Contacto/Formularios | `app/contacto/page.tsx` | ✅ Activo |
| `/documentos` | Documentos | `app/documentos/page.tsx` | ✅ Activo |
| `/formulario-miembros-2026` | Inscripción miembros 2026 | `app/formulario-miembros-2026/page.tsx` | ✅ Activo |

### 2.2 Rutas Administrativas (`app/admin/`)

| Ruta | Función | Archivo |
|---|---|---|
| `/admin/login` | Autenticación | `app/admin/login/page.tsx` |
| `/admin` | Panel principal | Panel renderizado por `AdminPortal.tsx` |
| `/admin/error` | Página error | `app/admin/error/page.tsx` |

### 2.3 Configuración de Página

| Archivo | Propósito |
|---|---|
| `app/layout.tsx` | Layout global, metadata, providers |
| `app/template.tsx` | Template de página (transiciones) |
| `app/globals.css` | Estilos globales (~1300 líneas) |
| `app/robots.ts` | Configuración robots.txt |
| `app/sitemap.ts` | Mapa de sitio XML |

---

## 3. SISTEMA DE DATOS (lib/)

### 3.1 Stores Prisma (BD con API local)

| Archivo | Funciones Principales | Modelo Prisma | Estado |
|---|---|---|---|
| `news-store.ts` | `readNews()`, `createNews()`, `updateNews()`, `deleteNews()`, `restoreDefaultNews()` | `Noticia` | ✅ Activo |
| `training-store.ts` | `readTrainings()`, `createTraining()`, `updateTraining()`, `deleteTraining()`, `restoreDefaultTrainings()` | `Entrenamiento` | ✅ Activo |
| `player-store.ts` | `readPlayers()`, `createPlayer()`, `updatePlayer()`, `deletePlayer()`, `restoreDefaultPlayers()` | `Jugador` | ✅ Activo |
| `tournament-store.ts` | `readTournaments()`, `createTournament()`, `updateTournament()`, `deleteTournament()` | `Torneo` | ✅ Activo |
| `current-tournament-store.ts` | `readCurrentTournament()`, `readAllCurrentTournaments()`, `createCurrentTournament()`, `updateCurrentTournament()`, `deleteCurrentTournament()` | `TorneoActual` | ✅ Activo |

### 3.2 Autenticación

| Archivo | Propósito | Observaciones |
|---|---|---|
| `auth.ts` | NextAuth config (`authOptions`) | GitHub + password admin |
| `admin-auth.ts` | Validación autorización admin API | Función `isAdminApiAuthorized()` |
| `admin-profiles.ts` | Perfiles admin (owner/content) | Datos mockup, no DB |
| `auth-errors.ts` | Mensajes error autenticación | Traducciones español |

### 3.3 Gestión de Contenido

| Archivo | Función |
|---|---|
| `content.ts` | Datos estáticos: club, social, ODS, players, trainings, news, navLinks |
| `content-overrides.ts` | Lee/escribe overrides de contenido en JSON |
| `editable-content.ts` | Define campos editables globales |
| `content-expiry.ts` | Limpieza automática contenido expirado |
| `publish-status.ts` | Utilitarios estado publicación |

### 3.4 Archivos y Upload

| Archivo | Función |
|---|---|
| `upload-store.ts` | `saveUpload()`, `readUploadMedia()`, `removeUpload()`, `removeUploads()` |
| `file-storage.ts` | Gestión almacenamiento (disco/DB) |
| `documents.ts` | Documentos oficiales (PDF/imagen) |

### 3.5 Utilidades y Validadores

| Archivo | Funciones Principales | Líneas |
|---|---|---|
| `validators.ts` | `normalizeText()`, `sanitizeText()`, `validateTextField()`, `validateTrainingTitle()`, etc | ~170 |
| `site.ts` | Metadata SEO, contacto, URLs | ~40 |
| `constants.ts` | Re-exporta site.ts + WHATSAPP_URL | ~5 |
| `fonts.ts` | Definición de todas las fuentes Google Fonts | 80 |
| `motion.ts` | Variantes Framer Motion (`easeOut`, `pageVariants`, etc) | ~25 |
| `preloader.ts` | `PRELOADER_EASE` constant | ~5 |

### 3.6 Integraciones Externas

| Archivo | Servicio | Funciones |
|---|---|---|
| `emailjs.ts` | EmailJS | `sendEmailJsMessage()`, `buildEmailJsTemplateParams()` |
| `email.ts` | Gmail/Mailto | `buildGmailComposeUrl()`, `buildMailtoUrl()` |
| `ods-embed.ts` | ODS infografías | `getOdsEmbedSource()`, `odsPdfViewerSrc()` |
| `ods-drive.ts` | Google Drive | `odsDrivePreviewUrl()` |
| `build-ods-infographic-svg.ts` | SVG ODS | `buildOdsInfographicSvg()` |

### 3.7 Prisma

| Archivo | Propósito |
|---|---|
| `prisma.ts` | Cliente Prisma singleton |

---

## 4. BASE DE DATOS (Prisma)

### 4.1 Esquema Actual (`prisma/schema.prisma`)

**Modelos:**

```
1. Noticia
   - id (PK)
   - titulo, resumen, contenido, imagen, fecha, fechaFin
   - categoria, publicada
   - createdAt, updatedAt
   - Índices: fecha, fechaFin, (publicada, fecha)

2. Entrenamiento
   - id (PK)
   - titulo, descripcion, imagen, imagenes[], videos[]
   - fecha, fechaFin
   - oculto, publicado
   - createdAt, updatedAt
   - Índices: fecha, fechaFin, (publicado, fecha)

3. Jugador
   - id (PK)
   - nombre, numero, posicion, bio, imagen
   - categoria
   - convocado, visiblePublico, publicado
   - createdAt, updatedAt
   - Índices: (publicado, visiblePublico), categoria

4. Torneo
   - id (PK)
   - nombre, descripcion, programacion, sede, categoria, rival
   - imagen, fechaInicio, fechaFin
   - estado (actual/histórico), publicado
   - createdAt, updatedAt
   - Índices: (estado, fechaInicio), (publicado, fechaInicio), fechaFin

5. TorneoActual
   - id (PK)
   - nombre, descripcion, programacion, sede, categoria, rival
   - imagen, imagenes[]
   - fechaInicio, fechaFin
   - publicado
   - createdAt, updatedAt
   - Índices: (publicado, fechaInicio), fechaFin

6. ArchivoSubido
   - id (PK: UUID)
   - seccion, mimeType, contenido (Bytes)
   - createdAt
   - Índices: seccion
```

**Campos Obsoletos Potenciales:**
- `Entrenamiento.oculto` vs `publicado` (redundancia lógica)
- `Jugador.visiblePublico` vs `publicado` (posible confusión)
- `Torneo.estado` como String (considera enum)
- `Torneo` vs `TorneoActual` (duplicados estructurales)

**Indexación Adecuada:** ✅ Bien para consultas actuales

---

## 5. API ROUTES

### 5.1 Endpoints Públicos (GET)

| Ruta | Propósito | Métodos | Headers |
|---|---|---|---|
| `/api/news` | Lectura de noticias | GET, POST | x-admin-key (POST) |
| `/api/trainings` | Lectura entrenamientos | GET, POST | x-admin-key (POST) |
| `/api/players` | Lectura jugadores | GET, POST | x-admin-key (POST) |
| `/api/tournaments` | Lectura torneos | GET, POST | x-admin-key (POST) |
| `/api/current-tournament` | Lectura torneos actuales | GET, POST | x-admin-key (POST) |
| `/api/media/[id]` | Obtener archivo subido | GET | - |
| `/api/uploads/[...path]` | Archivos públicos | GET | - |

### 5.2 Endpoints Administrativos

| Ruta | Función | Auth | Status |
|---|---|---|---|
| `/api/admin/session` | Sesión admin actual | ✅ NextAuth | ✅ Activo |
| `/api/content-overrides` | GET/POST overrides contenido | ✅ API Key | ✅ Activo |

### 5.3 Endpoints Cron/Mantenimiento

| Ruta | Función | Frecuencia | Status |
|---|---|---|---|
| `/api/cron/cleanup-news` | Elimina noticias expiradas | Manual | ✅ Activo |
| `/api/cron/cleanup-expired` | Limpia todos los contenidos | Manual | ✅ Activo |

### 5.4 Endpoints de Registro

| Ruta | Propósito | Status |
|---|---|---|
| `/api/registration` | Inscripción formulario contacto | ✅ Activo |

### 5.5 NextAuth

| Ruta | Propósito | Providers |
|---|---|---|
| `/api/auth/[...nextauth]` | Rutas NextAuth | GitHub, Credentials |

**Problemas Encontrados:**
- En [AUDITORIA_RECONSTRUCCION_REAL_SPORTING.md](AUDITORIA_RECONSTRUCCION_REAL_SPORTING.md): "El manager de jugadores enviaba `x-training-key` pero la API valida `x-admin-key`" → ✅ Verificado que está corregido

---

## 6. MIDDLEWARE Y AUTENTICACIÓN

### 6.1 Middleware Global (`middleware.ts`)

```typescript
- Ruta protegida: /admin/:path*
- Validación: Token isAdmin de NextAuth
- Redirect: /admin/login si no autenticado
- Error page: /admin/error
```

**Estado:** ✅ Correcto

### 6.2 NextAuth Config (`lib/auth.ts`)

```typescript
Providers:
- GitHub OAuth (entorno: GITHUB_ID, GITHUB_SECRET)
- Credentials: Admin password-based

Admin Profiles:
- from lib/admin-profiles.ts
- Tipos: "owner" | "content"
- Roles determinan permisos en AdminPortal
```

**Estado:** ✅ Funcional

### 6.3 API Authorization (`lib/admin-auth.ts`)

```typescript
- Valida header x-admin-key
- Compara contra NEXT_ADMIN_KEY env
- Devuelve booleano para acceso
```

**Estado:** ✅ Implementado

---

## 7. ASSETS Y RECURSOS PÚBLICOS

### 7.1 Estructura `/public`

```
public/
├── brand/
│   ├── ods/
│   │   ├── ods-1-infografia.svg (Fin pobreza)
│   │   ├── ods-5-infografia.svg (Igualdad género)
│   │   ├── ods-10-infografia.svg (Reducir desigualdades)
│   ├── gallery-team.jpg
│   └── [otros logos]
├── ODS/ (SVGs infografías ODS)
├── fotos/
│   ├── large/ (Imágenes grandes optimizadas)
│   ├── medium/ (Imágenes medianas)
│   ├── small/ (Thumbnails)
│   ├── webp/ (Versiones WebP)
│   └── .gitkeep
├── players/ (Fotos de jugadores)
├── trainings/ (Fotos entrenamientos)
├── uploads/ (Archivos cargados dinámicamente)
│   ├── news/
│   ├── players/
│   └── trainings/
├── Preloader.json (Lottie animation)
├── banner.png (OG image)
├── banner claro.png (Hero light mode)
├── logo.png
├── balon.png
├── zapatilla.jpeg
├── preload.png
└── [PDFs documentos]
```

### 7.2 Archivos Potencialmente Sin Uso

| Archivo | Ubicación | Análisis | Estado |
|---|---|---|---|
| `balon.png` | `/public/` | Búsqueda: No referenciado en código | ⚠️ Probablemente sin uso |
| `zapatilla.jpeg` | `/public/` | Búsqueda: No referenciado en código | ⚠️ Probablemente sin uso |
| `preload.png` | `/public/` | Existe pero preferencia a Preloader.json | ⚠️ Posible backup |
| SVGs ODS antiguos | `/public/ODS/` | Reemplazados por infografías dinámicas | ⚠️ Revisar |
| PDFs | `/public/` | Documentos institucionales estáticos | ✅ Activos |

### 7.3 CSS Muerto

**Clases CSS sin uso identificadas:**

1. `.void-overlay` y `.void-hole` - Estilos en globals.css para `VoidSquare.tsx`
   - El componente existe pero nunca se renderiza
   - CSS: ~20 líneas

2. `.grid-overlay` - Usado en `PageHero.tsx` 
   - Verificado: ✅ En uso

3. `.image-card-overlay` - Usado en multiple tarjetas
   - Verificado: ✅ En uso

**Resumen:** Mínimo CSS muerto (~20 líneas en `.void-overlay`)

---

## 8. DEPENDENCIAS Y PAQUETES

### 8.1 Dependencias Producción

```json
{
  "@emailjs/browser": "^4.4.1",           // Emails cliente
  "@prisma/adapter-pg": "^7.8.0",         // Adapter PostgreSQL
  "@prisma/client": "^7.8.0",             // ORM
  "@types/nodemailer": "^8.0.0",          // Types (sin usar nodemailer en app)
  "countup.js": "^2.10.0",                // Animación contadores
  "docker": "^1.0.0",                     // 🔴 SIN USAR (listado pero no importado)
  "framer-motion": "^12.15.0",            // Animaciones
  "gsap": "^3.15.0",                      // Animaciones alternativas
  "lottie-react": "^2.4.1",               // Animaciones Lottie (Preloader.json)
  "lucide-react": "^0.511.0",             // Iconos
  "next": "^15.3.3",                      // Framework
  "next-auth": "^4.24.14",                // Autenticación
  "next-themes": "^0.4.6",                // Dark mode
  "nodemailer": "^7.0.13",                // 🔴 SIN USAR (tipos presentes)
  "pg": "^8.21.0",                        // Driver PostgreSQL
  "prisma": "^7.8.0",                     // ORM CLI
  "react": "^19.1.0",                     // React
  "react-dom": "^19.1.0",                 // React DOM
  "resend": "^4.8.0",                     // 🔴 SIN USAR (no se usa API Resend)
  "sharp": "^0.34.5"                      // Optimización imágenes
}
```

**Dependencias sin uso:**
1. `docker` - Paquete npm innecesario
2. `nodemailer` - Tipos presentes pero no se usa la librería (usa EmailJS)
3. `resend` - Paquete pero se usa EmailJS en lugar de Resend

### 8.2 DevDependencies

```json
{
  "@eslint/eslintrc": "^3.3.1",
  "@tailwindcss/postcss": "^4.1.8",
  "@types/gsap": "^1.20.2",
  "@types/node": "^22.15.21",
  "@types/react": "^19.1.6",
  "@types/react-dom": "^19.1.5",
  "dotenv": "^17.4.2",
  "eslint": "^9.27.0",
  "eslint-config-next": "^15.3.3",
  "tailwindcss": "^4.1.8",
  "typescript": "^5.8.3"
}
```

**Estado:** ✅ Adecuadas

---

## 9. COMPONENTES DUPLICADOS Y SIMILARES

### 9.1 Duplicados Identificados

#### **GRUPO 1: WhatsApp (Alias + Original)**

**Archivos:**
- `components/WhatsAppFAB.tsx` (alias)
- `components/ui/WhatsAppFloat.tsx` (original)

**Análisis:**
```typescript
// WhatsAppFAB.tsx
export { WhatsAppFloat as WhatsAppFAB } from "@/components/ui/WhatsAppFloat";
```

**Impacto:** ⚠️ Redundante pero sin duplicación de código
- El alias es útil para compatibilidad
- Recomendación: Eliminar si no hay código antiguo que lo use

**Uso:**
- `WhatsAppFloat` se usa en `app/layout.tsx` y otros
- `WhatsAppFAB` no se encuentra importado en búsquedas
- **Acción:** ✂️ Puede eliminarse el alias

---

#### **GRUPO 2: Newsletter/Email**

**Componentes relacionados:**
- `lib/emailjs.ts` - EmailJS API
- `lib/email.ts` - Gmail/Mailto URLs
- `@types/nodemailer` - Types sin usar
- `nodemailer` package - Sin usar

**Análisis:**
- EmailJS es la solución de email actual
- Email.ts es helper para URLs (no API)
- Nodemailer types/package: redundantes

**Acción:** ✂️ Remover `nodemailer` y `@types/nodemailer` de package.json

---

#### **GRUPO 3: Animaciones (GSAP vs Framer Motion)**

**Librerías:**
- `gsap@3.15.0` - Librería animaciones
- `framer-motion@12.15.0` - Librería animaciones React

**Búsqueda de uso:**
- GSAP: `@types/gsap` está en devDeps pero ¿se usa en código?
- Framer Motion: Ampliamente usado en componentes

**Análisis:**
```
Búsqueda 'gsap' en componentes: SIN RESULTADOS
Búsqueda 'framer-motion': ~30+ componentes
```

**Acción:** ⚠️ Verificar si GSAP se usa, si no → remover

---

### 9.2 Componentes Similares (No Duplicados)

#### **Cards del Sistema**

| Componente | Especialización | Similar a |
|---|---|---|
| `NewsCard.tsx` | Noticia + metadata | Genérica |
| `TrainingCard.tsx` | Entrenamiento + galería | NewsCard |
| `TournamentCard.tsx` | Torneo simple | NewsCard |
| `CurrentTournamentCard.tsx` | Torneo destacado | TournamentCard |
| `PlayerCard.tsx` | Jugador pequeño | Genérica |
| `OdsFlipCard.tsx` | Tarjeta flip 3D | Especializada |

**Patrón:** ✅ Diseño adecuado
- Cada card tiene lógica especializada
- No hay duplicación de código
- Herencia conceptual clara

---

#### **Managers (Admin CRUD)**

| Componente | Modelo | Especialización |
|---|---|---|
| `NewsManager.tsx` | Noticia | CRUD completo |
| `TrainingManager.tsx` | Entrenamiento | CRUD + multimedia |
| `TournamentManager.tsx` | Torneo | CRUD |
| `CurrentTournamentManager.tsx` | TorneoActual | CRUD + secciones |
| `PlayerManager.tsx` | Jugador | CRUD + categorías |

**Patrón:** ⚠️ Código repetido en formularios
- Cada manager reimplementa validación de formularios
- Estructura similitud: form state, handlers, submit
- **Oportunidad de refactoring:** Crear `useFormManager()` hook o base component

---

#### **Grillas de Contenido**

| Componente | Contenido | Similar a |
|---|---|---|
| `NewsGrid.tsx` | Noticias | Genérica |
| `TrainingGrid.tsx` | Entrenamientos | NewsGrid |
| `PlayerGrid.tsx` | Jugadores | NewsGrid |

**Patrón:** ✅ Adecuado (componentes ligeros)

---

## 10. CÓDIGO MUERTO Y SIN USO

### 10.1 Componentes Sin Uso Encontrados

#### **1. `VoidSquare.tsx`** 🔴

**Ubicación:** `components/ui/VoidSquare.tsx`

**Código:**
```typescript
export default function VoidSquare() {
  return (
    <div className="void-overlay" aria-hidden>
      <div className="void-hole" />
    </div>
  );
}
```

**CSS asociado:**
```css
.void-overlay { ... }
.void-overlay .void-hole { ... }
```

**Búsqueda de uso:** NO ENCONTRADO en código
- No importado en ningún lugar
- No renderizado en ninguna página
- CSS: ~30 líneas sin uso

**Acción:** ✂️ **Eliminar componente y CSS**

---

#### **2. `AnimatedGrid.tsx`** ⚠️

**Ubicación:** `components/AnimatedGrid.tsx`

**Código:**
```typescript
export default function AnimatedGrid() {
  // Componente de grilla animada
  return (...)
}
```

**Búsqueda de uso:** NO ENCONTRADO en búsquedas activas
- Grep: No resultados
- Posible: Usado en layout global o dinámicamente

**Acción:** ⚠️ **Verificar si se usa antes de eliminar**

---

#### **3. `UploadMock.tsx`** ⚠️

**Ubicación:** `components/trainings/UploadMock.tsx`

**Estado:** Etiquetado como "Demo — subida real en fase 2"

**Contenido:** Formulario deshabilitado (todos inputs `disabled`)

**Búsqueda de uso:**
- `README.md`: "Conectar `UploadMock` a la API"
- No aparece en `app/entrenamientos/page.tsx` actual

**Acción:** ✂️ **Eliminar o reemplazar con componente real**

---

#### **4. `Cursor.tsx`** ⚠️

**Ubicación:** `components/ui/Cursor.tsx`

**Función:** Cursor personalizado animado (solo desktop)

**Búsqueda de uso:** 
- No encontrado en imports
- CSS module `Cursor.module.css` sin referencias

**Impacto:** ~100 líneas sin usar + CSS module

**Acción:** ⚠️ **Verificar si está activo globalmente en layout**

---

### 10.2 Imports Sin Uso en Componentes

#### **`CategoryShowcase.tsx`**
```typescript
import { PRELOADER_EASE } from "@/lib/preloader";  // ❌ Definido pero no usado
```

#### **`HomeContactBand.tsx`**
```typescript
import { PRELOADER_EASE } from "@/lib/preloader";  // ❌ Definido pero no usado
```

**Acción:** Remover imports sin usar

---

### 10.3 Variables no Utilizadas

**En compilación (de logs):**
- `index` no usado en `OdsCommitment.tsx` (línea 22)
- `index` no usado en `VisionMission.tsx` (línea 36)

---

### 10.4 Archivos de Documentación Obsoletos

**Encontrados en búsqueda anterior:**
- Archivos `PRELOADER_*.md` - Eliminados según AUDITORIA
- `Navbar.backup.tsx` - Eliminado
- `NavbarOptimized.tsx` - Eliminado

**Estado:** ✅ Ya limpiados

---

## 11. CSS MUERTO

### 11.1 Clases sin Uso o Poco Usadas

#### **`.void-overlay` y `.void-hole`**

**Archivo:** `app/globals.css` (líneas ~1050-1090)

**Líneas:** ~40

**Usado por:** `VoidSquare.tsx` (componente sin uso)

**Acción:** ✂️ **Eliminar junto con componente**

---

#### **Fuentes No Precargadas**

**Archivo:** `lib/fonts.ts`

**Fuentes definidas pero NO en `allFonts`:**
- `playfairDisplay` ← preload: false
- `newsreader` ← preload: false
- `fraunces` ← preload: false
- `rajdhani` ← preload: false
- `sora` ← preload: false

**Búsqueda de uso:** Ningún componente usa estas variables
- Pueden descargarse si se usan las clases CSS `--font-display`, etc.
- Pero JS nunca las activa

**Acción:** ✅ Correcto (lazy loading optimizado)

---

### 11.2 CSS Utilizado Correctamente

**Búsqueda: `.grid-overlay`, `.image-card-overlay`, `.glass`, `btn-green`, etc.**

```
✅ Todos tienen componentes que los importan
✅ Sin redundancias detectadas
✅ Tailwind bien organizado
```

---

## 12. PROBLEMAS IDENTIFICADOS

### 🔴 CRÍTICOS

#### **1. Dependencias Sin Usar en package.json**

**Paquetes instalados pero no importados:**

| Paquete | Versión | Impacto | Acción |
|---|---|---|---|
| `docker` | 1.0.0 | Tamaño bundle | Remover |
| `nodemailer` | 7.0.13 | No usado (usa EmailJS) | Remover |
| `resend` | 4.8.0 | No usado (usa EmailJS) | Remover |
| `@types/nodemailer` | 8.0.0 | Types sin usar | Remover |

**Ahorro potencial:** ~500KB tamaño bundle (si se optimiza package-lock)

---

#### **2. Componentes sin Uso Ocupan Espacio**

**Componentes que pueden eliminarse:**
- `VoidSquare.tsx` (~20 líneas)
- `UploadMock.tsx` (~100 líneas)
- Potencialmente: `AnimatedGrid.tsx`, `Cursor.tsx`

**Ahorro:** ~250 líneas de código sin cambio funcional

---

### ⚠️ MODERADOS

#### **3. Alias Redundante (WhatsAppFAB)**

**Archivo:** `components/WhatsAppFAB.tsx`

**Impacto:** Carga de módulo sin valor
- No usado en búsquedas
- Posible legacy de refactoring

**Acción:** Eliminar si no hay código antiguo

---

#### **4. Variables no Usadas en Componentes**

```typescript
// CategoryShowcase.tsx, línea 9
import { PRELOADER_EASE } from "@/lib/preloader";  // ❌ Not used

// HomeContactBand.tsx, línea 8  
import { PRELOADER_EASE } from "@/lib/preloader";  // ❌ Not used
```

**Acción:** ESLint ya lo detecta (warning)

---

#### **5. Duplicación de Lógica en Managers**

**Archivos:**
- `NewsManager.tsx` (~400 líneas)
- `TrainingManager.tsx` (~600 líneas)
- `TournamentManager.tsx` (~350 líneas)
- `CurrentTournamentManager.tsx` (~400 líneas)
- `PlayerManager.tsx` (~200 líneas)

**Patrón repetido:**
```typescript
const [items, setItems] = useState([])
const [formData, setFormData] = useState({...})
const [editingId, setEditingId] = useState(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [message, setMessage] = useState("")

const handleAdd = () => { ... }
const handleEdit = () => { ... }
const handleDelete = () => { ... }
const handleSubmit = async () => { ... }
```

**Oportunidad:** Crear hook `useContentManager()` para compartir lógica

**Impacto:** Reducir ~200 líneas duplicadas

---

#### **6. GSAP Sin Usar**

**Evidencia:**
- `@types/gsap` en devDeps
- `gsap@3.15.0` en deps
- Búsqueda: Sin importaciones en código

**Acción:** Verificar si se usa; si no, remover

---

### ℹ️ INFORMATIVOS

#### **7. CSS Module sin Uso Claro**

**Archivo:** `components/ui/Cursor.module.css`

**Asociado a:** `Cursor.tsx` (componente sin uso detectado)

**Acción:** Verificar si `Cursor.tsx` está activo

---

#### **8. Archivos Assets Sin Referencia**

**En `/public/`:**
- `balon.png` - No referenciado
- `zapatilla.jpeg` - No referenciado
- `preload.png` - Preferencia a Lottie

**Acción:** Remover o documentar para qué son

---

## 13. RECOMENDACIONES

### 🎯 PRIORIDAD ALTA

#### **1. Limpiar package.json**

```bash
# Remover dependencias sin uso
npm uninstall docker nodemailer resend @types/nodemailer

# Verificar si GSAP se usa
grep -r "gsap" app components --include="*.tsx" --include="*.ts"
# Si no hay resultados: npm uninstall gsap @types/gsap
```

**Impacto:** Reducir tamaño bundle y build time

---

#### **2. Eliminar Componentes Sin Uso**

**Remover:**
- `components/ui/VoidSquare.tsx`
- `components/trainings/UploadMock.tsx`
- `components/WhatsAppFAB.tsx` (si no se usa)
- Estilos `.void-overlay` de `app/globals.css`

**Comando:**
```bash
rm components/ui/VoidSquare.tsx
rm components/trainings/UploadMock.tsx
# Remover imports de globals.css
```

---

#### **3. Remover Imports Sin Usar**

```typescript
// CategoryShowcase.tsx
- import { PRELOADER_EASE } from "@/lib/preloader";

// HomeContactBand.tsx  
- import { PRELOADER_EASE } from "@/lib/preloader";
```

**ESLint ya detecta esto con warning**

---

#### **4. Verificar Cursor.tsx**

```bash
grep -r "Cursor" app components --include="*.tsx" | grep import
grep -r "cursor" app/layout.tsx app/globals.css
```

Si no se usa: Eliminar `Cursor.tsx` y `Cursor.module.css`

---

### 🎯 PRIORIDAD MEDIA

#### **5. Refactorizar Managers**

**Crear hook compartido:**

```typescript
// lib/useContentManager.ts
export function useContentManager<T>(
  fetchFn: () => Promise<T[]>,
  createFn: (data: T) => Promise<void>,
  updateFn: (id: string, data: T) => Promise<void>,
  deleteFn: (id: string) => Promise<void>,
) {
  const [items, setItems] = useState<T[]>([])
  const [formData, setFormData] = useState<Partial<T>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  
  // ... lógica compartida
  
  return { items, formData, setFormData, handleAdd, handleEdit, ... }
}
```

**Aplicar a:**
- `NewsManager.tsx`
- `TrainingManager.tsx`
- `TournamentManager.tsx`
- `PlayerManager.tsx`

**Ahorro:** ~200-300 líneas duplicadas

---

#### **6. Crear Carpeta `/lib/types`**

**Centralizar tipos:**

```
lib/
├── types/
│   ├── content.ts      (Noticia, Training, Player, etc)
│   ├── tournament.ts   (Torneo, TorneoActual)
│   └── api.ts          (Responses, Requests)
└── [otros]
```

**Beneficio:** Mejor organización, reutilización

---

#### **7. Documentar Assets Públicos**

**Crear `public/ASSETS.md`:**

```markdown
# Assets Públicos

## Imágenes
- balon.png - Ej. ...
- zapatilla.jpeg - Ej. ...

## Optimización
- fotos/: Imágenes optimizadas por tamaño
- fotos/webp/: Versiones WebP

## Obsoletos
- preload.png - Reemplazado por Preloader.json
```

---

### 🎯 PRIORIDAD BAJA

#### **8. Verificar Librerías Alternativas**

**Revisar si:**
- Framer Motion cubre todas las necesidades (¿se necesita GSAP?)
- EmailJS es la mejor opción o cambiar a Resend

---

#### **9. Tests Unitarios**

**Crear tests para:**
- Stores Prisma (news-store, etc)
- Validadores
- Hooks personalizados

---

#### **10. Performance Audit**

```bash
npm run build
# Analizar:
# - Bundle size por componente
# - Unused CSS
# - Code splitting oportunidades
```

---

## CHECKLIST DE LIMPIEZA

```markdown
### Fase 1: Immediate (~1 hora)
- [ ] Remover imports sin usar (CategoryShowcase, HomeContactBand)
- [ ] Eliminar VoidSquare.tsx + CSS
- [ ] Remover UploadMock.tsx  
- [ ] Eliminar WhatsAppFAB.tsx alias

### Fase 2: Package.json (~30 min)
- [ ] Remover docker, nodemailer, resend de deps
- [ ] Remover @types/nodemailer de devDeps
- [ ] npm install (actualizar lock)
- [ ] Verificar GSAP: si no se usa, remover

### Fase 3: Documentación (~30 min)
- [ ] Crear public/ASSETS.md
- [ ] Actualizar QUICK_REFERENCE.md
- [ ] Documentar Cursor.tsx status

### Fase 4: Refactoring (~4-6 horas)
- [ ] Crear useContentManager hook
- [ ] Refactorizar todos los Managers
- [ ] Tests unitarios básicos

### Fase 5: Optimización (~2-3 horas)
- [ ] Ejecutar npm run build
- [ ] Analizar bundle con webpack-bundle-analyzer
- [ ] Code-split dinámico donde sea posible
```

---

## REFERENCIAS DE ARCHIVOS

### Archivos Críticos Relacionados
- [package.json](package.json) - Dependencias
- [prisma/schema.prisma](prisma/schema.prisma) - Base de datos
- [app/layout.tsx](app/layout.tsx) - Layout global
- [middleware.ts](middleware.ts) - Autenticación
- [AUDITORIA_RECONSTRUCCION_REAL_SPORTING.md](AUDITORIA_RECONSTRUCCION_REAL_SPORTING.md) - Historia limpieza

### Documentación Existente
- [README.md](README.md) - Setup general
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Features
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Referencia rápida

---

## CONCLUSIONES

El proyecto Real Sporting tiene una estructura **solida y bien organizada**, pero con oportunidades claras de optimización:

✅ **Fortalezas:**
- Arquitectura Next.js moderna y escalable
- Componentes bien separados por funcionalidad
- Buen sistema de stores Prisma
- SEO técnico implementado (robots, sitemap, JSON-LD)
- Autenticación robusta (NextAuth + custom)

⚠️ **Áreas de Mejora:**
- Dependencias sin usar en package.json (~1.5MB potencial)
- Componentes sin uso pueden eliminarse (~250 líneas)
- Duplicación de lógica en Managers (~200 líneas)
- Algunos assets públicos sin referencia clara

💡 **Siguiente Paso Recomendado:**
1. Ejecutar checklist Fase 1 (limpieza rápida)
2. Actualizar package.json (Fase 2)
3. Refactorizar Managers con hook compartido (Fase 4)
4. Ejecutar `npm run build` y medir resultados

---

**Generado:** 12 de junio de 2026  
**Analista:** AI Code Reviewer
