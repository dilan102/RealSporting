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
  Video,
  X,
} from "lucide-react";
import type { Training } from "@/lib/content";
import { TrainingGrid } from "./TrainingGrid";

const ACCESS_KEY = "RealSporting1985";

type TrainingForm = {
  title: string;
  date: string;
  description: string;
  images: string[];
  files: File[];
  videos: string[];
  videoFiles: File[];
};

const emptyForm = (): TrainingForm => ({
  title: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  images: [],
  files: [],
  videos: [],
  videoFiles: [],
});

type ApiResponse = {
  error?: string;
  items?: Training[];
};

async function parseTrainingResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el entrenamiento.");
  }

  return payload;
}

async function fetchTrainings() {
  const response = await fetch("/api/trainings", { cache: "no-store" });
  const payload = await parseTrainingResponse(response);

  return payload.items || [];
}

export function TrainingManager({ initialItems }: { initialItems: Training[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<TrainingForm>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    let active = true;

    fetchTrainings()
      .then((nextItems) => {
        if (active && nextItems.length > 0) {
          setItems(nextItems);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar los entrenamientos guardados.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  );

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setFileName("");
    setVideoFileName("");
  };

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ACCESS_KEY) {
      setAccessKey(password);
      setUnlocked(true);
      setPassword("");
      setMessage("Panel desbloqueado. Ya puedes subir y editar entrenamientos.");
      return;
    }

    setMessage("Clave incorrecta.");
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      setMessage("Selecciona solo imágenes para el entrenamiento.");
      return;
    }

    try {
      const images = selectedFiles.map((file) => URL.createObjectURL(file));
      setForm((current) => {
        return {
          ...current,
          files: [...current.files, ...selectedFiles],
          images: [...current.images, ...images],
        };
      });
      setFileName(selectedFiles.map((file) => file.name).join(", "));
      setMessage(
        selectedFiles.length === 1
          ? "Imagen agregada al formulario."
          : "Imágenes agregadas al formulario.",
      );
    } catch {
      setMessage("No se pudieron leer las imágenes. Intenta con otros archivos.");
    }
  };

  const handleVideoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.some((file) => !file.type.startsWith("video/"))) {
      setMessage("Selecciona solo videos para el entrenamiento.");
      return;
    }

    try {
      const videos = selectedFiles.map((file) => URL.createObjectURL(file));
      setForm((current) => ({
        ...current,
        videoFiles: [...current.videoFiles, ...selectedFiles],
        videos: [...current.videos, ...videos],
      }));
      setVideoFileName(selectedFiles.map((file) => file.name).join(", "));
      setMessage(
        selectedFiles.length === 1
          ? "Video agregado al formulario."
          : "Videos agregados al formulario.",
      );
    } catch {
      setMessage("No se pudieron leer los videos. Intenta con otros archivos.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!unlocked) {
      setMessage("Ingresa la clave antes de subir o editar.");
      return;
    }

    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setMessage("Completa título, fecha y descripción.");
      return;
    }

    if (!editingId && form.files.length === 0 && form.videoFiles.length === 0) {
      setMessage("Sube al menos una foto o un video para el entrenamiento.");
      return;
    }

    setSaving(true);
    setMessage(editingId ? "Guardando cambios..." : "Publicando entrenamiento...");

    const body = new FormData();
    body.set("title", form.title.trim());
    body.set("date", form.date);
    body.set("description", form.description.trim());

    form.files.forEach((file) => {
      body.append("images", file);
    });
    form.videoFiles.forEach((file) => {
      body.append("videos", file);
    });

    if (editingId) {
      body.set("appendImages", "true");
    }

    try {
      const response = await fetch(
        editingId ? `/api/trainings?id=${encodeURIComponent(editingId)}` : "/api/trainings",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "x-training-key": accessKey },
          body,
        },
      );
      await parseTrainingResponse(response);
      setItems(await fetchTrainings());

      resetForm();
      router.refresh();
      setMessage(editingId ? "Entrenamiento actualizado." : "Entrenamiento publicado.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el entrenamiento.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (training: Training) => {
    setEditingId(training.id);
    setForm({
      title: training.title,
      date: training.date,
      description: training.description,
      images:
        training.images && training.images.length > 0
          ? training.images
          : training.image
            ? [training.image]
            : [],
      files: [],
      videos: training.videos || [],
      videoFiles: [],
    });
    setFileName("");
    setVideoFileName("");
    setMessage("Editando entrenamiento.");
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    setMessage("Borrando entrenamiento...");

    try {
      const response = await fetch(`/api/trainings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-training-key": accessKey },
      });
      await parseTrainingResponse(response);
      setItems(await fetchTrainings());

      if (editingId === id) {
        resetForm();
      }

      router.refresh();
      setMessage("Entrenamiento borrado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo borrar.");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    setSaving(true);
    setMessage("Restaurando entrenamientos...");

    try {
      const response = await fetch("/api/trainings?restore=true", {
        method: "DELETE",
        headers: { "x-training-key": accessKey },
      });
      await parseTrainingResponse(response);
      setItems(await fetchTrainings());

      resetForm();
      router.refresh();
      setMessage("Entrenamientos restaurados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mt-12">
        <TrainingGrid
          items={orderedItems}
          canManage={unlocked}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <section className="glass mobile-card-lift mt-16 rounded-lg border-dashed p-6 sm:p-8">
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
            <h3 className="mt-4 text-xl font-bold">Subir entrenamientos</h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Agrega fotos, videos, fechas y descripciones. También puedes editar o borrar
              cualquier entrenamiento cuando el panel esté desbloqueado.
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
                Título del entrenamiento
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Ej. Sesión técnica de definición"
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
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Descripción
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe los ejercicios, objetivos y resultados de la sesión..."
                className="mt-2 w-full resize-none rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Fotografías
              </label>
              <label className="mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-bg/40 text-center transition-colors hover:border-accent/60 hover:bg-accent/5">
                {form.images.length > 0 ? (
                  <span className="grid w-full grid-cols-2 gap-2 p-2 sm:grid-cols-3">
                    {form.images.map((image, index) => (
                      <span
                        key={`${image}-${index}`}
                        className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-bg"
                      >
                        {image.startsWith("blob:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={`Vista previa ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={image}
                            alt={`Vista previa ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </span>
                    ))}
                  </span>
                ) : (
                  <>
                    <ImagePlus className="text-muted" size={36} aria-hidden="true" />
                    <span className="mt-3 text-sm font-medium text-text">
                      Seleccionar imágenes
                    </span>
                    <span className="mt-1 text-xs text-muted">
                      Puedes subir varias fotos en JPG, PNG, WEBP o SVG
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={saving}
                />
              </label>
              {fileName && (
                <p className="mt-2 text-xs text-muted">
                  Nuevas imágenes: {fileName}
                </p>
              )}
              {editingId && (
                <p className="mt-2 text-xs text-muted">
                  Al editar, las imágenes nuevas se agregan a la galería existente.
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Videos
              </label>
              <label className="mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-bg/40 text-center transition-colors hover:border-accent/60 hover:bg-accent/5">
                {form.videos.length > 0 ? (
                  <span className="grid w-full grid-cols-1 gap-2 p-2 sm:grid-cols-2">
                    {form.videos.map((video, index) => (
                      <span
                        key={`${video}-${index}`}
                        className="relative block aspect-video overflow-hidden rounded-lg bg-black"
                      >
                        <video
                          src={video}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <span className="absolute bottom-2 left-2 rounded-lg bg-bg/80 px-2 py-1 text-xs font-semibold text-text backdrop-blur">
                          Video {index + 1}
                        </span>
                      </span>
                    ))}
                  </span>
                ) : (
                  <>
                    <Video className="text-muted" size={36} aria-hidden="true" />
                    <span className="mt-3 text-sm font-medium text-text">
                      Seleccionar videos
                    </span>
                    <span className="mt-1 text-xs text-muted">
                      Puedes subir MP4, WEBM o MOV
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  multiple
                  className="sr-only"
                  onChange={handleVideoChange}
                  disabled={saving}
                />
              </label>
              {videoFileName && (
                <p className="mt-2 text-xs text-muted">
                  Nuevos videos: {videoFileName}
                </p>
              )}
              {editingId && (
                <p className="mt-2 text-xs text-muted">
                  Al editar, los videos nuevos se agregan a la galería existente.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-bold text-bg transition-colors hover:bg-accent/90"
              >
                {editingId ? (
                  <>
                    <Save size={18} aria-hidden="true" />
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <Plus size={18} aria-hidden="true" />
                    Publicar entrenamiento
                  </>
                )}
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
