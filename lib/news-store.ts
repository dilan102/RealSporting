import type { News, NewsStatus } from "@/lib/content";
import { news as defaultNews } from "@/lib/content";
import { cleanupExpiredNews } from "@/lib/content-expiry";
import { prisma } from "@/lib/prisma";
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
  NEWS_TEXT_PLACEHOLDER,
  NEWS_TITLE_PLACEHOLDER,
  sanitizeText,
  sanitizeTextOrDefault,
  validateCleanTextField,
} from "@/lib/validators";
import { NEWS_FALLBACK_IMAGE } from "@/lib/site";

const fallbackImage = NEWS_FALLBACK_IMAGE;
const notFoundMessage = "No se encontró la noticia.";

export type NewsInput = {
  title: string;
  date: string;
  endDate: string;
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

const maxImageBytes = 5 * 1024 * 1024;

function normalizeInput(input: NewsInput) {
  const title = validateCleanTextField(input.title, "título");
  const category = sanitizeText(input.category);
  const summary = validateCleanTextField(input.summary, "resumen corto");
  const body = validateCleanTextField(input.body, "texto de la noticia");
  const { startDate, endDate } = validatePublicationDateRange(
    input.date,
    input.endDate || defaultEndDateFromStart(input.date),
  );

  return {
    title,
    date: startDate,
    endDate,
    category,
    summary,
    body,
    status: input.status ?? "draft",
  };
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

async function saveImage(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Selecciona una imagen JPG, PNG, WEBP o SVG.");
  }

  return saveUpload("news", file, allowedTypes, maxImageBytes);
}

function toNews(item: {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string | null;
  fecha: Date;
  fechaFin: Date | null;
  categoria: string;
  publicada: boolean;
}): News {
  const startDate = dateToInputValue(item.fecha);
  const endDate = item.fechaFin
    ? dateToInputValue(item.fechaFin)
    : defaultEndDateFromStart(startDate);

  return {
    id: String(item.id),
    title: sanitizeTextOrDefault(item.titulo, NEWS_TITLE_PLACEHOLDER),
    date: startDate,
    endDate,
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

function isVisibleNews(item: News, includeDrafts: boolean) {
  if (!includeDrafts && item.status !== "published") {
    return false;
  }

  const today = getTodayDateKey();

  if (today < item.date || hasReachedEndDate(item.endDate)) {
    return false;
  }

  return true;
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

    return items.map(toNews).filter((item) => isVisibleNews(item, includeDrafts));
  } catch (error) {
    console.error("No se pudieron leer las noticias desde la base de datos.", error);
  }

  return defaultNews
    .filter(
      (item) =>
        isVisibleNews(
          {
            ...item,
            status: item.status ?? "published",
          },
          includeDrafts,
        ) && (includeDrafts || (item.status ?? "published") !== "draft"),
    )
    .map((item) => ({
      ...item,
      title: sanitizeTextOrDefault(item.title, NEWS_TITLE_PLACEHOLDER),
      summary: sanitizeTextOrDefault(item.summary, NEWS_TEXT_PLACEHOLDER),
      body: sanitizeTextOrDefault(item.body, NEWS_TEXT_PLACEHOLDER),
      image: normalizeImagePath(item.image),
      endDate: item.endDate || defaultEndDateFromStart(item.date),
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
        fechaFin: dateFromInput(clean.endDate),
        categoria: clean.category,
        imagen: image,
        publicada: clean.status === "published",
      },
    });

    return toNews(item);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "news");
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
        fechaFin: dateFromInput(clean.endDate),
        categoria: clean.category,
        imagen: image,
        publicada: clean.status === "published",
      },
    });

    if (input.image && existing.imagen && existing.imagen !== image) {
      await removeUpload(existing.imagen, "news");
    }

    return toNews(updated);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "news");
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
    await removeUpload(existing.imagen, "news");
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
          fechaFin: dateFromInput(item.endDate || defaultEndDateFromStart(item.date)),
          categoria: sanitizeTextOrDefault(item.category, "Club"),
          imagen: normalizeImagePath(item.image),
          publicada: (item.status ?? "published") === "published",
        })),
      }),
    ]);
  } catch (error) {
    throw databaseError("restaurar las noticias", error);
  }

  await Promise.all(current.map((item) => removeUpload(item.image, "news")));

  return readNews({ includeDrafts: true });
}
