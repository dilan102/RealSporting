import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";
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
          Inicia sesión con GitHub para gestionar noticias, equipo y entrenamientos. Solo
          cuentas autorizadas pueden acceder.
        </p>

        <div className="mt-6 space-y-4">
          <GitHubSignInButton callbackUrl={callbackUrl ?? "/"} />

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <p className="relative mx-auto w-fit bg-bg-elevated px-3 text-xs font-semibold text-muted">
              o acceso con contraseña
            </p>
          </div>

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
