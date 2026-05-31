import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
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

const dataDir = getDataDir();
const uploadsDir = getUploadDir("news");
const dataFile = path.join(dataDir, "news.json");
const publicUploadPrefix = getUploadPublicPrefix("news");
const fallbackImage = "/logo.png";

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

async function ensureDataStorage() {
  await mkdir(dataDir, { recursive: true });
}

async function ensureUploadStorage() {
  await ensureDataStorage();
  await mkdir(uploadsDir, { recursive: true });
}

function isNews(value: unknown): value is News {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.date === "string" &&
    typeof item.category === "string" &&
    typeof item.summary === "string" &&
    typeof item.body === "string" &&
    typeof item.image === "string" &&
    (item.status === undefined ||
      item.status === "published" ||
      item.status === "draft")
  );
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

export async function readNews(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.every(isNews)) {
      return parsed
        .filter((item) => includeDrafts || (item.status ?? "published") !== "draft")
        .map((item) => ({
          ...item,
          title: sanitizeTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
          summary: sanitizeTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
          body: sanitizeTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER),
          image: normalizeImagePath(item.image),
        }));
    }
  } catch {
    // Missing or invalid storage falls back to starter content.
  }

  return defaultNews
    .filter((item) => includeDrafts || (item.status ?? "published") !== "draft")
    .map((item) => ({
      ...item,
      title: sanitizeTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
      summary: sanitizeTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
      body: sanitizeTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER),
      image: normalizeImagePath(item.image),
    }));
}

async function writeNews(items: News[]) {
  await ensureDataStorage();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function createNews(input: NewsInput) {
  const clean = normalizeInput(input);

  if (clean.status === "published" && !input.image) {
    throw new Error("Sube una imagen antes de publicar la noticia.");
  }

  const image = input.image ? await saveImage(input.image) : "/logo.png";
  const current = await readNews({ includeDrafts: true });
  const item: News = {
    id: `noticia-${randomUUID()}`,
    ...clean,
    image,
  };

  await writeNews([item, ...current]);

  return item;
}

export async function updateNews(id: string, input: NewsInput) {
  const clean = normalizeInput(input);
  const current = await readNews({ includeDrafts: true });
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró la noticia.");
  }

  if (clean.status === "published" && !input.image && !existing.image) {
    throw new Error("Sube una imagen antes de publicar la noticia.");
  }

  const image = input.image ? await saveImage(input.image) : existing.image;
  const updated: News = { id, ...clean, image };
  const nextItems = current.map((item) => (item.id === id ? updated : item));

  await writeNews(nextItems);

  if (input.image && existing.image !== image) {
    await removeUploadedFile(existing.image);
  }

  return updated;
}

export async function deleteNews(id: string) {
  const current = await readNews({ includeDrafts: true });
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró la noticia.");
  }

  await writeNews(current.filter((item) => item.id !== id));
  await removeUploadedFile(existing.image);
}

export async function restoreDefaultNews() {
  const current = await readNews({ includeDrafts: true });

  await Promise.all(current.map((item) => removeUploadedFile(item.image)));
  await writeNews(defaultNews);

  return defaultNews;
}
