import { NextRequest, NextResponse } from "next/server";
import {
  createTraining,
  deleteTraining,
  readTrainings,
  restoreDefaultTrainings,
  updateTraining,
} from "@/lib/training-store";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

async function trainingInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const images = formData
    .getAll("images")
    .filter((image): image is File => image instanceof File && image.size > 0);
  const videos = formData
    .getAll("videos")
    .filter((video): video is File => video instanceof File && video.size > 0);
  const legacyImage = formData.get("image");

  if (legacyImage instanceof File && legacyImage.size > 0) {
    images.push(legacyImage);
  }

  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    description: String(formData.get("description") || ""),
    status:
      String(formData.get("status") || "") === "draft"
        ? ("draft" as const)
        : ("published" as const),
    images,
    videos,
  };
}

export async function GET(request: NextRequest) {
  const items = await readTrainings({
    includeHidden: await isAdminApiAuthorized(request),
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const input = await trainingInputFromFormData(request);
    const item = await createTraining(input);
    const items = await readTrainings({ includeHidden: true });

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
    return errorResponse(new Error("Falta el entrenamiento a editar."));
  }

  try {
    const input = await trainingInputFromFormData(request);
    const item = await updateTraining(id, input);
    const items = await readTrainings({ includeHidden: true });

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminApiAuthorized(request))) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  const restore = request.nextUrl.searchParams.get("restore");
  const id = request.nextUrl.searchParams.get("id");

  try {
    if (restore === "true") {
      const items = await restoreDefaultTrainings();

      return NextResponse.json({ items });
    }

    if (!id) {
      return errorResponse(new Error("Falta el entrenamiento a borrar."));
    }

    await deleteTraining(id);

    return NextResponse.json({ items: await readTrainings({ includeHidden: true }) });
  } catch (error) {
    return errorResponse(error);
  }
}
