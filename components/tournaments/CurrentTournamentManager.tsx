"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RotateCcw, Save, X } from "lucide-react";
import type { CurrentTournament } from "@/lib/current-tournament-store";
import { defaultEndDateFromStart } from "@/lib/publication-dates";
import { CurrentTournamentCard } from "./CurrentTournamentCard";

type CurrentTournamentForm = {
  name: string;
  description: string;
  schedule: string;
  venue: string;
  category: string;
  opponent: string;
  startDate: string;
  endDate: string;
  visibility: "published" | "draft";
  image: string;
  file: File | null;
  images: string[];
};

type ApiResponse = {
  error?: string;
  item?: CurrentTournament;
  items?: CurrentTournament[];
};

const emptyForm = (): CurrentTournamentForm => {
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
    visibility: "draft",
    image: "",
    file: null,
    images: [],
  };
};

async function parseCurrentTournamentResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el torneo actual.");
  }

  return payload;
}

async function fetchCurrentTournament(accessKey = "") {
  const response = await fetch("/api/current-tournament", {
    cache: "no-store",
    credentials: "include",
    headers: accessKey ? { "x-admin-key": accessKey } : undefined,
  });
  const payload = await parseCurrentTournamentResponse(response);

  return payload.item || null;
}

export function CurrentTournamentManager({
  initialItem,
}: {
  initialItem: CurrentTournament | null;
}) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [form, setForm] = useState<CurrentTournamentForm>(() =>
    initialItem
      ? {
          name: initialItem.name,
          description: initialItem.description,
          schedule: initialItem.schedule,
          venue: initialItem.venue,
          category: initialItem.category,
          opponent: initialItem.opponent,
          startDate: initialItem.startDate,
          endDate: initialItem.endDate,
          visibility: initialItem.visibility,
          image: initialItem.image,
          file: null,
          images: initialItem.images,
        }
      : emptyForm(),
  );
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    fetchCurrentTournament(accessKey)
      .then((nextItem) => {
        if (active) {
          setItem(nextItem);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudo cargar el torneo actual.");
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

  const resetForm = () => {
    setForm(emptyForm());
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
    setMessage(item ? "Guardando torneo..." : "Publicando torneo...");

    const body = new FormData();
    body.set("name", form.name.trim());
    body.set("description", form.description.trim());
    body.set("schedule", form.schedule.trim());
    body.set("venue", form.venue.trim());
    body.set("category", form.category.trim());
    body.set("opponent", form.opponent.trim());
    body.set("startDate", form.startDate);
    body.set("endDate", form.endDate);
    body.set("visibility", form.visibility);
    body.set("images", JSON.stringify(form.images));

    if (form.file) {
      body.set("image", form.file);
    }

    try {
      const response = await fetch(
        item ? `/api/current-tournament?id=${encodeURIComponent(item.id)}` : "/api/current-tournament",
        {
          method: item ? "PUT" : "POST",
          credentials: "include",
          headers: accessKey ? { "x-admin-key": accessKey } : undefined,
          body,
        },
      );
      const result = await parseCurrentTournamentResponse(response);
      setItem(result.item || null);
      resetForm();
      router.refresh();
      setMessage(item ? "Torneo actualizado." : "Torneo publicado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el torneo.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description,
        schedule: item.schedule,
        venue: item.venue,
        category: item.category,
        opponent: item.opponent,
        startDate: item.startDate,
        endDate: item.endDate,
        visibility: item.visibility,
        image: item.image,
        file: null,
        images: item.images,
      });
      setMessage("Editando torneo actual.");
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setSaving(true);
    setMessage("Borrando torneo...");

    try {
      const response = await fetch(`/api/current-tournament?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-admin-key": accessKey } : undefined,
      });
      await parseCurrentTournamentResponse(response);
      setItem(null);
      resetForm();
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
      {item && (
        <div className="mb-10">
          <div className="mb-6 max-w-3xl">
            <p className="eyebrow">Vista previa</p>
            <h2 className="font-stadium mt-3 text-4xl font-black sm:text-5xl">
              Torneo Actual
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CurrentTournamentCard
              item={item}
              canManage={unlocked}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {unlocked && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-border bg-bg-elevated p-6">
            <h3 className="mb-4 text-xl font-bold">
              {item ? "Editar Torneo Actual" : "Crear Torneo Actual"}
            </h3>

            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">
                  Nombre del torneo *
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  placeholder="Ej: Copa Regional 2026"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold mb-2">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  placeholder="Detalles del torneo"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-bold mb-2">
                    Categoría
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                    placeholder="U-14, U-17, etc"
                  />
                </div>

                <div>
                  <label htmlFor="opponent" className="block text-sm font-bold mb-2">
                    Rival
                  </label>
                  <input
                    id="opponent"
                    type="text"
                    value={form.opponent}
                    onChange={(e) => setForm({ ...form, opponent: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                    placeholder="Nombre del rival"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venue" className="block text-sm font-bold mb-2">
                    Sede
                  </label>
                  <input
                    id="venue"
                    type="text"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                    placeholder="Lugar del torneo"
                  />
                </div>

                <div>
                  <label htmlFor="schedule" className="block text-sm font-bold mb-2">
                    Programación
                  </label>
                  <input
                    id="schedule"
                    type="text"
                    value={form.schedule}
                    onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                    placeholder="Horarios de juego"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-bold mb-2">
                    Fecha inicio *
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-bold mb-2">
                    Fecha fin *
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="visibility" className="block text-sm font-bold mb-2">
                  Visibilidad
                </label>
                <select
                  id="visibility"
                  value={form.visibility}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibility: e.target.value as "published" | "draft",
                    })
                  }
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-bold mb-2">
                  Imagen principal
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                {fileName && <p className="text-xs text-muted mt-1">{fileName}</p>}
              </div>

              {form.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {message && (
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm text-accent">
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-[var(--button-text)] transition-colors hover:bg-accent/90 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Guardando..." : "Guardar torneo"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold transition-colors hover:border-text"
                >
                  <RotateCcw size={16} />
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
