import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import type { News, NewsStatus } from "@/lib/content";
import { news as defaultNews } from "@/lib/content";
import {
  getDataDir,
  getUploadDir,
  getUploadPublicPrefix,
} from "@/lib/file-storage";
import {
  NEWS_TEXT_PLACEHOLDER,
  NEWS_TITLE_PLACEHOLDER,
  sanitizeText,
  sanitizeTextOrDefault,
  validateCleanTextField,
} from "@/lib/validators";
import { prisma } from "@/lib/prisma";

const dataDir = getDataDir();
const uploadsDir = getUploadDir("news");
const publicUploadPrefix = getUploadPublicPrefix("news");
const fallbackImage = "/logo.png";
const notFoundMessage = "No se encontró la noticia.";
const newsRetentionMs = 30 * 24 * 60 * 60 * 1000;

export type NewsInput = {
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string;
  image?: File | null;
  status?: NewsStatus;
};

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

async function ensureUploadStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
}

function normalizeInput(input: NewsInput) {
  const title = validateCleanTextField(input.title, "título");
  const date = input.date.trim();
  const category = sanitizeText(input.category);
  const summary = validateCleanTextField(input.summary, "resumen corto");
  const body = validateCleanTextField(input.body, "texto de la noticia");

  if (!date) {
    throw new Error("La fecha no puede estar vacía.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("La fecha no tiene un formato válido.");
  }

  return { title, date, category, summary, body, status: input.status ?? "draft" };
}

function dateFromInput(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

function dateToInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getNewsExpirationCutoff(now = new Date()) {
  return new Date(now.getTime() - newsRetentionMs);
}

function isNewsWithinRetention(date: string) {
  return dateFromInput(date).getTime() >= getNewsExpirationCutoff().getTime();
}

function uploadedPathFromPublicUrl(url: string) {
  if (!url.startsWith(publicUploadPrefix)) {
    return null;
  }

  return path.join(uploadsDir, path.basename(url));
}

function normalizeImagePath(url: string) {
  const image = url.trim();

  if (
    image.startsWith("/") ||
    image.startsWith("https://images.unsplash.com/")
  ) {
    return image;
  }

  return fallbackImage;
}

async function removeUploadedFile(url: string) {
  const filePath = uploadedPathFromPublicUrl(url);

  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch {
    // The record can still be updated if the old file was already removed.
  }
}

async function saveImage(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG, WEBP o SVG.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("La imagen no puede superar 5 MB.");
  }

  await ensureUploadStorage();

  const extension = allowedTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

function toNews(item: {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string | null;
  fecha: Date;
  categoria: string;
  publicada: boolean;
}): News {
  return {
    id: String(item.id),
    title: sanitizeTextOrDefault(item.titulo, NEWS_TITLE_PLACEHOLDER),
    date: dateToInputValue(item.fecha),
    category: sanitizeTextOrDefault(item.categoria, "Club"),
    summary: sanitizeTextOrDefault(item.resumen, NEWS_TEXT_PLACEHOLDER),
    body: sanitizeTextOrDefault(item.contenido, NEWS_TEXT_PLACEHOLDER),
    image: normalizeImagePath(item.imagen || fallbackImage),
    status: item.publicada ? "published" : "draft",
  };
}

function idFromParam(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("La noticia no tiene un identificador válido.");
  }

  return parsed;
}

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

export async function cleanupExpiredNews(now = new Date()) {
  const cutoff = getNewsExpirationCutoff(now);
  const expired = await prisma.noticia
    .findMany({
      where: { fecha: { lt: cutoff } },
      select: { id: true, imagen: true },
    })
    .catch((error: unknown) => {
      throw databaseError("consultar noticias vencidas", error);
    });

  if (expired.length === 0) {
    return { deleted: 0, cutoff };
  }

  await prisma.noticia
    .deleteMany({ where: { id: { in: expired.map((item) => item.id) } } })
    .catch((error: unknown) => {
      throw databaseError("borrar noticias vencidas", error);
    });

  await Promise.all(
    expired.map((item) => (item.imagen ? removeUploadedFile(item.imagen) : undefined)),
  );

  return { deleted: expired.length, cutoff };
}

export async function readNews(options?: { includeDrafts?: boolean }): Promise<News[]> {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    await cleanupExpiredNews().catch((error: unknown) => {
      console.error("No se pudieron limpiar las noticias vencidas.", error);
    });

    const items = await prisma.noticia.findMany({
      where: includeDrafts ? undefined : { publicada: true },
      orderBy: [{ fecha: "desc" }, { id: "desc" }],
    });

    return items.map(toNews);
  } catch (error) {
    console.error("No se pudieron leer las noticias desde la base de datos.", error);
  }

  return defaultNews
    .filter(
      (item) =>
        isNewsWithinRetention(item.date) &&
        (includeDrafts || (item.status ?? "published") !== "draft"),
    )
    .map((item) => ({
      ...item,
      title: sanitizeTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
      summary: sanitizeTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
      body: sanitizeTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER),
      image: normalizeImagePath(item.image),
    }));
}

