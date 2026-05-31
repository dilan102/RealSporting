import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadDir } from "@/lib/file-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};
const uploadSections = new Set(["news", "players", "trainings"]);

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const [section, fileName, ...extra] = segments;

  if (!section || !uploadSections.has(section) || !fileName || extra.length > 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const safeName = path.basename(fileName);

  if (safeName !== fileName) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(getUploadDir(section), safeName);
    const body = await readFile(filePath);
    const contentType =
      contentTypes[path.extname(safeName).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
