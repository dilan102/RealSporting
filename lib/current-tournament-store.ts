import { prisma } from "@/lib/prisma";
import {
  dateFromInput,
  dateToInputValue,
  defaultEndDateFromStart,
  validatePublicationDateRange,
} from "@/lib/publication-dates";
import { removeUpload, saveUpload } from "@/lib/upload-store";
import { sanitizeText, sanitizeTextOrDefault, validateCleanTextField } from "@/lib/validators";

export type CurrentTournament = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  image: string;
  images: string[];
  startDate: string;
  endDate: string;
  visibility: "published" | "draft";
};

export type CurrentTournamentInput = {
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  startDate: string;
  endDate: string;
  visibility?: "published" | "draft";
  image?: File | null;
  images?: string[];
};

const fallbackImage = "/brand/hero-training.jpg";
const notFoundMessage = "No se encontró el torneo actual.";
const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);
const maxImageBytes = 5 * 1024 * 1024;

function normalizeInput(input: CurrentTournamentInput) {
  const { startDate, endDate } = validatePublicationDateRange(
    input.startDate,
    input.endDate || defaultEndDateFromStart(input.startDate),
  );

  return {
    name: validateCleanTextField(input.name, "nombre del torneo"),
    description: validateCleanTextField(input.description, "descripción"),
    schedule: sanitizeText(input.schedule),
    venue: sanitizeText(input.venue),
    category: sanitizeText(input.category),
    opponent: sanitizeText(input.opponent),
    startDate,
    endDate,
    visibility: input.visibility ?? "draft",
    images: input.images ?? [],
  };
}

function normalizeImagePath(url: string | null) {
  const image = (url || "").trim();

  if (image.startsWith("/") || image.startsWith("https://images.unsplash.com/")) {
    return image;
  }

  return fallbackImage;
}

async function saveImage(file: File) {
  return saveUpload("current-tournaments", file, allowedTypes, maxImageBytes);
}

function toCurrentTournament(item: {
  id: number;
  nombre: string;
  descripcion: string;
  programacion: string;
  sede: string;
  categoria: string;
  rival: string;
  imagen: string | null;
  imagenes: string[];
  fechaInicio: Date;
  fechaFin: Date | null;
  publicado: boolean;
}): CurrentTournament {
  const startDate = dateToInputValue(item.fechaInicio);

  return {
    id: String(item.id),
    name: sanitizeTextOrDefault(item.nombre, "Torneo Actual"),
    description: sanitizeTextOrDefault(item.descripcion, "Torneo en disputa del club."),
    schedule: sanitizeText(item.programacion),
    venue: sanitizeTextOrDefault(item.sede, "Sede por confirmar"),
    category: sanitizeTextOrDefault(item.categoria, "Categoría general"),
    opponent: sanitizeText(item.rival),
    image: normalizeImagePath(item.imagen),
    images: item.imagenes || [],
    startDate,
    endDate: item.fechaFin ? dateToInputValue(item.fechaFin) : defaultEndDateFromStart(startDate),
    visibility: item.publicado ? "published" : "draft",
  };
}

function idFromParam(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("El torneo actual no tiene un identificador válido.");
  }

  return parsed;
}

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

export async function readCurrentTournament(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    const item = await prisma.torneoActual.findFirst({
      where: includeDrafts ? undefined : { publicado: true },
      orderBy: { fechaInicio: "desc" },
    });

    return item ? toCurrentTournament(item) : null;
  } catch (error) {
    console.error("No se pudo leer el torneo actual desde la base de datos.", error);
    return null;
  }
}

export async function readAllCurrentTournaments(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    const items = await prisma.torneoActual.findMany({
      where: includeDrafts ? undefined : { publicado: true },
      orderBy: [{ fechaInicio: "desc" }, { id: "desc" }],
    });

    return items.map(toCurrentTournament);
  } catch (error) {
    console.error("No se pudieron leer los torneos actuales desde la base de datos.", error);
    return [];
  }
}

export async function createCurrentTournament(input: CurrentTournamentInput) {
  const clean = normalizeInput(input);
  const image = input.image ? await saveImage(input.image) : fallbackImage;

  try {
    const item = await prisma.torneoActual.create({
      data: {
        nombre: clean.name,
        descripcion: clean.description,
        programacion: clean.schedule,
        sede: clean.venue,
        categoria: clean.category,
        rival: clean.opponent,
        imagen: image,
        imagenes: clean.images,
        fechaInicio: dateFromInput(clean.startDate),
        fechaFin: dateFromInput(clean.endDate),
        publicado: clean.visibility === "published",
      },
    });

    return toCurrentTournament(item);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "current-tournaments");
    }

    throw databaseError("crear el torneo actual", error);
  }
}

export async function updateCurrentTournament(id: string, input: CurrentTournamentInput) {
  const clean = normalizeInput(input);
  const numericId = idFromParam(id);
  const existing = await prisma.torneoActual
    .findUnique({ where: { id: numericId } })
    .catch((error) => {
      throw databaseError("consultar el torneo actual", error);
    });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  const image = input.image ? await saveImage(input.image) : existing.imagen || fallbackImage;

  if (input.image && existing.imagen && existing.imagen !== fallbackImage) {
    await removeUpload(existing.imagen, "current-tournaments").catch(() => {
      // Silently ignore removal errors
    });
  }

  try {
    const item = await prisma.torneoActual.update({
      where: { id: numericId },
      data: {
        nombre: clean.name,
        descripcion: clean.description,
        programacion: clean.schedule,
        sede: clean.venue,
        categoria: clean.category,
        rival: clean.opponent,
        imagen: image,
        imagenes: clean.images,
        fechaInicio: dateFromInput(clean.startDate),
        fechaFin: dateFromInput(clean.endDate),
        publicado: clean.visibility === "published",
      },
    });

    return toCurrentTournament(item);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "current-tournaments");
    }

    throw databaseError("actualizar el torneo actual", error);
  }
}

export async function deleteCurrentTournament(id: string) {
  const numericId = idFromParam(id);
  const existing = await prisma.torneoActual
    .findUnique({ where: { id: numericId } })
    .catch((error) => {
      throw databaseError("consultar el torneo actual", error);
    });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  if (existing.imagen && existing.imagen !== fallbackImage) {
    await removeUpload(existing.imagen, "current-tournaments").catch(() => {
      // Silently ignore removal errors
    });
  }

  try {
    await prisma.torneoActual.delete({ where: { id: numericId } });
  } catch (error) {
    throw databaseError("borrar el torneo actual", error);
  }
}
