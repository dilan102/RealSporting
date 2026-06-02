import { NextRequest, NextResponse } from "next/server";
import { readUploadMedia } from "@/lib/upload-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await readUploadMedia(id);

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.body, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": file.mimeType,
    },
  });
}