export async function createNews(input: NewsInput) {
  const clean = normalizeInput(input);

  if (clean.status === "published" && !input.image) {
    throw new Error("Sube una imagen antes de publicar la noticia.");
  }

  const image = input.image ? await saveImage(input.image) : fallbackImage;

  try {
    const item = await prisma.noticia.create({
      data: {
        titulo: clean.title,
        resumen: clean.summary,
        contenido: clean.body,
        fecha: dateFromInput(clean.date),
        categoria: clean.category,
        imagen: image,
        publicada: clean.status === "published",
      },
    });

    return toNews(item);
  } catch (error) {
    if (input.image) {
      await removeUploadedFile(image);
    }

    throw databaseError("crear la noticia", error);
  }
}

export async function updateNews(id: string, input: NewsInput) {
  const clean = normalizeInput(input);
  const numericId = idFromParam(id);
  const existing = await prisma.noticia
    .findUnique({ where: { id: numericId } })
    .catch((error: unknown) => {
      throw databaseError("consultar la noticia", error);
    });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  if (clean.status === "published" && !input.image && !existing.imagen) {
    throw new Error("Sube una imagen antes de publicar la noticia.");
  }

  const image = input.image
    ? await saveImage(input.image)
    : existing.imagen || fallbackImage;

  try {
    const updated = await prisma.noticia.update({
      where: { id: numericId },
      data: {
        titulo: clean.title,
        resumen: clean.summary,
        contenido: clean.body,
        fecha: dateFromInput(clean.date),
        categoria: clean.category,
        imagen: image,
        publicada: clean.status === "published",
      },
    });

    if (input.image && existing.imagen && existing.imagen !== image) {
      await removeUploadedFile(existing.imagen);
    }

    return toNews(updated);
  } catch (error) {
    if (input.image) {
      await removeUploadedFile(image);
    }

    throw databaseError("actualizar la noticia", error);
  }
}

export async function deleteNews(id: string) {
  const numericId = idFromParam(id);
  const existing = await prisma.noticia
    .findUnique({ where: { id: numericId } })
    .catch((error: unknown) => {
      throw databaseError("consultar la noticia", error);
    });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  await prisma.noticia.delete({ where: { id: numericId } }).catch((error: unknown) => {
    throw databaseError("borrar la noticia", error);
  });

  if (existing.imagen) {
    await removeUploadedFile(existing.imagen);
  }
}

export async function restoreDefaultNews() {
  let current: News[];

  try {
    current = (await prisma.noticia.findMany()).map(toNews);

    await prisma.$transaction([
      prisma.noticia.deleteMany(),
      prisma.noticia.createMany({
        data: defaultNews.map((item) => ({
          titulo: sanitizeTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
          resumen: sanitizeTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
          contenido: sanitizeTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER),
          fecha: dateFromInput(item.date),
          categoria: sanitizeTextOrDefault(item.category, "Club"),
          imagen: normalizeImagePath(item.image),
          publicada: (item.status ?? "published") === "published",
        })),
      }),
    ]);
  } catch (error) {
    throw databaseError("restaurar las noticias", error);
  }

  await Promise.all(current.map((item) => removeUploadedFile(item.image)));

  return readNews({ includeDrafts: true });
}
