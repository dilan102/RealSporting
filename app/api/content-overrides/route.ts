import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "content-overrides.json");

async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
}

async function readOverrides() {
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

export async function GET() {
  return NextResponse.json({ items: await readOverrides() });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request, { requireOwner: true }))) {
    return NextResponse.json({ error: "Acceso no autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    items?: Record<string, string>;
  } | null;

  if (!body?.items || typeof body.items !== "object") {
    return NextResponse.json({ error: "No hay cambios para guardar." }, { status: 400 });
  }

  await ensureStorage();
  await writeFile(dataFile, JSON.stringify(body.items, null, 2), "utf8");

  return NextResponse.json({ items: body.items });
}
