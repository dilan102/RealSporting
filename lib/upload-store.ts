import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  getUploadDir,
  getUploadPublicPrefix,
  isExternalStorageRoot,
  shouldPersistUploadsInDatabase,
} from "@/lib/file-storage";
import { prisma } from "@/lib/prisma";

const mediaPublicPrefix = "/api/media/";

export function getMediaPublicUrl(id: string) {
  return `${mediaPublicPrefix}${id}`;
}

export function isMediaPublicUrl(url: string) {
  return url.startsWith(mediaPublicPrefix);
}

export function mediaIdFromPublicUrl(url: string) {
  if (!isMediaPublicUrl(url)) {
    return null;
  }

  const id = url.slice(mediaPublicPrefix.length).split(/[?#]/)[0];
  return id || null;
}

function uploadedPathFromPublicUrl(section: string, url: string) {
  const publicUploadPrefix = getUploadPublicPrefix(section);

  if (!url.startsWith(publicUploadPrefix)) {
    return null;
  }

  return path.join(getUploadDir(section), path.basename(url));
}

async function ensureDiskUploadStorage(section: string) {
  const uploadsDir = getUploadDir(section);
  await mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
}

async function saveUploadToDatabase(section: string, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  await prisma.archivoSubido.create({
    data: {
      id,
      seccion: section,
      mimeType: file.type,
      contenido: bytes,
    },
  });

  return getMediaPublicUrl(id);
}

async function saveUploadToDisk(section: string, file: File, allowedTypes: Map<string, string>) {
  const uploadsDir = await ensureDiskUploadStorage(section);
  const publicUploadPrefix = getUploadPublicPrefix(section);
  const extension = allowedTypes.get(file.type);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const diskPath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(diskPath, bytes);

  return `${publicUploadPrefix}${fileName}`;
}

export async function saveUpload(
  section: string,
  file: File,
  allowedTypes: Map<string, string>,
  maxBytes: number,
) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Tipo de archivo no permitido.");
  }

  if (file.size > maxBytes) {
    throw new Error(`El archivo no puede superar ${Math.round(maxBytes / (1024 * 1024))} MB.`);
  }

  if (shouldPersistUploadsInDatabase()) {
    return saveUploadToDatabase(section, file);
  }

  return saveUploadToDisk(section, file, allowedTypes);
}

export async function readUploadMedia(id: string) {
  const item = await prisma.archivoSubido.findUnique({ where: { id } });

  if (!item) {
    return null;
  }

  return {
    mimeType: item.mimeType,
    body: Buffer.from(item.contenido),
  };
}

export async function removeUpload(url: string, section: string) {
  const mediaId = mediaIdFromPublicUrl(url);

  if (mediaId) {
    await prisma.archivoSubido
      .delete({ where: { id: mediaId } })
      .catch(() => undefined);
    return;
  }

  const filePath = uploadedPathFromPublicUrl(section, url);

  if (!filePath) {
    return;
  }

  try {
    await unlink(filePath);
  } catch {
    // El registro puede actualizarse aunque el archivo ya no exista en disco.
  }
}

export async function removeUploads(urls: string[], section: string) {
  await Promise.all(urls.map((url) => removeUpload(url, section)));
}

/** Indica si la URL apunta a un archivo gestionado por la app (disco o base de datos). */
export function isManagedUploadUrl(url: string, section: string) {
  if (isMediaPublicUrl(url)) {
    return true;
  }

  return url.startsWith(getUploadPublicPrefix(section));
}

export function describeUploadStorage() {
  if (shouldPersistUploadsInDatabase()) {
    return "database";
  }

  if (isExternalStorageRoot()) {
    return "ephemeral-disk";
  }

  return "persistent-disk";
}
