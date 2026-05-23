import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type { Training } from "@/lib/content";
import { trainings as defaultTrainings } from "@/lib/content";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "trainings");
const dataFile = path.join(dataDir, "trainings.json");
const publicUploadPrefix = "/uploads/trainings/";

export type TrainingInput = {
  title: string;
  date: string;
  description: string;
  images?: File[];
  videos?: File[];
};

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

const allowedVideoTypes = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"],
]);

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
}

function isTraining(value: unknown): value is Training {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.date === "string" &&
    typeof item.description === "string" &&
    typeof item.image === "string" &&
    (item.images === undefined ||
      (Array.isArray(item.images) &&
        item.images.every((image) => typeof image === "string"))) &&
    (item.videos === undefined ||
      (Array.isArray(item.videos) &&
        item.videos.every((video) => typeof video === "string")))
  );
}

function normalizeInput(input: TrainingInput) {
  const title = input.title.trim();
  const date = input.date.trim();
  const description = input.description.trim();

  if (!title || !date || !description) {
    throw new Error("Completa título, fecha y descripción.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("La fecha no tiene un formato válido.");
  }

  return { title, date, description };
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
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG, WEBP o SVG.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("La imagen no puede superar 5 MB.");
  }

  await ensureStorage();

  const extension = allowedImageTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

async function saveVideo(file: File) {
  if (!allowedVideoTypes.has(file.type)) {
    throw new Error("Selecciona un video MP4, WEBM o MOV.");
  }

  if (file.size > 80 * 1024 * 1024) {
    throw new Error("El video no puede superar 80 MB.");
  }

  await ensureStorage();

  const extension = allowedVideoTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

function getTrainingImages(training: Training) {
  return training.images && training.images.length > 0
    ? training.images
    : training.image
      ? [training.image]
      : [];
}

function getTrainingVideos(training: Training) {
  return training.videos && training.videos.length > 0 ? training.videos : [];
}

export async function readTrainings() {
  await ensureStorage();

  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.every(isTraining)) {
      return parsed;
    }
  } catch {
    // Missing or invalid storage falls back to the curated starter content.
  }

  return defaultTrainings;
}

async function writeTrainings(items: Training[]) {
  await ensureStorage();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function createTraining(input: TrainingInput) {
  const clean = normalizeInput(input);
  const imageFiles = input.images || [];
  const videoFiles = input.videos || [];

  if (imageFiles.length === 0 && videoFiles.length === 0) {
    throw new Error("Sube al menos una foto o un video para el entrenamiento.");
  }

  const images = await Promise.all(imageFiles.map((file) => saveImage(file)));
  const videos = await Promise.all(videoFiles.map((file) => saveVideo(file)));
  const current = await readTrainings();
  const training: Training = {
    id: `entrenamiento-${randomUUID()}`,
    ...clean,
    image: images[0] || "",
    images,
    videos,
  };

  await writeTrainings([training, ...current]);

  return training;
}

export async function updateTraining(id: string, input: TrainingInput) {
  const clean = normalizeInput(input);
  const current = await readTrainings();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró el entrenamiento.");
  }

  const existingImages = getTrainingImages(existing);
  const existingVideos = getTrainingVideos(existing);
  const newImages =
    input.images && input.images.length > 0
      ? await Promise.all(input.images.map((file) => saveImage(file)))
      : [];
  const newVideos =
    input.videos && input.videos.length > 0
      ? await Promise.all(input.videos.map((file) => saveVideo(file)))
      : [];
  const images = [...existingImages, ...newImages];
  const videos = [...existingVideos, ...newVideos];
  const updated: Training = { id, ...clean, image: images[0] || "", images, videos };
  const nextItems = current.map((item) => (item.id === id ? updated : item));

  await writeTrainings(nextItems);

  return updated;
}

export async function deleteTraining(id: string) {
  const current = await readTrainings();
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró el entrenamiento.");
  }

  await writeTrainings(current.filter((item) => item.id !== id));
  await Promise.all(
    [...getTrainingImages(existing), ...getTrainingVideos(existing)].map((item) =>
      removeUploadedFile(item),
    ),
  );
}

export async function restoreDefaultTrainings() {
  const current = await readTrainings();

  await Promise.all(
    current.flatMap((item) =>
      [...getTrainingImages(item), ...getTrainingVideos(item)].map((media) =>
        removeUploadedFile(media),
      ),
    ),
  );
  await writeTrainings(defaultTrainings);

  return defaultTrainings;
}
