"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  KeyRound,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react";
import type { News } from "@/lib/content";
import { NewsGrid } from "./NewsGrid";

const ACCESS_KEY = "RealSporting1985";

type NewsForm = {
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string;
  image: string;
  file: File | null;
};

type ApiResponse = {
  error?: string;
  items?: News[];
};

const emptyForm = (): NewsForm => ({
  title: "",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  summary: "",
  body: "",
  image: "",
  file: null,
});

async function parseNewsResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar la noticia.");
  }

  return payload;
}

async function fetchNews() {
  const response = await fetch("/api/news", { cache: "no-store" });
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
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    let active = true;

    fetchNews()
      .then((nextItems) => {
        if (active && nextItems.length > 0) {
          setItems(nextItems);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar las noticias guardadas.");
        }
      });

    return () => {
      active = false;
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

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ACCESS_KEY) {
      setAccessKey(password);
      setUnlocked(true);
      setPassword("");
      setMessage("Panel desbloqueado. Ya puedes editar las noticias.");
      return;
    }

    setMessage("Clave incorrecta.");
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
      !form.category.trim() ||
      !form.summary.trim() ||
      !form.body.trim()
    ) {
      setMessage("Completa todos los campos de la noticia.");
      return;
    }

    if (!editingId && !form.file) {
      setMessage("Sube una imagen para publicar la noticia.");
      return;
    }

    setSaving(true);
    setMessage(editingId ? "Guardando noticia..." : "Publicando noticia...");

    const body = new FormData();
    body.set("title", form.title.trim());
    body.set("date", form.date);
    body.set("category", form.category.trim());
    body.set("summary", form.summary.trim());
    body.set("body", form.body.trim());

    if (form.file) {
      body.set("image", form.file);
    }

    try {
      const response = await fetch(
        editingId ? `/api/news?id=${encodeURIComponent(editingId)}` : "/api/news",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "x-news-key": accessKey },
          body,
        },
      );
      await parseNewsResponse(response);
      setItems(await fetchNews());
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
      category: item.category,
      summary: item.summary,
      body: item.body,
      image: item.image,
      file: null,
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
        headers: { "x-news-key": accessKey },
      });
      await parseNewsResponse(response);
      setItems(await fetchNews());

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
        headers: { "x-news-key": accessKey },
      });
      await parseNewsResponse(response);
      setItems(await fetchNews());
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
        <NewsGrid
          items={orderedItems}
          canManage={unlocked}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      )}

      <section className="glass mt-16 rounded-lg border-dashed p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              {unlocked ? (
                <>
                  <KeyRound size={14} aria-hidden="true" />
                  Panel activo
                </>
              ) : (
                <>
                  <Lock size={14} aria-hidden="true" />
                  Clave requerida
                </>
              )}
            </span>
            <h3 className="mt-4 text-xl font-bold">Editar noticias</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Con la clave puedes publicar, actualizar, borrar y restaurar noticias
              del club. Lo que guardes aparece también en los círculos del inicio.
            </p>
          </div>
          <Upload className="text-accent/50" size={32} aria-hidden="true" />
        </div>

        {!unlocked && (
          <form
            className="mt-8 flex flex-col gap-3 sm:max-w-md sm:flex-row"
            onSubmit={handleUnlock}
          >
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Clave de acceso"
              className="min-h-12 flex-1 rounded-lg border border-border bg-bg/70 px-4 text-sm outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-bg transition-colors hover:bg-accent/90"
            >
              <KeyRound size={18} aria-hidden="true" />
              Desbloquear
            </button>
          </form>
        )}

        {unlocked && (
          <form className="mt-8 grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
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
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Fecha
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
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
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
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
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
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
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-bg transition-colors hover:bg-accent/90"
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
        )}

        {message && (
          <p className="mt-5 rounded-lg border border-border bg-bg/60 px-4 py-3 text-sm text-muted">
            {message}
          </p>
        )}
      </section>
    </>
  );
}
