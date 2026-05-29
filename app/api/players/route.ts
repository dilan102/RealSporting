import { NextRequest, NextResponse } from "next/server";
import {
  createPlayer,
  deletePlayer,
  readPlayers,
  updatePlayer,
} from "@/lib/player-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accessKey =
  process.env.TRAININGS_ACCESS_KEY ||
  process.env.ADMIN_PASSWORD ||
  "RealSporting1985";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

function isAuthorized(request: NextRequest) {
  return request.headers.get("x-training-key") === accessKey;
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
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export async function GET() {
  const items = await readPlayers({ includeHidden: true });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const input = await playerInputFromFormData(request);
    const item = await createPlayer(input);
    const items = await readPlayers();

    return NextResponse.json({ item, items }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return errorResponse(new Error("Falta el jugador a editar."));
  }

  try {
    const input = await playerInputFromFormData(request);
    const item = await updatePlayer(id, input);
    const items = await readPlayers();

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return errorResponse(new Error("Falta el jugador a borrar."));
  }

  try {
    await deletePlayer(id);

    return NextResponse.json({ items: await readPlayers() });
  } catch (error) {
    return errorResponse(error);
  }
}
