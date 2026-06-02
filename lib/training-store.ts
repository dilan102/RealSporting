import type { Training } from "@/lib/content";
import { trainings as defaultTrainings } from "@/lib/content";
import { cleanupExpiredTrainings } from "@/lib/content-expiry";
import {
  dateFromInput,
  dateToInputValue,
  defaultEndDateFromStart,
  getTodayDateKey,
  hasReachedEndDate,
  validatePublicationDateRange,
} from "@/lib/publication-dates";
import { removeUpload, saveUpload } from "@/lib/upload-store";
import {
  TRAINING_TEXT_PLACEHOLDER,
  isLikelyJunkText,
  sanitizeTextOrDefault,
  validateReadableText,
  validateTrainingDate,
  validateTrainingTitle,
} from "@/lib/validators";
import { isPublishedEntry, type PublishStatus } from "@/lib/publish-status";
import { prisma } from "@/lib/prisma";

const maxImageBytes = 5 * 1024 * 1024;
const maxVideoBytes = 80 * 1024 * 1024;

export type TrainingInput = {
  title: string;
  date: string;
  endDate: string;
  description: string;
  images?: File[];
  videos?: File[];
  hidden?: boolean;
  status?: PublishStatus;
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

type StoredTraining = {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagen: string | null;
  imagenes: string[] | null;
  videos: string[] | null;
  fecha: Date;
  fechaFin: Date | null;
  oculto: boolean;
  publicado: boolean;
};

function normalizeInput(input: TrainingInput) {
  const title = validateTrainingTitle(input.title);
  const startDate = validateTrainingDate(input.date);
  const { endDate } = validatePublicationDateRange(
    startDate,
    input.endDate || defaultEndDateFromStart(startDate),
  );
  const description = validateReadableText(input.description, "descripción", 10);
  const hidden = input.hidden ?? false;
  const status: PublishStatus = input.status ?? (hidden ? "draft" : "published");

  return { title, date: startDate, endDate, description, hidden, status };
}

function isValidTrainingDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const year = Number(date.slice(0, 4));
  const currentYear = new Date().getFullYear();

  return year >= 2020 && year <= currentYear + 1;
}

function isPublicTraining(item: Training) {
  if (!isPublishedEntry(item)) {
    return false;
  }

  const today = getTodayDateKey();

  if (today < item.date || hasReachedEndDate(item.endDate)) {
    return false;
  }

  if (!isValidTrainingDate(item.date)) {
    return false;
  }

  return !isLikelyJunkText(item.title) && !isLikelyJunkText(item.description);
}

async function saveImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG, WEBP o SVG.");
  }

  return saveUpload("trainings", file, allowedImageTypes, maxImageBytes);
}

async function saveVideo(file: File) {
  if (!allowedVideoTypes.has(file.type)) {
    throw new Error("Selecciona un video MP4, WEBM o MOV.");
  }

  return saveUpload("trainings", file, allowedVideoTypes, maxVideoBytes);
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

function toTraining(item: StoredTraining): Training {
  const storedImages = item.imagenes ?? [];
  const storedVideos = item.videos ?? [];
  const images = storedImages.length > 0 ? storedImages : item.imagen ? [item.imagen] : [];

  const startDate = dateToInputValue(item.fecha);
  const endDate = item.fechaFin
    ? dateToInputValue(item.fechaFin)
    : defaultEndDateFromStart(startDate);

  return {
    id: String(item.id),
    title: sanitizeTextOrDefault(item.titulo, "Entrenamiento Real Sporting"),
    date: startDate,
    endDate,
    description: sanitizeTextOrDefault(
      item.descripcion || TRAINING_TEXT_PLACEHOLDER,
      TRAINING_TEXT_PLACEHOLDER,
    ),
    image: images[0] || item.imagen || "",
    images,
    videos: storedVideos,
    hidden: item.oculto,
    status: item.publicado && !item.oculto ? "published" : "draft",
  };
}

function idFromParam(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("El entrenamiento no tiene un identificador válido.");
  }

  return parsed;
}

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

function defaultTrainingRows() {
  return defaultTrainings.map((item) => {
    const images = getTrainingImages(item);
    const hidden = item.hidden ?? item.status === "draft";
    const status = item.status ?? (hidden ? "draft" : "published");

    return {
      titulo: item.title,
      descripcion: item.description,
      fecha: dateFromInput(item.date),
      fechaFin: dateFromInput(item.endDate || defaultEndDateFromStart(item.date)),
      imagen: images[0] || null,
      imagenes: images,
      videos: getTrainingVideos(item),
      oculto: hidden,
      publicado: status === "published" && !hidden,
    };
  });
}

