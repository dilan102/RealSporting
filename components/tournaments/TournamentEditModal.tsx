"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, RotateCcw, Save, X } from "lucide-react";
import type { Tournament, TournamentStatus } from "@/lib/tournament-store";
import { defaultEndDateFromStart } from "@/lib/publication-dates";

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

async function parseTournamentResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el torneo.");
  }

  return payload;
}

export function TournamentEditModal({
  item,
  isOpen,
  onClose,
  onSuccess,
  accessKey,
}: {
  item: Tournament | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessKey: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TournamentForm>({
    name: "",
    description: "",
    schedule: "",
    venue: "",
    category: "",
    opponent: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: defaultEndDateFromStart(new Date().toISOString().slice(0, 10)),
    status: "future",
    visibility: "draft",
    image: "",
    file: null,
  });
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (item && isOpen) {
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
      setMessage("");
    }
  }, [item, isOpen]);

  useEffect(() => {
    return () => {
      if (form.image.startsWith("blob:")) {
        URL.revokeObjectURL(form.image);
      }
    };
  }, [form.image]);

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

    if (!form.name.trim() || !form.description.trim() || !form.startDate || !form.endDate) {
      setMessage("Completa nombre, descripción y fechas del torneo.");
      return;
    }

    setSaving(true);
    setMessage("Guardando torneo...");

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
        `/api/tournaments?id=${encodeURIComponent(item!.id)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: accessKey ? { "x-admin-key": accessKey } : undefined,
          body,
        },
      );
      await parseTournamentResponse(response);
      router.refresh();
      setMessage("Torneo actualizado correctamente.");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el torneo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar este torneo?")) {
      return;
    }

    setSaving(true);
    setMessage("Borrando torneo...");

    try {
      const response = await fetch(
        `/api/tournaments?id=${encodeURIComponent(item!.id)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: accessKey ? { "x-admin-key": accessKey } : undefined,
        },
      );
      await parseTournamentResponse(response);
      router.refresh();
      setMessage("Torneo borrado correctamente.");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo borrar el torneo.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg border border-border bg-bg-elevated shadow-lg">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-border bg-bg px-6 py-4">
            <h2 className="text-lg font-bold">Editar Torneo</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-bg-elevated transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 grid gap-6">
            {/* Name */}
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

            {/* Description */}
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Descripción
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
                rows={3}
              />
            </label>

            {/* Status */}
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
                <option value="played">Torneo jugado</option>
                <option value="won">Torneo ganado</option>
                <option value="future">Torneo por jugar</option>
              </select>
            </label>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Fecha inicio
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
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
            </div>

            {/* Venue & Category */}
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            {/* Opponent */}
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Rival
              <input
                value={form.opponent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, opponent: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </label>

            {/* Schedule */}
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Programación
              <textarea
                value={form.schedule}
                onChange={(event) =>
                  setForm((current) => ({ ...current, schedule: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
                rows={3}
                placeholder="Ej: Fase de grupos: 3-0 vs Academia..."
              />
            </label>

            {/* Image */}
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Imagen del torneo
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="tournament-image"
                />
                <label
                  htmlFor="tournament-image"
                  className="flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-3 text-sm font-medium text-text cursor-pointer hover:border-accent transition-colors"
                >
                  <ImagePlus size={16} />
                  {fileName || "Seleccionar imagen"}
                </label>
              </div>
            </label>

            {form.image && (
              <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-surface">
                <Image
                  src={form.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            )}

            {/* Visibility */}
            <label className="text-xs font-medium uppercase tracking-normal text-muted">
              Estado de publicación
              <select
                value={form.visibility}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    visibility: event.target.value as "published" | "draft",
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </label>

            {/* Message */}
            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
                message.includes("Error") || message.includes("No se pudo")
                  ? "bg-red-500/15 text-red-500 border border-red-500/30"
                  : "bg-accent/15 text-accent border border-accent/30"
              }`}>
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-accent bg-accent/15 px-4 py-3 text-sm font-bold text-accent hover:bg-accent/25 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-red-500/35 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                Borrar torneo
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold text-text hover:border-accent transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
