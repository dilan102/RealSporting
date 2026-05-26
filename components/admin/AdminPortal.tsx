"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  LogOut,
  Pencil,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";

type EditableItem = {
  key: string;
  label: string;
  value: string;
};

const STORAGE_KEY = "cdrs-admin-text-overrides";

function getElementKey(element: Element, index: number) {
  const explicit = element.getAttribute("data-admin-key");

  if (explicit) {
    return explicit;
  }

  const text = element.textContent?.trim().slice(0, 52) || `elemento-${index}`;

  return `${element.tagName.toLowerCase()}-${index}-${text}`;
}

function getOverrides() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

async function fetchOverrides() {
  try {
    const response = await fetch("/api/content-overrides", { cache: "no-store" });
    const payload = (await response.json()) as { items?: Record<string, string> };

    if (response.ok && payload.items) {
      saveOverrides(payload.items);
      return payload.items;
    }
  } catch {
    // Local overrides keep the editor usable when the API is not available.
  }

  return getOverrides();
}

export function AdminPortal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [panelOpen, setPanelOpen] = useState(false);

  const editableSelector = useMemo(
    () =>
      [
        "main h1",
        "main h2",
        "main h3",
        "main p",
        "main li",
        "main a:not([href^='mailto']):not([href^='tel'])",
      ].join(","),
    [],
  );

  useEffect(() => {
    let active = true;

    fetchOverrides().then((overrides) => {
      if (!active) {
        return;
      }

      Array.from(document.querySelectorAll(editableSelector)).forEach((element, index) => {
        const key = getElementKey(element, index);

        element.setAttribute("data-admin-key", key);

        if (overrides[key]) {
          element.textContent = overrides[key];
        }
      });
    });

    return () => {
      active = false;
    };
  }, [editableSelector]);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-mode", adminMode);

    if (!adminMode) {
      return;
    }

    const overrides = getOverrides();
    const elements = Array.from(document.querySelectorAll(editableSelector)).filter((element) => {
      const text = element.textContent?.trim() || "";

      return text.length > 1 && text.length < 520 && !element.closest("[data-admin-ignore]");
    });

    const nextItems = elements.slice(0, 90).map((element, index) => {
      const key = getElementKey(element, index);
      const value = overrides[key] || element.textContent?.trim() || "";

      element.setAttribute("data-admin-key", key);
      element.setAttribute("data-admin-editable", "true");
      element.textContent = value;

      return {
        key,
        label: `${element.tagName.toLowerCase()} ${index + 1}`,
        value,
      };
    });

    setItems(nextItems);
    setDrafts(Object.fromEntries(nextItems.map((item) => [item.key, item.value])));
    setPanelOpen(true);

    return () => {
      document.querySelectorAll("[data-admin-editable]").forEach((element) => {
        element.removeAttribute("data-admin-editable");
      });
    };
  }, [adminMode, editableSelector]);

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
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo iniciar sesión.");
      }

      setAdminMode(true);
      window.sessionStorage.setItem("cdrs-admin-key", password);
      window.dispatchEvent(new Event("cdrs-admin-login"));
      setModalOpen(false);
      setUser("");
      setPassword("");
      setMessage("Modo administrador activo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    saveOverrides(drafts);
    Object.entries(drafts).forEach(([key, value]) => {
      document.querySelectorAll(`[data-admin-key="${CSS.escape(key)}"]`).forEach((element) => {
        element.textContent = value;
      });
    });
    setMessage("Guardando cambios...");

    try {
      const response = await fetch("/api/content-overrides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": window.sessionStorage.getItem("cdrs-admin-key") || "",
        },
        body: JSON.stringify({ items: drafts }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "No se pudieron guardar los cambios.");
      }

      setMessage("Cambios guardados dinámicamente.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `${error.message} Se conservaron localmente.`
          : "Cambios conservados localmente.",
      );
    }
  };

  const exitAdmin = () => {
    setAdminMode(false);
    setPanelOpen(false);
    window.sessionStorage.removeItem("cdrs-admin-key");
    window.dispatchEvent(new Event("cdrs-admin-logout"));
    setMessage("");
  };

  return (
    <div data-admin-ignore>
      {modalOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 px-4 backdrop-blur-md">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-lg border border-border bg-bg-elevated p-6 text-text shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
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

            <label className="mt-6 block text-sm font-bold">
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

            {message && <p className="mt-4 text-sm font-semibold text-muted">{message}</p>}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-black text-bg transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={18} aria-hidden="true" />
              {saving ? "Validando..." : "Activar administrador"}
            </button>
          </form>
        </div>
      )}

      {adminMode && panelOpen && (
        <aside className="fixed bottom-4 right-4 z-[75] max-h-[72vh] w-[min(92vw,430px)] overflow-hidden rounded-lg border border-border bg-bg-elevated text-text shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                Edición en vivo
              </p>
              <h2 className="text-lg font-black">Panel de contenido</h2>
            </div>
            <button
              type="button"
              onClick={exitAdmin}
              className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
              aria-label="Salir"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="max-h-[48vh] space-y-3 overflow-y-auto p-4">
            {items.map((item) => (
              <label key={item.key} className="block rounded-lg border border-border bg-bg/55 p-3">
                <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-accent-secondary">
                  <Pencil size={13} aria-hidden="true" />
                  {item.label}
                </span>
                <textarea
                  value={drafts[item.key] || ""}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [item.key]: event.target.value,
                    }))
                  }
                  rows={Math.min(5, Math.max(2, Math.ceil((drafts[item.key]?.length || 0) / 78)))}
                  className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-sm leading-6 outline-none transition-colors focus:border-accent"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-2 border-t border-border p-4 sm:grid-cols-2">
            <a
              href="/noticias"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-black transition-colors hover:border-accent hover:text-accent"
            >
              <ImagePlus size={17} aria-hidden="true" />
              Medios y noticias
            </a>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-black text-bg transition-colors hover:bg-accent/90"
            >
              <Save size={17} aria-hidden="true" />
              Guardar cambios
            </button>
          </div>
          {message && <p className="border-t border-border px-4 py-3 text-xs font-semibold text-muted">{message}</p>}
        </aside>
      )}
    </div>
  );
}
