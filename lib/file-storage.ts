import os from "os";
import path from "path";

const appStorageDir = "real-sporting";

export function getStorageRoot() {
  if (process.env.REALSPORTING_STORAGE_DIR) {
    return process.env.REALSPORTING_STORAGE_DIR;
  }

  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), appStorageDir);
  }

  return process.cwd();
}

export function isExternalStorageRoot() {
  return getStorageRoot() !== process.cwd();
}

/** En Vercel el disco es efímero; los uploads deben ir a PostgreSQL. */
export function shouldPersistUploadsInDatabase() {
  if (process.env.UPLOAD_STORAGE === "database") {
    return true;
  }

  if (process.env.UPLOAD_STORAGE === "disk") {
    return false;
  }

  if (process.env.REALSPORTING_STORAGE_DIR) {
    return false;
  }

  return Boolean(process.env.VERCEL);
}

export function getDataDir() {
  return path.join(getStorageRoot(), "data");
}

export function getUploadDir(section: string) {
  return path.join(getStorageRoot(), "public", "uploads", section);
}

export function getUploadPublicPrefix(section: string) {
  return isExternalStorageRoot()
    ? `/api/uploads/${section}/`
    : `/uploads/${section}/`;
}

