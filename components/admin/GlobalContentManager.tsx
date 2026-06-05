"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, RotateCcw, Save, X } from "lucide-react";
import { editableContentDefaults, editableContentGroups } from "@/lib/editable-content";
import type { AdminRole } from "@/lib/admin-profiles";

type OverrideResponse = {
  error?: string;
  items?: Record<string, string>;
};

export function GlobalContentManager() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [role, setRole] = useState<AdminRole | null>(null);
  const [open, setOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(editableContentGroups[0]?.id || "");
  const [values, setValues] = useState<Record<string, string>>(editableContentDefaults);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const isOwner = Boolean(accessKey) && role === "owner";

  const activeGroup = useMemo(
    () =>
      editableContentGroups.find((group) => group.id === activeGroupId) ||
      editableContentGroups[0],
    [activeGroupId],
  );

  useEffect(() => {
    const syncAdminAccess = () => {
      setAccessKey(window.sessionStorage.getItem("cdrs-admin-key") || "");
      setRole((window.sessionStorage.getItem("cdrs-admin-role") as AdminRole | null) || null);
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
    if (!isOwner) {
      setOpen(false);
      return;
    }

    let active = true;

    fetch("/api/content-overrides", { cache: "no-store", credentials: "include" })
      .then((response) => response.json())
      .then((payload: OverrideResponse) => {
        if (active) {
          setValues({ ...editableContentDefaults, ...(payload.items || {}) });
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar los textos globales.");
        }
      });

    return () => {
      active = false;
    };
  }, [isOwner]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOwner) {
      setMessage("Activa el administrador total antes de guardar.");
      return;
    }

    setSaving(true);
    setMessage("Guardando textos...");

    try {
      const currentResponse = await fetch("/api/content-overrides", {
        cache: "no-store",
        credentials: "include",
      });
      const currentPayload = (await currentResponse.json()) as OverrideResponse;
      const nextItems = { ...(currentPayload.items || {}) };

      Object.entries(editableContentDefaults).forEach(([key, fallback]) => {
        const trimmed = (values[key] || "").trim();

        if (!trimmed || trimmed === fallback) {
          delete nextItems[key];
          return;
        }

        nextItems[key] = trimmed;
      });

      const response = await fetch("/api/content-overrides", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": accessKey,
        },
        body: JSON.stringify({ items: nextItems }),
      });
      const payload = (await response.json()) as OverrideResponse;

      if (!response.ok) {
        throw new Error(payload.error || "No se pudieron guardar los textos.");
      }

      router.refresh();
      setMessage("Textos actualizados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron guardar los textos.");
    } finally {
      setSaving(false);
    }
  };

  const resetActiveGroup = () => {
    setValues((current) => {
      const next = { ...current };

      activeGroup.fields.forEach((field) => {
        next[field.key] = field.defaultValue;
      });

      return next;
    });
    setMessage("Grupo restaurado en el formulario.");
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div data-admin-ignore>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-4 left-4 z-[70] inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text shadow-xl transition-colors hover:border-accent"
      >
        <Edit3 size={16} aria-hidden="true" />
        Editar textos
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <aside
            className="ml-auto flex h-full w-[min(96vw,760px)] flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated text-text shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-accent">
                  Administrador total
                </p>
                <h2 className="text-xl font-black">Textos y encabezados del sitio</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
                aria-label="Cerrar editor de textos"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
              <div className="flex flex-wrap gap-2">
                {editableContentGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    className={`min-h-10 rounded-lg border px-4 text-sm font-black transition-colors ${
                      activeGroup.id === group.id
                        ? "border-accent bg-accent text-[var(--button-text)]"
                        : "border-border bg-bg text-text hover:border-accent"
                    }`}
                  >
                    {group.title}
                  </button>
                ))}
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-base font-black">{activeGroup.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{activeGroup.description}</p>
                </div>

                {activeGroup.fields.map((field) => (
                  <label
                    key={field.key}
                    className="text-xs font-medium uppercase tracking-normal text-muted"
                  >
                    {field.label}
                    {field.multiline ? (
                      <textarea
                        value={values[field.key] || ""}
                        onChange={(event) =>
                          setValues((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                        rows={4}
                        className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm normal-case text-text outline-none focus:border-accent"
                      />
                    ) : (
                      <input
                        value={values[field.key] || ""}
                        onChange={(event) =>
                          setValues((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                        className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm normal-case text-text outline-none focus:border-accent"
                      />
                    )}
                  </label>
                ))}

                {message && (
                  <p className="text-sm font-semibold text-muted" role="status">
                    {message}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} aria-hidden="true" />
                    {saving ? "Guardando..." : "Guardar textos"}
                  </button>
                  <button
                    type="button"
                    onClick={resetActiveGroup}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-black text-text transition-colors hover:border-accent"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    Restaurar grupo
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
