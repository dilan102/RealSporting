import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const adminUser = process.env.ADMIN_USER || "Real Sporting";
const adminPassword = process.env.ADMIN_PASSWORD || "RealSporting1985";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    user?: string;
    password?: string;
  } | null;

  if (!body?.user || !body?.password) {
    return NextResponse.json({ error: "Completa usuario y contraseña." }, { status: 400 });
  }

  if (body.user.trim() !== adminUser || body.password !== adminPassword) {
    return NextResponse.json({ error: "Credenciales incorrectas." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
