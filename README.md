# Club Deportivo Real Sporting - Sitio web oficial

## Sistema de fotos

Agrega imágenes originales en `public/fotos`. En la web esa carpeta se sirve como
`/fotos`.

Comandos disponibles:

- `npm run fotos:optimize`: genera versiones en `small`, `medium`, `large` y `webp`.
- `npm run fotos:watch`: observa la carpeta y procesa imágenes nuevas al agregarlas.

Sitio multi-página con Next.js 15, diseño futurista minimalista, secciones institucionales, plantilla, entrenamientos (demo) y contacto.

## Requisitos

- Node.js 18.18 o superior
- npm, pnpm o yarn

## Instalación y desarrollo

```bash
cd ~/Projects/real-sporting-usme
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Base de datos (Neon)

El proyecto usa **PostgreSQL en Neon**. La URL va en `.env` (no se sube a git).

1. Entra en [Neon Console](https://console.neon.tech) → tu proyecto → **Connect**.
2. Elige **Prisma** y copia la connection string.
3. En el proyecto:

```bash
cp .env.example .env   # solo la primera vez
nano .env              # pega DATABASE_URL de Neon
npm run db:push
```

Neon da **dos** URLs en Connect:

```env
# App (Vercel) — host con -pooler
DATABASE_URL=postgresql://...@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
# Migraciones locales (npm run db:push) — sin -pooler
DIRECT_URL=postgresql://...@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

En **Prisma 7** no pongas `url = env("DATABASE_URL")` en `schema.prisma`; va en `prisma.config.ts` (ya configurado en este repo).

En **Vercel**, usa la misma `DATABASE_URL` en Environment Variables. Después de cambiar el schema, ejecuta `npm run db:push` en local con esa URL para crear tablas nuevas (`fechaFin`, `ArchivoSubido`, etc.).

### Ya tienes `DATABASE_URL` en Vercel pero no la ves

Vercel **no muestra** el valor de variables sensibles después de guardarlas (es normal).

**Opción A — Desde Neon (la más fácil)**  
La base está en Neon aunque la uses en Vercel:

1. [console.neon.tech](https://console.neon.tech) → el mismo proyecto que enlazaste a Vercel  
2. **Connect** → **Prisma** → copiar connection string  
3. Pegar en tu `.env` local → `npm run db:push`

**Opción B — Descargar variables con Vercel CLI**

```bash
npm i -g vercel
vercel login
cd ~/RealSporting-main
vercel link
vercel env pull .env
```

Eso escribe las variables del proyecto (incluida `DATABASE_URL`) en `.env`. Luego:

```bash
npm run db:push
```

**Opción C — Rotar en Vercel**  
Settings → Environment Variables → `DATABASE_URL` → Edit → pega una URL nueva de Neon y cópiala al guardar (solo se ve al escribirla).

## Páginas

| Ruta | Contenido |
|------|-----------|
| `/` | Inicio — hero, visión/misión, últimos entrenamientos, redes |
| `/club` | Historia, misión, visión, valores, timeline |
| `/equipo` | Plantilla de jugadores |
| `/entrenamientos` | Galería de sesiones + formulario demo |
| `/contacto` | Instagram, Facebook, correo, teléfono |

## Personalizar contenido

Edita **[`lib/content.ts`](lib/content.ts)**:

- `club` — nombre, misión, visión, valores, historia
- `social` — URLs de Instagram/Facebook, email, teléfono, ubicación
- `players` — plantilla
- `trainings` — sesiones de entrenamiento

## Personalizar imágenes

| Archivo | Uso |
|---------|-----|
| `public/logo.png` | Logo del club (reemplázalo por tu escudo) |
| `public/banner.png` | Banner del hero |
| `public/trainings/*.svg` | Fotos de entrenamientos |
| `public/players/*.svg` | Fotos de jugadores |

## Fase 2 — Subida real de entrenamientos

Cuando quieras habilitar subidas:

1. Crear `app/api/trainings/route.ts` con validación de archivos.
2. Integrar almacenamiento (Cloudinary, S3 o `public/uploads`).
3. Añadir autenticación simple (variable `ADMIN_SECRET` en `.env`).
4. Conectar `UploadMock` a la API y reemplazar el array estático por fetch.

## Producción

```bash
npm run build
npm start
```

En Vercel, las imágenes y videos subidos desde el panel admin se guardan en
PostgreSQL (`ArchivoSubido`) y se sirven por `/api/media/{id}`. En desarrollo
local o en un VPS con `REALSPORTING_STORAGE_DIR`, los archivos pueden guardarse
en disco bajo `public/uploads/`.

Después del despliegue configura `DATABASE_URL` en Vercel y ejecuta `npm run db:push`
con la misma URL (o usa el panel de tu proveedor Postgres). Eso crea tablas como
`ArchivoSubido`, `fechaFin` en noticias/entrenamientos, etc.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
