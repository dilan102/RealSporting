import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AdminPasswordLoginForm } from "@/components/auth/AdminPasswordLoginForm";

export const metadata: Metadata = {
  title: "Acceso administrador",
  description: "Inicio de sesión para administradores del Club Deportivo Real Sporting.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-lg border border-border bg-bg-elevated p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-accent/15 text-accent">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Panel privado
            </p>
            <h1 className="text-2xl font-black">Administración</h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Inicia sesión con usuario y contraseña del club. El perfil de contenido
          publica y edita publicaciones; el perfil total edita textos y encabezados
          del sitio.
        </p>

        <div className="mt-6 space-y-4">
          <AdminPasswordLoginForm callbackUrl={callbackUrl ?? "/"} />
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
