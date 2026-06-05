import { NextRequest, NextResponse } from "next/server";
import { isAdminApiAuthorized } from "@/lib/admin-auth";
import { readContentOverrides, writeContentOverrides } from "@/lib/content-overrides";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: await readContentOverrides() });
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

  await writeContentOverrides(body.items);

  return NextResponse.json({ items: body.items });
}
