import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type { Player, PlayerCategory } from "@/lib/content";
import { getPlayerCategory, players as defaultPlayers } from "@/lib/content";
import {
  isReadableText,
  validateReadableText,
} from "@/lib/validators";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "players");
const dataFile = path.join(dataDir, "players.json");
const publicUploadPrefix = "/uploads/players/";

export type PlayerInput = {
  name: string;
  number: string;
  position: string;
  bio: string;
  category: string;
  convocado: string;
  image?: File | null;
  visible_publico?: boolean;
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

function isPlayer(value: unknown): value is Player {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.number === "number" &&
    typeof item.position === "string" &&
    typeof item.bio === "string" &&
    typeof item.image === "string" &&
    (typeof item.category === "string" || typeof item.category === "number") &&
    (item.convocado === "SI" || item.convocado === "NO") &&
    (item.visible_publico === undefined || typeof item.visible_publico === "boolean")
  );
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

  if (!Number.isInteger(number) || number < 1 || number > 99) {
    throw new Error("El número de camiseta debe estar entre 1 y 99.");
  }

  if (!isReadableText(input.bio, 10)) {
    throw new Error("La descripción debe tener al menos 10 caracteres legibles.");
  }

  return { name, number, position, bio, category, convocado, visible_publico };
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

  await ensureStorage();

  const extension = allowedTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

export async function readPlayers(options?: { includeHidden?: boolean }) {
  await ensureStorage();
  const includeHidden = options?.includeHidden ?? false;

  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.every(isPlayer)) {
      return parsed.filter(
        (item) => includeHidden || item.visible_publico !== false,
      );
    }
  } catch {
    // Missing or invalid storage falls back to the starter roster.
  }

  return defaultPlayers.filter(
    (item) => includeHidden || item.visible_publico !== false,
  );
}

async function writePlayers(items: Player[]) {
  await ensureStorage();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export async function createPlayer(input: PlayerInput) {
  const clean = normalizeInput(input);

  if (!input.image) {
    throw new Error("Sube una foto para el jugador.");
  }

  const image = await saveImage(input.image);
  const current = await readPlayers({ includeHidden: true });
  const player: Player = {
    id: `jugador-${randomUUID()}`,
    ...clean,
    image,
  };

  await writePlayers([...current, player]);

  return player;
}

export async function updatePlayer(id: string, input: PlayerInput) {
  const clean = normalizeInput(input);
  const current = await readPlayers({ includeHidden: true });
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró el jugador.");
  }

  const image = input.image ? await saveImage(input.image) : existing.image;
  const updated: Player = { id, ...clean, image };
  const nextItems = current.map((item) => (item.id === id ? updated : item));

  await writePlayers(nextItems);

  if (input.image && existing.image !== image) {
    await removeUploadedFile(existing.image);
  }

  return updated;
}

export async function deletePlayer(id: string) {
  const current = await readPlayers({ includeHidden: true });
  const existing = current.find((item) => item.id === id);

  if (!existing) {
    throw new Error("No se encontró el jugador.");
  }

  await writePlayers(current.filter((item) => item.id !== id));
  await removeUploadedFile(existing.image);
}
