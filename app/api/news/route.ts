import { NextRequest, NextResponse } from "next/server";
import {
  createNews,
  deleteNews,
  readNews,
  restoreDefaultNews,
  updateNews,
} from "@/lib/news-store";
import { isAdminApiAuthorized } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "No se pudo procesar la solicitud.";

  return NextResponse.json({ error: message }, { status });
}

async function newsInputFromFormData(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image");
  const status = String(formData.get("status") || "draft");

  return {
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || ""),
    endDate: String(formData.get("endDate") || ""),
    category: String(formData.get("category") || ""),
    summary: String(formData.get("summary") || ""),
    body: String(formData.get("body") || ""),
    image: image instanceof File && image.size > 0 ? image : null,
    status: status === "published" ? ("published" as const) : ("draft" as const),
  };
}

export async function GET(request: NextRequest) {
  try {
    const items = await readNews({
      includeDrafts: await isAdminApiAuthorized(request),
    });

    return NextResponse.json({ items });
  } catch (error) {
    return errorResponse(error, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await isAdminApiAuthorized(request);

    if (!isAuthorized) {
      return errorResponse(new Error("Clave incorrecta."), 401);
    }

    const input = await newsInputFromFormData(request);
    const item = await createNews(input);
    const items = await readNews({ includeDrafts: true });

    return NextResponse.json({ item, items }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = await isAdminApiAuthorized(request);

    if (!isAuthorized) {
      return errorResponse(new Error("Clave incorrecta."), 401);
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return errorResponse(new Error("Falta la noticia a editar."));
    }

    const input = await newsInputFromFormData(request);
    const item = await updateNews(id, input);
    const items = await readNews({ includeDrafts: true });

    return NextResponse.json({ item, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await isAdminApiAuthorized(request);

    if (!isAuthorized) {
      return errorResponse(new Error("Clave incorrecta."), 401);
    }

    const restore = request.nextUrl.searchParams.get("restore");
    const id = request.nextUrl.searchParams.get("id");

    if (restore === "true") {
      const items = await restoreDefaultNews();

      return NextResponse.json({ items });
    }

    if (!id) {
      return errorResponse(new Error("Falta la noticia a borrar."));
    }

    await deleteNews(id);

    return NextResponse.json({ items: await readNews({ includeDrafts: true }) });
  } catch (error) {
    return errorResponse(error);
  }
}
