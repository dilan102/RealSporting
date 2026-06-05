import { NextRequest, NextResponse } from "next/server";
import { findAdminProfile } from "@/lib/admin-profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    user?: string;
    password?: string;
  } | null;

  if (!body?.user || !body?.password) {
    return NextResponse.json({ error: "Completa usuario y contraseña." }, { status: 400 });
  }

  const profile = findAdminProfile(body.user, body.password);

  if (!profile) {
    return NextResponse.json({ error: "Credenciales incorrectas." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    role: profile.role,
    label: profile.label,
    user: profile.user,
  });
}
