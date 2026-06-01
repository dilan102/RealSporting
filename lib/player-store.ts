import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import type { Player, PlayerCategory } from "@/lib/content";
import { getPlayerCategory, players as defaultPlayers } from "@/lib/content";
import { getUploadDir, getUploadPublicPrefix } from "@/lib/file-storage";
import {
  isLikelyJunkText,
  isReadableText,
  validateReadableText,
} from "@/lib/validators";
import { isPublishedEntry, type PublishStatus } from "@/lib/publish-status";
import { prisma } from "@/lib/prisma";

const uploadsDir = getUploadDir("players");
const publicUploadPrefix = getUploadPublicPrefix("players");

export type PlayerInput = {
  name: string;
  number: string;
  position: string;
  bio: string;
  category: string;
  convocado: string;
  image?: File | null;
  visible_publico?: boolean;
  status?: PublishStatus;
};

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
]);

type StoredPlayer = {
  id: number;
  nombre: string;
  numero: number;
  posicion: string;
  bio: string;
  imagen: string;
  categoria: string;
  convocado: boolean;
  visiblePublico: boolean;
  publicado: boolean;
};

async function ensureUploadStorage() {
  await mkdir(uploadsDir, { recursive: true });
}

function normalizeCategory(value: string): PlayerCategory {
  const clean = value.trim();
  const numberValue = Number(clean);
  const category = Number.isNaN(numberValue) ? clean : numberValue;

  if (!getPlayerCategory(category as PlayerCategory)) {
    throw new Error("La categoría debe ser un año entre 2007 y 2020.");
  }

  return category as PlayerCategory;
}

function normalizeInput(input: PlayerInput) {
  const name = validateReadableText(input.name, "nombre", 3);
  const position = validateReadableText(input.position, "posición", 2);
  const bio = validateReadableText(input.bio, "descripción", 10);
  const number = Number(input.number);
  const category = normalizeCategory(input.category);
  const convocado: Player["convocado"] = input.convocado === "SI" ? "SI" : "NO";
  const visible_publico = input.visible_publico ?? false;
  const status: PublishStatus =
    input.status ?? (visible_publico ? "published" : "draft");

  if (!Number.isInteger(number) || number < 1 || number > 99) {
    throw new Error("El número de camiseta debe estar entre 1 y 99.");
  }

  if (!isReadableText(input.bio, 10)) {
    throw new Error("La descripción debe tener al menos 10 caracteres legibles.");
  }

  return { name, number, position, bio, category, convocado, visible_publico, status };
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
    // The record can still be updated if the previous upload is already gone.
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

function toPlayer(item: StoredPlayer): Player {
  return {
    id: String(item.id),
    name: item.nombre,
    number: item.numero,
    position: item.posicion,
    bio: item.bio,
    image: item.imagen,
    category: item.categoria as PlayerCategory,
    convocado: item.convocado ? "SI" : "NO",
    visible_publico: item.visiblePublico,
    status: item.publicado ? "published" : "draft",
  };
}

function idFromParam(id: string) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("El jugador no tiene un identificador válido.");
  }

  return parsed;
}

function isPublicPlayer(item: Player) {
  if (!isPublishedEntry(item) || item.visible_publico === false) {
    return false;
  }

  return !isLikelyJunkText(item.name) && !isLikelyJunkText(item.bio);
}

function databaseError(action: string, error: unknown) {
  console.error(`No se pudo ${action} en la base de datos.`, error);
  return new Error(`No se pudo ${action} en la base de datos.`);
}

function defaultPlayerRows() {
  return defaultPlayers.map((item) => {
    const visiblePublico = item.visible_publico ?? false;
    const status = item.status ?? (visiblePublico ? "published" : "draft");

    return {
      nombre: item.name,
      numero: item.number,
      posicion: item.position,
      bio: item.bio,
      imagen: item.image,
      categoria: String(item.category),
      convocado: item.convocado === "SI",
      visiblePublico,
      publicado: status === "published" && visiblePublico,
    };
  });
}

export async function readPlayers(options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;

  try {
    const items = await prisma.jugador.findMany({
      where: includeHidden
        ? undefined
        : {
            publicado: true,
            visiblePublico: true,
          },
      orderBy: [{ categoria: "asc" }, { numero: "asc" }, { id: "asc" }],
    });

    return items.map(toPlayer).filter((item) => includeHidden || isPublicPlayer(item));
  } catch (error) {
    console.error("No se pudieron leer los jugadores desde la base de datos.", error);
  }

  return defaultPlayers.filter((item) => includeHidden || isPublicPlayer(item));
}

export async function createPlayer(input: PlayerInput) {
  const clean = normalizeInput(input);

  if (!input.image) {
    throw new Error("Sube una foto para el jugador.");
  }

  const image = await saveImage(input.image);

  try {
    const player = await prisma.jugador.create({
      data: {
        nombre: clean.name,
        numero: clean.number,
        posicion: clean.position,
        bio: clean.bio,
        imagen: image,
        categoria: String(clean.category),
        convocado: clean.convocado === "SI",
        visiblePublico: clean.visible_publico,
        publicado: clean.status === "published" && clean.visible_publico,
      },
    });

    return toPlayer(player);
  } catch (error) {
    await removeUploadedFile(image);
    throw databaseError("crear el jugador", error);
  }
}

export async function updatePlayer(id: string, input: PlayerInput) {
  const clean = normalizeInput(input);
  const numericId = idFromParam(id);
  const existing = await prisma.jugador
    .findUnique({ where: { id: numericId } })
    .catch((error) => {
      throw databaseError("consultar el jugador", error);
    });

  if (!existing) {
    throw new Error("No se encontró el jugador.");
  }

  const image = input.image ? await saveImage(input.image) : existing.imagen;

  try {
    const updated = await prisma.jugador.update({
      where: { id: numericId },
      data: {
        nombre: clean.name,
        numero: clean.number,
        posicion: clean.position,
        bio: clean.bio,
        imagen: image,
        categoria: String(clean.category),
        convocado: clean.convocado === "SI",
        visiblePublico: clean.visible_publico,
        publicado: clean.status === "published" && clean.visible_publico,
      },
    });

    if (input.image && existing.imagen !== image) {
      await removeUploadedFile(existing.imagen);
    }

    return toPlayer(updated);
  } catch (error) {
    if (input.image) {
      await removeUploadedFile(image);
    }

    throw databaseError("actualizar el jugador", error);
  }
}

export async function deletePlayer(id: string) {
  const numericId = idFromParam(id);
  const existing = await prisma.jugador
    .findUnique({ where: { id: numericId } })
    .catch((error) => {
      throw databaseError("consultar el jugador", error);
    });

  if (!existing) {
    throw new Error("No se encontró el jugador.");
  }

  await prisma.jugador.delete({ where: { id: numericId } }).catch((error) => {
    throw databaseError("borrar el jugador", error);
  });
  await removeUploadedFile(existing.imagen);
}

export async function restoreDefaultPlayers() {
  const current = await prisma.jugador
    .findMany()
    .catch((error) => {
      throw databaseError("consultar los jugadores", error);
    });

  await prisma.$transaction([
    prisma.jugador.deleteMany(),
    prisma.jugador.createMany({ data: defaultPlayerRows() }),
  ]).catch((error) => {
    throw databaseError("restaurar los jugadores", error);
  });

  await Promise.all(current.map((item) => removeUploadedFile(item.imagen)));

  return readPlayers({ includeHidden: true });
}
