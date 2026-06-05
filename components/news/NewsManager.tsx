"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react";
import type { News } from "@/lib/content";
import { defaultEndDateFromStart } from "@/lib/publication-dates";
import { NewsGrid } from "./NewsGrid";

type NewsForm = {
  title: string;
  date: string;
  endDate: string;
  category: string;
  summary: string;
  body: string;
  image: string;
  file: File | null;
  status: "published" | "draft";
};

type ApiResponse = {
  error?: string;
  items?: News[];
};

const emptyForm = (): NewsForm => {
  const date = new Date().toISOString().slice(0, 10);

  return {
  title: "",
  date,
  endDate: defaultEndDateFromStart(date),
  category: "",
  summary: "",
  body: "",
  image: "",
  file: null,
  status: "draft",
  };
};

async function parseNewsResponse(response: Response) {
  const text = await response.text();
  let payload: ApiResponse = {};

  if (text.trim()) {
    try {
      payload = JSON.parse(text) as ApiResponse;
    } catch {
      throw new Error(
        response.ok
          ? "El servidor devolvió una respuesta inválida."
          : `El servidor respondió ${response.status} sin un JSON válido.`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      payload.error ||
        `No se pudo guardar la noticia. El servidor respondió ${response.status}.`,
    );
  }

  return payload;
}

async function fetchNews(accessKey = "") {
  const response = await fetch("/api/news", {
    cache: "no-store",
    credentials: "include",
    headers: accessKey ? { "x-news-key": accessKey } : undefined,
  });
  const payload = await parseNewsResponse(response);

  return payload.items || [];
}

export function NewsManager({
  initialItems,
  showList = true,
}: {
  initialItems: News[];
  showList?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<NewsForm>(() => emptyForm());
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
    fetchNews(accessKey)
      .then((nextItems) => {
        if (active) {
          setItems(nextItems);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar las noticias guardadas.");
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
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
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
      setMessage("Selecciona una imagen para la noticia.");
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
      setMessage("Ingresa la clave antes de subir o editar.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.date ||
      !form.endDate ||
      !form.category.trim() ||
      !form.summary.trim() ||
      !form.body.trim()
    ) {
      setMessage("Completa todos los campos de la noticia.");
      return;
    }

    if (!editingId && form.status === "published" && !form.file) {
      setMessage("Sube una imagen para publicar la noticia.");
      return;
    }

    setSaving(true);
    setMessage(editingId ? "Guardando noticia..." : "Publicando noticia...");

    const body = new FormData();
    body.set("title", form.title.trim());
    body.set("date", form.date);
    body.set("endDate", form.endDate);
    body.set("category", form.category.trim());
    body.set("summary", form.summary.trim());
    body.set("body", form.body.trim());
    body.set("status", form.status);

    if (form.file) {
      body.set("image", form.file);
    }

    try {
      const response = await fetch(
        editingId ? `/api/news?id=${encodeURIComponent(editingId)}` : "/api/news",
        {
          method: editingId ? "PUT" : "POST",
          credentials: "include",
          headers: accessKey ? { "x-news-key": accessKey } : undefined,
          body,
        },
      );
      await parseNewsResponse(response);
      setItems(await fetchNews(accessKey));
      resetForm();
      router.refresh();
      setMessage(editingId ? "Noticia actualizada." : "Noticia publicada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: News) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      endDate: item.endDate,
      category: item.category,
      summary: item.summary,
      body: item.body,
      image: item.image,
      file: null,
      status: item.status ?? "published",
    });
    setFileName("");
    setMessage("Editando noticia.");
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setMessage("Borrando noticia...");

    try {
      const response = await fetch(`/api/news?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-news-key": accessKey } : undefined,
      });
      await parseNewsResponse(response);
      setItems(await fetchNews(accessKey));

      if (editingId === id) {
        resetForm();
      }

      router.refresh();
      setMessage("Noticia borrada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo borrar.");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    setSaving(true);
    setMessage("Restaurando noticias...");

    try {
      const response = await fetch("/api/news?restore=true", {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-news-key": accessKey } : undefined,
      });
      await parseNewsResponse(response);
      setItems(await fetchNews(accessKey));
      resetForm();
      router.refresh();
      setMessage("Noticias restauradas.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {(showList || unlocked) && (
      <div className="mt-12">
        {loading && orderedItems.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
                <div className="skeleton aspect-[16/10]" />
                <div className="space-y-3 p-6">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-7 w-4/5 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NewsGrid
            items={orderedItems}
            canManage={unlocked}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
      )}

      {unlocked && (
      <section
        id="admin-noticias"
        className="glass mobile-card-lift mt-16 scroll-mt-28 rounded-lg border-dashed p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              Panel activo
            </span>
            <h3 className="mt-4 text-xl font-bold">Editar noticias</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Desde el acceso global de administrador puedes publicar, actualizar,
              borrar y restaurar noticias del club.
            </p>
          </div>
          <Upload className="text-accent/50" size={32} aria-hidden="true" />
        </div>

          <form className="mt-8 grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Título
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => {
                  const date = event.target.value;
                  setForm((current) => ({
                    ...current,
                    date,
                    endDate:
                      current.endDate < date
                        ? defaultEndDateFromStart(date)
                        : current.endDate,
                  }));
                }}
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Fecha de fin
              </label>
              <input
                type="date"
                min={form.date}
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, endDate: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
              <p className="mt-2 text-xs leading-relaxed text-muted">
                El día de fin la noticia se elimina automáticamente del sitio.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Categoría
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                placeholder="Cantera, Torneo, Comunidad..."
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Resumen corto
              </label>
              <input
                type="text"
                value={form.summary}
                onChange={(event) =>
                  setForm((current) => ({ ...current, summary: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as "published" | "draft",
                  }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Noticia completa
              </label>
              <textarea
                rows={6}
                value={form.body}
                onChange={(event) =>
                  setForm((current) => ({ ...current, body: event.target.value }))
                }
                className="mt-2 w-full resize-none rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-normal text-muted">
                Imagen
              </label>
              <label className="mt-2 flex min-h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-bg/40 text-center transition-colors hover:border-accent/60 hover:bg-accent/5">
                {form.image ? (
                  <span className="relative block aspect-[16/9] w-full">
                    {form.image.startsWith("blob:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.image}
                        alt="Vista previa de la noticia"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={form.image}
                        alt="Vista previa de la noticia"
                        fill
                        className="object-cover"
                      />
                    )}
                  </span>
                ) : (
                  <>
                    <ImagePlus className="text-muted" size={36} aria-hidden="true" />
                    <span className="mt-3 text-sm font-medium text-text">
                      Seleccionar imagen
                    </span>
                    <span className="mt-1 text-xs text-muted">
                      JPG, PNG, WEBP o SVG
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={saving}
                />
              </label>
              {fileName && <p className="mt-2 text-xs text-muted">{fileName}</p>}
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-[var(--button-text)] transition-colors hover:bg-accent/90"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? "Guardar cambios" : "Publicar noticia"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent"
              >
                <X size={18} aria-hidden="true" />
                Limpiar
              </button>
              <button
                type="button"
                onClick={restoreDefaults}
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent"
              >
                <RotateCcw size={18} aria-hidden="true" />
                Restaurar
              </button>
            </div>
          </form>

        {message && (
          <p className="mt-5 rounded-lg border border-border bg-bg/60 px-4 py-3 text-sm text-muted">
            {message}
          </p>
        )}
      </section>
      )}
    </>
  );
}
