import { NextRequest, NextResponse } from "next/server";
import {
  createTournament,
  deleteTournament,
  readTournaments,
  updateTournament,
  type TournamentStatus,
} from "@/lib/tournament-store";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

async function tournamentInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");
  const status = String(formData.get("status") || "current") as TournamentStatus;

  return {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    schedule: String(formData.get("schedule") || ""),
    venue: String(formData.get("venue") || ""),
    category: String(formData.get("category") || ""),
    opponent: String(formData.get("opponent") || ""),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || ""),
    status,
    visibility:
      String(formData.get("visibility") || "") === "published"
        ? ("published" as const)
        : ("draft" as const),
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export async function GET(request: NextRequest) {
  const items = await readTournaments({
    includeDrafts: await isAdminApiAuthorized(request),
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const item = await createTournament(await tournamentInputFromFormData(request));
    const items = await readTournaments({ includeDrafts: true });

    return NextResponse.json({ item, items }, { status: 201 });
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
    return errorResponse(new Error("Falta el torneo a editar."));
  }

  try {
    const item = await updateTournament(id, await tournamentInputFromFormData(request));
    const items = await readTournaments({ includeDrafts: true });

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return errorResponse(new Error("Falta el torneo a borrar."));
  }

  try {
    await deleteTournament(id);

    return NextResponse.json({ items: await readTournaments({ includeDrafts: true }) });
  } catch (error) {
    return errorResponse(error);
  }
}
