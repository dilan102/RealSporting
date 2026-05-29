"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

type AdminPasswordLoginFormProps = {
  callbackUrl?: string;
};

export function AdminPasswordLoginForm({ callbackUrl = "/" }: AdminPasswordLoginFormProps) {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Validando acceso...");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Credenciales incorrectas.");
      }

      window.sessionStorage.setItem("cdrs-admin-key", password);
      window.dispatchEvent(new Event("cdrs-admin-login"));
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudo iniciar sesión con contraseña.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-bold">
        Usuario
        <input
          value={user}
          onChange={(event) => setUser(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          autoComplete="username"
          required
        />
      </label>
      <label className="block text-sm font-bold">
        Contraseña
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          autoComplete="current-password"
          required
        />
      </label>
      {message && (
        <p
          className={`text-sm font-semibold ${message.includes("Validando") ? "text-muted" : "text-red-600 dark:text-red-300"}`}
          role="status"
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-accent/35 bg-accent/10 px-5 text-sm font-black text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShieldCheck size={16} aria-hidden="true" />
        {saving ? "Validando..." : "Entrar con contraseña"}
      </button>
    </form>
  );
}
