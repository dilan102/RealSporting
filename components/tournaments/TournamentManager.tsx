"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RotateCcw, Save, Trophy, X } from "lucide-react";
import type { Tournament, TournamentStatus } from "@/lib/tournament-store";
import { defaultEndDateFromStart } from "@/lib/publication-dates";
import { TournamentCard } from "./TournamentCard";

type TournamentForm = {
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  visibility: "published" | "draft";
  image: string;
  file: File | null;
};

type ApiResponse = {
  error?: string;
  items?: Tournament[];
};

const emptyForm = (): TournamentForm => {
  const startDate = new Date().toISOString().slice(0, 10);

  return {
    name: "",
    description: "",
    schedule: "",
    venue: "",
    category: "",
    opponent: "",
    startDate,
    endDate: defaultEndDateFromStart(startDate),
    status: "current",
    visibility: "draft",
    image: "",
    file: null,
  };
};

async function parseTournamentResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el torneo.");
  }

  return payload;
}

async function fetchTournaments(accessKey = "") {
  const response = await fetch("/api/tournaments", {
    cache: "no-store",
    credentials: "include",
    headers: accessKey ? { "x-admin-key": accessKey } : undefined,
  });
  const payload = await parseTournamentResponse(response);

  return payload.items || [];
}

export function TournamentManager({
  initialItems,
  showList = true,
}: {
  initialItems: Tournament[];
  showList?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<TournamentForm>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    let active = true;

    setLoading(true);
    fetchTournaments(accessKey)
      .then((nextItems) => {
        if (active) {
          setItems(nextItems);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar los torneos guardados.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [accessKey]);

  useEffect(() => {
    const syncAdminAccess = () => {
      const key = window.sessionStorage.getItem("cdrs-admin-key") || "";

      setAccessKey(key);
      setUnlocked(Boolean(key));
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
    return () => {
      if (form.image.startsWith("blob:")) {
        URL.revokeObjectURL(form.image);
      }
    };
  }, [form.image]);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [items],
  );

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setFileName("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Selecciona una imagen para el torneo.");
      return;
    }

    const image = URL.createObjectURL(file);
    setForm((current) => {
      if (current.image.startsWith("blob:")) {
        URL.revokeObjectURL(current.image);
      }

      return { ...current, file, image };
    });
    setFileName(file.name);
    setMessage("Imagen cargada en el formulario.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!unlocked) {
      setMessage("Activa el modo administrador antes de guardar torneos.");
      return;
    }

    if (!form.name.trim() || !form.description.trim() || !form.startDate || !form.endDate) {
      setMessage("Completa nombre, descripción y fechas del torneo.");
      return;
    }

    setSaving(true);
    setMessage(editingId ? "Guardando torneo..." : "Publicando torneo...");

    const body = new FormData();
    body.set("name", form.name.trim());
    body.set("description", form.description.trim());
    body.set("schedule", form.schedule.trim());
    body.set("venue", form.venue.trim());
    body.set("category", form.category.trim());
    body.set("opponent", form.opponent.trim());
    body.set("startDate", form.startDate);
    body.set("endDate", form.endDate);
    body.set("status", form.status);
    body.set("visibility", form.visibility);

    if (form.file) {
      body.set("image", form.file);
    }

    try {
      const response = await fetch(
        editingId ? `/api/tournaments?id=${encodeURIComponent(editingId)}` : "/api/tournaments",
        {
          method: editingId ? "PUT" : "POST",
          credentials: "include",
          headers: accessKey ? { "x-admin-key": accessKey } : undefined,
          body,
        },
      );
      await parseTournamentResponse(response);
      setItems(await fetchTournaments(accessKey));
      resetForm();
      router.refresh();
      setMessage(editingId ? "Torneo actualizado." : "Torneo publicado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el torneo.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Tournament) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      schedule: item.schedule,
      venue: item.venue,
      category: item.category,
      opponent: item.opponent,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status,
      visibility: item.visibility,
      image: item.image,
      file: null,
    });
    setFileName("");
    setMessage("Editando torneo.");
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setMessage("Borrando torneo...");

    try {
      const response = await fetch(`/api/tournaments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-admin-key": accessKey } : undefined,
      });
      await parseTournamentResponse(response);
      setItems(await fetchTournaments(accessKey));

      if (editingId === id) {
        resetForm();
      }

      router.refresh();
      setMessage("Torneo borrado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo borrar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {(showList || unlocked) && (
        <div className="mt-10">
          {loading && orderedItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center text-sm font-semibold text-muted">
              Cargando torneos...
            </div>
          ) : orderedItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {orderedItems.map((item) => (
                <TournamentCard
                  key={item.id}
                  item={item}
                  canManage={unlocked}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center">
              <p className="text-sm font-semibold text-text">No hay torneos publicados todavía.</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                La programación aparecerá aquí cuando el administrador la suba.
              </p>
            </div>
          )}
        </div>
      )}

      {unlocked && (
        <section
          id="admin-torneos"
          className="glass mobile-card-lift mt-16 scroll-mt-28 rounded-lg border-dashed p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                Panel activo
              </span>
              <h3 className="mt-4 text-xl font-bold">Programación de torneos</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                Sube torneos ganados, jugados, actuales o futuros con fechas,
                sede, categoría y programación.
              </p>
            </div>
            <Trophy className="text-accent/50" size={32} aria-hidden="true" />
          </div>

          <form className="mt-8 grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Nombre del torneo
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Estado
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as TournamentStatus,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              >
                <option value="current">Torneo actual</option>
                <option value="future">Torneo a futuro</option>
                <option value="played">Torneo jugado</option>
                <option value="won">Torneo ganado</option>
              </select>
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Fecha inicio
              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                    endDate: current.endDate || defaultEndDateFromStart(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Fecha fin
              <input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, endDate: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Sede
              <input
                value={form.venue}
                onChange={(event) =>
                  setForm((current) => ({ ...current, venue: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Categoría
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Rival u organizador
              <input
                value={form.opponent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, opponent: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Visibilidad
              <select
                value={form.visibility}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    visibility: event.target.value as TournamentForm["visibility"],
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </label>

            <label className="sm:col-span-2 text-xs font-medium uppercase tracking-normal text-muted">
              Descripción
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="sm:col-span-2 text-xs font-medium uppercase tracking-normal text-muted">
              Programación
              <textarea
                value={form.schedule}
                onChange={(event) =>
                  setForm((current) => ({ ...current, schedule: event.target.value }))
                }
                rows={5}
                placeholder="Ej: Sábado 8:00 a.m. vs rival / Domingo semifinal..."
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            <label className="sm:col-span-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg p-6 text-center transition-colors hover:border-accent">
              <ImagePlus className="text-accent" size={28} aria-hidden="true" />
              <span className="mt-3 text-sm font-black text-text">
                {fileName || "Subir imagen del torneo"}
              </span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
            </label>

            {message && (
              <p className="sm:col-span-2 text-sm font-semibold text-muted" role="status">
                {message}
              </p>
            )}

            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-gold inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} aria-hidden="true" />
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Subir torneo"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-black text-text transition-colors hover:border-accent"
              >
                {editingId ? (
                  <X size={16} aria-hidden="true" />
                ) : (
                  <RotateCcw size={16} aria-hidden="true" />
                )}
                {editingId ? "Cancelar edición" : "Limpiar"}
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
