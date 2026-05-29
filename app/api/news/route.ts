import { NextRequest, NextResponse } from "next/server";
import {
  createNews,
  deleteNews,
  readNews,
  restoreDefaultNews,
  updateNews,
} from "@/lib/news-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accessKey =
  process.env.NEWS_ACCESS_KEY ||
  process.env.ADMIN_PASSWORD ||
  "RealSporting1985";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

function isAuthorized(request: NextRequest) {
  return request.headers.get("x-news-key") === accessKey;
}

async function newsInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");
  const status = String(formData.get("status") || "draft");

  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    category: String(formData.get("category") || ""),
    summary: String(formData.get("summary") || ""),
    body: String(formData.get("body") || ""),
    image: image instanceof File && image.size > 0 ? image : null,
    status: status === "published" ? ("published" as const) : ("draft" as const),
  };
}

export async function GET() {
  const items = await readNews({ includeDrafts: true });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return errorResponse(new Error("Clave incorrecta."), 401);
  }

  try {
    const input = await newsInputFromFormData(request);
    const item = await createNews(input);
    const items = await readNews();

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
    return errorResponse(new Error("Falta la noticia a editar."));
  }

  try {
    const input = await newsInputFromFormData(request);
    const item = await updateNews(id, input);
    const items = await readNews();

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
      const items = await restoreDefaultNews();

      return NextResponse.json({ items });
    }

    if (!id) {
      return errorResponse(new Error("Falta la noticia a borrar."));
    }

    await deleteNews(id);

    return NextResponse.json({ items: await readNews() });
  } catch (error) {
    return errorResponse(error);
  }
}
