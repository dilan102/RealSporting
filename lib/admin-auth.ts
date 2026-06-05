import type { NextRequest } from "next/server";
import { findAdminProfileByPassword } from "@/lib/admin-profiles";

export async function isAdminApiAuthorized(
  request: NextRequest,
  options: { requireOwner?: boolean } = {},
) {
  const headerKey =
    request.headers.get("x-training-key") ??
    request.headers.get("x-news-key") ??
    request.headers.get("x-admin-key");

  if (!headerKey) {
    return false;
  }

  const profile = findAdminProfileByPassword(headerKey);

  if (!profile) {
    return false;
  }

  return options.requireOwner ? profile.role === "owner" : true;
}
