import { prisma } from "@/lib/prisma";
import {
  dateFromInput,
  dateToInputValue,
  defaultEndDateFromStart,
  validatePublicationDateRange,
} from "@/lib/publication-dates";
import { removeUpload, saveUpload } from "@/lib/upload-store";
import { sanitizeText, sanitizeTextOrDefault, validateCleanTextField } from "@/lib/validators";

export type TournamentStatus = "won" | "played" | "future" | "scheduled" | "upcoming";

export type Tournament = {
  id: string;
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  image: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  visibility: "published" | "draft";
};

export type TournamentInput = {
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  visibility?: "published" | "draft";
  image?: File | null;
};

const fallbackImage = "/brand/hero-training.jpg";
const notFoundMessage = "No se encontró el torneo.";
const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);
const maxImageBytes = 5 * 1024 * 1024;

function normalizeStatus(status: string): TournamentStatus {
  if (status === "won" || status === "played" || status === "future" || status === "scheduled" || status === "upcoming") {
    return status;
  }

  return "future";
}

function normalizeInput(input: TournamentInput) {
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
    status: normalizeStatus(input.status),
    visibility: input.visibility ?? "draft",
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
  return saveUpload("tournaments", file, allowedTypes, maxImageBytes);
}

function toTournament(item: {
  id: number;
  nombre: string;
  descripcion: string;
  programacion: string;
  sede: string;
  categoria: string;
  rival: string;
  imagen: string | null;
  fechaInicio: Date;
  fechaFin: Date | null;
  estado: string;
  publicado: boolean;
}): Tournament {
  const startDate = dateToInputValue(item.fechaInicio);

  return {
    id: String(item.id),
    name: sanitizeTextOrDefault(item.nombre, "Torneo"),
    description: sanitizeTextOrDefault(item.descripcion, "Programación deportiva del club."),
    schedule: sanitizeText(item.programacion),
    venue: sanitizeTextOrDefault(item.sede, "Sede por confirmar"),
    category: sanitizeTextOrDefault(item.categoria, "Categoría general"),
    opponent: sanitizeText(item.rival),
    image: normalizeImagePath(item.imagen),
    startDate,
    endDate: item.fechaFin ? dateToInputValue(item.fechaFin) : defaultEndDateFromStart(startDate),
    status: normalizeStatus(item.estado),
    visibility: item.publicado ? "published" : "draft",
  };
}

function idFromParam(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("El torneo no tiene un identificador válido.");
  }

  return parsed;
}

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

export async function readTournaments(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;

  try {
    const items = await prisma.torneo.findMany({
      where: includeDrafts ? undefined : { publicado: true },
      orderBy: [{ fechaInicio: "desc" }, { id: "desc" }],
    });

    return items.map(toTournament);
  } catch (error) {
    console.error("No se pudieron leer los torneos desde la base de datos.", error);
    return [];
  }
}

export async function createTournament(input: TournamentInput) {
  const clean = normalizeInput(input);
  const image = input.image ? await saveImage(input.image) : fallbackImage;

  try {
    const item = await prisma.torneo.create({
      data: {
        nombre: clean.name,
        descripcion: clean.description,
        programacion: clean.schedule,
        sede: clean.venue,
        categoria: clean.category,
        rival: clean.opponent,
        imagen: image,
        fechaInicio: dateFromInput(clean.startDate),
        fechaFin: dateFromInput(clean.endDate),
        estado: clean.status,
        publicado: clean.visibility === "published",
      },
    });

    return toTournament(item);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "tournaments");
    }

    throw databaseError("crear el torneo", error);
  }
}

export async function updateTournament(id: string, input: TournamentInput) {
  const clean = normalizeInput(input);
  const numericId = idFromParam(id);
  const existing = await prisma.torneo.findUnique({ where: { id: numericId } }).catch((error) => {
    throw databaseError("consultar el torneo", error);
  });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  const image = input.image ? await saveImage(input.image) : existing.imagen || fallbackImage;

  try {
    const updated = await prisma.torneo.update({
      where: { id: numericId },
      data: {
        nombre: clean.name,
        descripcion: clean.description,
        programacion: clean.schedule,
        sede: clean.venue,
        categoria: clean.category,
        rival: clean.opponent,
        imagen: image,
        fechaInicio: dateFromInput(clean.startDate),
        fechaFin: dateFromInput(clean.endDate),
        estado: clean.status,
        publicado: clean.visibility === "published",
      },
    });

    if (input.image && existing.imagen && existing.imagen !== image) {
      await removeUpload(existing.imagen, "tournaments");
    }

    return toTournament(updated);
  } catch (error) {
    if (input.image) {
      await removeUpload(image, "tournaments");
    }

    throw databaseError("actualizar el torneo", error);
  }
}

export async function deleteTournament(id: string) {
  const numericId = idFromParam(id);
  const existing = await prisma.torneo.findUnique({ where: { id: numericId } }).catch((error) => {
    throw databaseError("consultar el torneo", error);
  });

  if (!existing) {
    throw new Error(notFoundMessage);
  }

  await prisma.torneo.delete({ where: { id: numericId } }).catch((error) => {
    throw databaseError("borrar el torneo", error);
  });

  if (existing.imagen) {
    await removeUpload(existing.imagen, "tournaments");
  }
}
