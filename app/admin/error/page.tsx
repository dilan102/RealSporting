import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";

export const metadata: Metadata = {
  title: "Error de acceso",
  description: "No se pudo completar el inicio de sesión de administrador.",
};

type AdminErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminErrorPage({ searchParams }: AdminErrorPageProps) {
  const { error } = await searchParams;
  const message = getAuthErrorMessage(error);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 shrink-0 text-red-600" size={24} aria-hidden="true" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Acceso denegado
            </p>
            <h1 className="mt-2 text-2xl font-black">No se pudo iniciar sesión</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">{message}</p>
            {error && (
              <p className="mt-3 text-xs font-mono text-muted">
                Código: <span className="font-semibold">{error}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <GitHubSignInButton callbackUrl="/" label="Intentar de nuevo con GitHub" />
          <Link
            href="/admin/login"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-bg px-5 text-sm font-black text-text transition-colors hover:border-accent"
          >
            Volver al inicio de sesión
          </Link>
          <Link href="/" className="block text-center text-sm font-semibold text-accent hover:underline">
            Ir al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
