import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const accessKey =
  process.env.TRAININGS_ACCESS_KEY ||
  process.env.NEWS_ACCESS_KEY ||
  process.env.ADMIN_PASSWORD ||
  "RealSporting1985";

export async function getAdminSession() {
  return getServerSession(authOptions);
}

export async function isAdminApiAuthorized(request: NextRequest) {
  const headerKey =
    request.headers.get("x-training-key") ??
    request.headers.get("x-news-key") ??
    request.headers.get("x-admin-key");

  if (headerKey === accessKey) {
    return true;
  }

  const hasSessionCookie =
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  if (!hasSessionCookie) {
    return false;
  }

  try {
    const session = await getAdminSession();

    return Boolean(session?.user?.isAdmin);
  } catch {
    return false;
  }
}