export async function readTrainings(options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;

  try {
    await cleanupExpiredTrainings().catch((error: unknown) => {
      console.error("No se pudieron limpiar los entrenamientos vencidos.", error);
    });

    const items = await prisma.entrenamiento.findMany({
      where: includeHidden
        ? undefined
        : {
            publicado: true,
            oculto: false,
          },
      orderBy: [{ fecha: "desc" }, { id: "desc" }],
    });

    return items.map(toTraining).filter((item) => includeHidden || isPublicTraining(item));
  } catch (error) {
    console.error(
      "No se pudieron leer los entrenamientos desde la base de datos.",
      error,
    );
  }

  return defaultTrainings
    .filter((item) => includeHidden || isPublicTraining(item))
    .map((item) => ({
      ...item,
      title: sanitizeTextOrDefault(item.title, "Entrenamiento Real Sporting"),
      description: sanitizeTextOrDefault(item.description, TRAINING_TEXT_PLACEHOLDER),
      endDate: item.endDate || defaultEndDateFromStart(item.date),
    }));
}

export async function createTraining(input: TrainingInput) {
  const clean = normalizeInput(input);
  const imageFiles = input.images || [];
  const videoFiles = input.videos || [];
  const images = await Promise.all(imageFiles.map((file) => saveImage(file)));
  const videos = await Promise.all(videoFiles.map((file) => saveVideo(file)));
  const hidden = clean.hidden || clean.status === "draft";

  try {
    const training = await prisma.entrenamiento.create({
      data: {
        titulo: clean.title,
        descripcion: clean.description,
        fecha: dateFromInput(clean.date),
        fechaFin: dateFromInput(clean.endDate),
        imagen: images[0] || null,
        imagenes: images,
        videos,
        oculto: hidden,
        publicado: clean.status === "published" && !hidden,
      },
    });

    return toTraining(training);
  } catch (error) {
    await Promise.all(
      [...images, ...videos].map((item) => removeUpload(item, "trainings")),
    );
    throw databaseError("crear el entrenamiento", error);
  }
}

export async function updateTraining(id: string, input: TrainingInput) {
  const clean = normalizeInput(input);
  const numericId = idFromParam(id);
  const existing = await prisma.entrenamiento
    .findUnique({ where: { id: numericId } })
    .catch((error: unknown) => {
      throw databaseError("consultar el entrenamiento", error);
    });

  if (!existing) {
    throw new Error("No se encontró el entrenamiento.");
  }

  const existingTraining = toTraining(existing);
  const existingImages = getTrainingImages(existingTraining);
  const existingVideos = getTrainingVideos(existingTraining);
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
  const hidden = clean.hidden || clean.status === "draft";

  try {
    const updated = await prisma.entrenamiento.update({
      where: { id: numericId },
      data: {
        titulo: clean.title,
        descripcion: clean.description,
        fecha: dateFromInput(clean.date),
        fechaFin: dateFromInput(clean.endDate),
        imagen: images[0] || null,
        imagenes: images,
        videos,
        oculto: hidden,
        publicado: clean.status === "published" && !hidden,
      },
    });

    return toTraining(updated);
  } catch (error) {
    await Promise.all(
      [...newImages, ...newVideos].map((item) => removeUpload(item, "trainings")),
    );
    throw databaseError("actualizar el entrenamiento", error);
  }
}

export async function deleteTraining(id: string) {
  const numericId = idFromParam(id);
  const existing = await prisma.entrenamiento
    .findUnique({ where: { id: numericId } })
    .catch((error: unknown) => {
      throw databaseError("consultar el entrenamiento", error);
    });

  if (!existing) {
    throw new Error("No se encontró el entrenamiento.");
  }

  await prisma.entrenamiento.delete({ where: { id: numericId } }).catch((error: unknown) => {
    throw databaseError("borrar el entrenamiento", error);
  });

  const training = toTraining(existing);

  await Promise.all(
    [...getTrainingImages(training), ...getTrainingVideos(training)].map((item) =>
      removeUpload(item, "trainings"),
    ),
  );
}

export async function restoreDefaultTrainings() {
  const current = await prisma.entrenamiento
    .findMany()
    .catch((error: unknown) => {
      throw databaseError("consultar los entrenamientos", error);
    });

  await prisma.$transaction([
    prisma.entrenamiento.deleteMany(),
    prisma.entrenamiento.createMany({ data: defaultTrainingRows() }),
  ]).catch((error: unknown) => {
    throw databaseError("restaurar los entrenamientos", error);
  });

  await Promise.all(
    current.flatMap((item) => {
      const training = toTraining(item);

      return [...getTrainingImages(training), ...getTrainingVideos(training)].map((media) =>
        removeUpload(media, "trainings"),
      );
    }),
  );

  return readTrainings({ includeHidden: true });
}
