import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "content-overrides.json");

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
}

export async function readContentOverrides() {
  await ensureStorage();

  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Empty storage starts with no content overrides.
  }

  return {};
}

export async function writeContentOverrides(items: Record<string, string>) {
  await ensureStorage();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
}

export function contentOverride(
  overrides: Record<string, string>,
  key: string,
  fallback: string,
) {
  const value = overrides[key];

  return typeof value === "string" && value.trim() ? value : fallback;
}
