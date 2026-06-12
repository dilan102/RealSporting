"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  LogOut,
  Newspaper,
  PlusCircle,
  ShieldCheck,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import type { AdminRole } from "@/lib/admin-profiles";

const adminActions = [
  {
    href: "/noticias#admin-noticias",
    label: "Añadir noticia",
    description: "Publicar una novedad del club.",
    Icon: Newspaper,
  },
  {
    href: "/equipo#admin-equipo",
    label: "Añadir equipo",
    description: "Registrar jugadores por categoría.",
    Icon: UsersRound,
  },
  {
    href: "/entrenamientos#admin-entrenamientos",
    label: "Añadir entrenamiento",
    description: "Subir fotos, videos y descripción.",
    Icon: Dumbbell,
  },
  {
    href: "/torneos#admin-torneos",
    label: "Añadir torneo",
    description: "Subir programación y estado competitivo.",
    Icon: Trophy,
  },
];

const adminMetrics = [
  { label: "Módulos", value: "4" },
  { label: "Publicación", value: "Activa" },
  { label: "Acceso", value: "Seguro" },
];

export function AdminPortal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [adminLabel, setAdminLabel] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const syncAdminAccess = () => {
      const hasPasswordAccess = Boolean(window.sessionStorage.getItem("cdrs-admin-key"));
      setAdminMode(hasPasswordAccess);
      setAdminRole((window.sessionStorage.getItem("cdrs-admin-role") as AdminRole | null) || null);
      setAdminLabel(window.sessionStorage.getItem("cdrs-admin-label") || "");
      setAdminUser(window.sessionStorage.getItem("cdrs-admin-user") || "");
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

  useEffect(() => {
    const handleAdminToggle = () => {
      if (adminMode) {
        setPanelOpen((value) => !value);
        return;
      }

      setModalOpen(true);
    };

    window.addEventListener("cdrs-admin-toggle", handleAdminToggle);

    return () => window.removeEventListener("cdrs-admin-toggle", handleAdminToggle);
  }, [adminMode]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("Validando acceso...");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const payload = (await response.json()) as {
        error?: string;
        role?: AdminRole;
        label?: string;
        user?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo iniciar sesión.");
      }

      setAdminMode(true);
      setAdminRole(payload.role || "content");
      setAdminLabel(payload.label || "Administrador de contenido");
      setAdminUser(payload.user || user.trim());
      window.sessionStorage.setItem("cdrs-admin-key", password);
      window.sessionStorage.setItem("cdrs-admin-role", payload.role || "content");
      window.sessionStorage.setItem(
        "cdrs-admin-label",
        payload.label || "Administrador de contenido",
      );
      window.sessionStorage.setItem("cdrs-admin-user", payload.user || user.trim());
      window.dispatchEvent(new Event("cdrs-admin-login"));
      setModalOpen(false);
      setUser("");
      setPassword("");
      setPanelOpen(true);
      setMessage("Modo administrador activo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setSaving(false);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
  };

  const exitAdmin = () => {
    setAdminMode(false);
    setPanelOpen(false);
    setAdminRole(null);
    setAdminLabel("");
    setAdminUser("");
    window.sessionStorage.removeItem("cdrs-admin-key");
    window.sessionStorage.removeItem("cdrs-admin-role");
    window.sessionStorage.removeItem("cdrs-admin-label");
    window.sessionStorage.removeItem("cdrs-admin-user");
    window.dispatchEvent(new Event("cdrs-admin-logout"));
    setMessage("");
  };

  return (
    <div data-admin-ignore>
      {modalOpen && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/55 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <form
            onSubmit={handleLogin}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-border bg-bg-elevated p-6 text-text shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-accent">
                  Acceso privado
                </p>
                <h2 className="mt-2 text-2xl font-black">Modo Administrador</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm text-muted">
              Usa el perfil del club. El administrador de contenido publica y edita
              publicaciones; el administrador total edita textos y encabezados del sitio.
            </p>

            <label className="block text-sm font-bold">
              Usuario
              <input
                value={user}
                onChange={(event) => setUser(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                autoComplete="username"
              />
            </label>
            <label className="mt-4 block text-sm font-bold">
              Contraseña
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                autoComplete="current-password"
              />
            </label>

            {message && (
              <p
                className={`mt-4 text-sm font-semibold ${message.includes("Validando") || message.includes("activo") ? "text-muted" : "text-red-600 dark:text-red-300"}`}
                role="status"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-black text-[var(--button-text)] transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={18} aria-hidden="true" />
              {saving ? "Validando..." : "Activar administrador"}
            </button>
          </form>
        </div>
      )}

      {adminMode && panelOpen && (
        <div
          className="fixed inset-0 z-[75]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePanel();
            }
          }}
        >
          <aside
            className="fixed bottom-4 right-4 max-h-[72vh] w-[min(92vw,430px)] overflow-hidden rounded-lg border border-border bg-bg-elevated text-text shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-normal text-accent">
                  {adminLabel || "Administrador"}
                </p>
                <h2 className="text-lg font-black">Centro administrativo</h2>
                <p className="mt-1 truncate text-xs text-muted">
                  {adminUser || (adminRole === "owner" ? "Perfil total" : "Perfil de contenido")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={closePanel}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
                  aria-label="Cerrar panel"
                  title="Cerrar panel"
                >
                  <X size={18} />
                </button>
                <button
                  type="button"
                  onClick={exitAdmin}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
                  aria-label="Salir"
                  title="Salir"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-border p-4">
              {adminMetrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-border bg-bg/65 p-3">
                  <p className="text-lg font-black text-accent">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase text-muted">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="max-h-[48vh] space-y-3 overflow-y-auto p-4">
              {adminActions.map((action) => {
                const ActionIcon = action.Icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setPanelOpen(false)}
                    className="group flex items-center gap-3 rounded-lg border border-border bg-bg/65 p-4 transition-colors hover:border-accent hover:bg-bg"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-[var(--button-text)]">
                      <ActionIcon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-black">
                        {action.label}
                        <PlusCircle size={16} className="text-accent" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-muted">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <p className="border-t border-border px-4 py-3 text-xs font-semibold text-muted">
              {adminRole === "owner"
                ? "Perfil total activo: puede editar textos, encabezados y publicaciones."
                : "Perfil de contenido activo: puede publicar y editar publicaciones."}
            </p>
            {message && (
              <p className="border-t border-border px-4 py-3 text-xs font-semibold text-muted">
                {message}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
