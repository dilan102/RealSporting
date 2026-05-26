import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type { News } from "@/lib/content";
import { news as defaultNews } from "@/lib/content";
import { sanitizeText, validateTextField } from "@/lib/validators";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "news");
const dataFile = path.join(dataDir, "news.json");
const publicUploadPrefix = "/uploads/news/";

export type NewsInput = {
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string;
  image?: File | null;
};

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
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
    typeof item.image === "string"
  );
}

function normalizeInput(input: NewsInput) {
  const title = validateTextField(input.title, "título");
  const date = input.date.trim();
  const category = sanitizeText(input.category);
  const summary = validateTextField(input.summary, "resumen corto");
  const body = validateTextField(input.body, "texto de la noticia");

  if (!date) {
    throw new Error("La fecha no puede estar vacía.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("La fecha no tiene un formato válido.");
  }

  return { title, date, category, summary, body };
}

function uploadedPathFromPublicUrl(url: string) {
  if (!url.startsWith(publicUploadPrefix)) {
    return null;
  }

  return path.join(uploadsDir, path.basename(url));
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

  await ensureStorage();

  const extension = allowedTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

export async function readNews() {
  await ensureStorage();

  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.every(isNews)) {
      return parsed;
    }
  } catch {
    // Missing or invalid storage falls back to starter content.
  }

  return defaultNews;
}

async function writeNews(items: News[]) {
  await ensureStorage();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function createNews(input: NewsInput) {
  const clean = normalizeInput(input);

  if (!input.image) {
    throw new Error("Sube una imagen para la noticia.");
  }

  const image = await saveImage(input.image);
  const current = await readNews();
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
  const current = await readNews();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró la noticia.");
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
  const current = await readNews();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró la noticia.");
  }

  await writeNews(current.filter((item) => item.id !== id));
  await removeUploadedFile(existing.image);
}

export async function restoreDefaultNews() {
  const current = await readNews();

  await Promise.all(current.map((item) => removeUploadedFile(item.image)));
  await writeNews(defaultNews);

  return defaultNews;
}
