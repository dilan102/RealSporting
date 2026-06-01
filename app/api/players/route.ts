import { NextRequest, NextResponse } from "next/server";
import {
  createPlayer,
  deletePlayer,
  readPlayers,
  restoreDefaultPlayers,
  updatePlayer,
} from "@/lib/player-store";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

async function playerInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");

  return {
    name: String(formData.get("name") || ""),
    number: String(formData.get("number") || ""),
    position: String(formData.get("position") || ""),
    bio: String(formData.get("bio") || ""),
    category: String(formData.get("category") || ""),
    convocado: String(formData.get("convocado") || "NO"),
    visible_publico:
      String(formData.get("visible_publico") || formData.get("publicado") || "false") ===
      "true",
    status:
      String(formData.get("status") || "") === "published"
        ? ("published" as const)
        : ("draft" as const),
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export async function GET(request: NextRequest) {
  const items = await readPlayers({
    includeHidden: await isAdminApiAuthorized(request),
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const input = await playerInputFromFormData(request);
    const item = await createPlayer(input);
    const items = await readPlayers({ includeHidden: true });

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
    return errorResponse(new Error("Falta el jugador a editar."));
  }

  try {
    const input = await playerInputFromFormData(request);
    const item = await updatePlayer(id, input);
    const items = await readPlayers({ includeHidden: true });

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const restore = request.nextUrl.searchParams.get("restore");
    const id = request.nextUrl.searchParams.get("id");

    if (restore === "true") {
      const items = await restoreDefaultPlayers();

      return NextResponse.json({ items });
    }

    if (!id) {
      return errorResponse(new Error("Falta el jugador a borrar."));
    }

    await deletePlayer(id);

    return NextResponse.json({ items: await readPlayers({ includeHidden: true }) });
  } catch (error) {
    return errorResponse(error);
  }
}
