import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredContent } from "@/lib/content-expiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const result = await cleanupExpiredContent();

    return NextResponse.json({
      ok: true,
      deleted: result.deleted,
      news: result.news.deleted,
      trainings: result.trainings.deleted,
      cutoff: result.news.cutoff.toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo limpiar el contenido vencido.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
