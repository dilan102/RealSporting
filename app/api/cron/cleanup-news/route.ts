import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredNews } from "@/lib/news-store";

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
    const result = await cleanupExpiredNews();

    return NextResponse.json({
      ok: true,
      deleted: result.deleted,
      cutoff: result.cutoff.toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudieron limpiar las noticias vencidas.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
