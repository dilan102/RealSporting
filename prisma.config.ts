// Prisma 7: la URL de conexión va aquí, NO en schema.prisma
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL_UNPOOLED?.trim();

const fallbackUrl = process.env.DATABASE_URL?.trim();

const migrationUrl = databaseUrl || fallbackUrl;

if (!migrationUrl) {
  const envPath = resolve(process.cwd(), ".env");
  const hint = existsSync(envPath)
    ? "Tu archivo .env existe pero faltan variables de Neon."
    : "Copia .env.example a .env y define las URLs de Neon.";

  throw new Error(
    [
      "Falta la URL de base de datos para Prisma CLI.",
      hint,
      "",
      "Neon (console.neon.tech → Connect) necesitas:",
      "  DIRECT_URL=...        (sin -pooler, para npm run db:push)",
      "  DATABASE_URL=...      (con -pooler, para la app en Vercel)",
      "",
      "Luego: npm run db:push",
    ].join("\n"),
  );
}

if (!databaseUrl && fallbackUrl?.includes("-pooler")) {
  console.warn(
    "[prisma] Usando DATABASE_URL con pooler para db:push. En Neon es mejor definir DIRECT_URL (connection string sin -pooler).",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
