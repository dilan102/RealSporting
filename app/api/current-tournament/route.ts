import { NextRequest, NextResponse } from "next/server";
import {
  createCurrentTournament,
  deleteCurrentTournament,
  readCurrentTournament,
  updateCurrentTournament,
  type CurrentTournamentInput,
} from "@/lib/current-tournament-store";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

async function currentTournamentInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");
  const imagesJson = String(formData.get("images") || "[]");
  let images: string[] = [];

  try {
    images = JSON.parse(imagesJson);
  } catch {
    images = [];
  }

  return {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    schedule: String(formData.get("schedule") || ""),
    venue: String(formData.get("venue") || ""),
    category: String(formData.get("category") || ""),
    opponent: String(formData.get("opponent") || ""),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || ""),
    visibility:
      String(formData.get("visibility") || "") === "published"
        ? ("published" as const)
        : ("draft" as const),
    image: image instanceof File && image.size > 0 ? image : null,
    images,
  } as CurrentTournamentInput;
}

export async function GET(request: NextRequest) {
  const item = await readCurrentTournament({
    includeDrafts: await isAdminApiAuthorized(request),
  });

  return NextResponse.json({ item });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const item = await createCurrentTournament(await currentTournamentInputFromFormData(request));

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return errorResponse(new Error("Falta el torneo actual a editar."));
  }

  try {
    const item = await updateCurrentTournament(id, await currentTournamentInputFromFormData(request));

    return NextResponse.json({ item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request, { requireOwner: true }))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return errorResponse(new Error("Falta el torneo actual a borrar."));
  }

  try {
    await deleteCurrentTournament(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
