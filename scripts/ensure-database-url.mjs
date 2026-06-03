import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const envExamplePath = resolve(root, ".env.example");

config({ path: envPath });
config({ path: envExamplePath, override: false });

function pickUrl() {
  const direct =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL_UNPOOLED?.trim();
  const pooled = process.env.DATABASE_URL?.trim();

  return direct || unpooled || pooled;
}

const url = pickUrl();

const isPlaceholder =
  !url ||
  url.includes("usuario:password@host") ||
  url.includes("USUARIO:CONTRASEÑA@ep-xxxx") ||
  url.includes("postgres:postgres@localhost:5432/real_sporting");

if (url && !isPlaceholder) {
  process.exit(0);
}

const lines = [
  "Falta la URL de Neon en .env.",
  "",
  !existsSync(envPath) ? "Crea .env:  cp .env.example .env" : "Edita .env con las URLs de Neon.",
  "",
  "En console.neon.tech → Connect copia DOS strings:",
  "",
  "  DATABASE_URL=...-pooler....neon.tech/...?sslmode=require   (app / Vercel)",
  "  DIRECT_URL=....neon.tech/...?sslmode=require                 (npm run db:push)",
  "",
  "O descarga desde Vercel:  vercel env pull .env",
];

console.error(lines.join("\n"));
process.exit(1);
