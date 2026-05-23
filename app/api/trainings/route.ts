import { NextRequest, NextResponse } from "next/server";
import {
  createTraining,
  deleteTraining,
  readTrainings,
  restoreDefaultTrainings,
  updateTraining,
} from "@/lib/training-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accessKey = process.env.TRAININGS_ACCESS_KEY || "RealSporting1985";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

function isAuthorized(request: NextRequest) {
  return request.headers.get("x-training-key") === accessKey;
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
    images,
    videos,
  };
}

export async function GET() {
  const items = await readTrainings();

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const input = await trainingInputFromFormData(request);
    const item = await createTraining(input);
    const items = await readTrainings();

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
    return errorResponse(new Error("Falta el entrenamiento a editar."));
  }

  try {
    const input = await trainingInputFromFormData(request);
    const item = await updateTraining(id, input);
    const items = await readTrainings();

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
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

    return NextResponse.json({ items: await readTrainings() });
  } catch (error) {
    return errorResponse(error);
  }
}
