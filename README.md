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

Después del despliegue ejecuta `npx prisma db push` para crear la tabla
`ArchivoSubido`. Las noticias antiguas cuya imagen ya se perdió deben volver a
subirse una vez desde el panel admin.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
