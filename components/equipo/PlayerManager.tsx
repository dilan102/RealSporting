"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { ImagePlus, RotateCcw, Save, Trash2, X } from "lucide-react";
import {
  buildTeamSections,
  getPlayerCategory,
  teamCategories,
  type Player,
  type TeamCategoryId,
} from "@/lib/content";
import { PlayerGrid } from "./PlayerGrid";

type PlayerForm = {
  name: string;
  number: string;
  position: string;
  bio: string;
  category: string;
  convocado: boolean;
  visible_publico: boolean;
  image: string;
  file: File | null;
};

type ApiResponse = {
  error?: string;
  items?: Player[];
};

const emptyForm = (category: TeamCategoryId = "2020-2019"): PlayerForm => ({
  name: "",
  number: "",
  position: "",
  bio: "",
  category: category.split("-")[0],
  convocado: false,
  visible_publico: false,
  image: "",
  file: null,
});

async function parsePlayersResponse(response: Response) {
  const payload = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el jugador.");
  }

  return payload;
}

async function fetchPlayers(accessKey = "") {
  const response = await fetch("/api/players", {
    cache: "no-store",
    credentials: "include",
    headers: accessKey ? { "x-admin-key": accessKey } : undefined,
  });
  const payload = await parsePlayersResponse(response);

  return payload.items || [];
}

function categoryToYear(category: Player["category"]) {
  const detected = getPlayerCategory(category);

  return detected ? detected.split("-")[0] : String(category);
}

export function PlayerManager({ initialItems }: { initialItems: Player[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const formRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<PlayerForm>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
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

    fetchPlayers(accessKey)
      .then((nextItems) => {
        if (active) {
          setItems(nextItems);
        }
      })
      .catch(() => {
        if (active) {
          setMessage("No se pudieron cargar los jugadores guardados.");
        }
      });

    return () => {
      active = false;
    };
  }, [accessKey, session?.user?.isAdmin]);

  useEffect(() => {
    const syncAdminAccess = () => {
      const key = window.sessionStorage.getItem("cdrs-admin-key") || "";
      const githubAdmin = Boolean(session?.user?.isAdmin);

      setAccessKey(key);
      setUnlocked(Boolean(key) || githubAdmin);
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, [session?.user?.isAdmin]);

  useEffect(() => {
    return () => {
      if (form.image.startsWith("blob:")) {
        URL.revokeObjectURL(form.image);
      }
    };
  }, [form.image]);

  const sections = useMemo(() => buildTeamSections(items), [items]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setFormOpen(false);
    setFileName("");
  };

  const revealForm = () => {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      nameInputRef.current?.focus();
    });
  };

  const openCreate = (category: TeamCategoryId) => {
    if (!unlocked) {
      setMessage("Ingresa la clave antes de añadir jugadores.");
      return;
    }

    setForm(emptyForm(category));
    setEditingId(null);
    setFormOpen(true);
    setFileName("");
    setMessage("Añadiendo jugador.");
    revealForm();
  };

  const openEdit = (player: Player) => {
    if (!unlocked) {
      setMessage("Ingresa la clave antes de editar jugadores.");
      return;
    }

    setEditingId(player.id);
    setForm({
      name: player.name,
      number: String(player.number),
      position: player.position,
      bio: player.bio,
      category: categoryToYear(player.category),
      convocado: player.convocado === "SI",
      visible_publico: player.visible_publico !== false,
      image: player.image,
      file: null,
    });
    setFormOpen(true);
    setFileName("");
    setMessage(`Editando ${player.name}.`);
    revealForm();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Selecciona una imagen para la foto del jugador.");
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
    setMessage("Foto cargada en el formulario.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.position.trim() || !form.bio.trim()) {
      setMessage("Completa nombre, posición y descripción.");
      return;
    }

    if (!editingId && !form.file) {
      setMessage("Sube una foto para el jugador.");
      return;
    }

    setSaving(true);
    setMessage(editingId ? "Guardando cambios..." : "Creando jugador...");

    const body = new FormData();
    body.set("name", form.name.trim());
    body.set("number", form.number);
    body.set("position", form.position.trim());
    body.set("bio", form.bio.trim());
    body.set("category", form.category);
    body.set("convocado", form.convocado ? "SI" : "NO");
    body.set("visible_publico", form.visible_publico ? "true" : "false");
    body.set("status", form.visible_publico ? "published" : "draft");

    if (form.file) {
      body.set("image", form.file);
    }

    try {
      const response = await fetch(
        editingId ? `/api/players?id=${encodeURIComponent(editingId)}` : "/api/players",
        {
          method: editingId ? "PUT" : "POST",
          credentials: "include",
          headers: accessKey ? { "x-training-key": accessKey } : undefined,
          body,
        },
      );
      await parsePlayersResponse(response);
      setItems(await fetchPlayers(accessKey));
      resetForm();
      router.refresh();
      setMessage(editingId ? "Jugador actualizado." : "Jugador añadido.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) {
      return;
    }

    setSaving(true);
    setMessage("Borrando jugador...");

    try {
      const response = await fetch(`/api/players?id=${encodeURIComponent(editingId)}`, {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-training-key": accessKey } : undefined,
      });
      await parsePlayersResponse(response);
      setItems(await fetchPlayers(accessKey));
      resetForm();
      router.refresh();
      setMessage("Jugador borrado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo borrar.");
    } finally {
      setSaving(false);
    }
  };

  const restoreDefaults = async () => {
    if (!unlocked) {
      setMessage("Ingresa la clave antes de restaurar jugadores.");
      return;
    }

    setSaving(true);
    setMessage("Restaurando jugadores...");

    try {
      const response = await fetch("/api/players?restore=true", {
        method: "DELETE",
        credentials: "include",
        headers: accessKey ? { "x-admin-key": accessKey } : undefined,
      });
      await parsePlayersResponse(response);
      setItems(await fetchPlayers(accessKey));
      resetForm();
      router.refresh();
      setMessage("Jugadores restaurados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo restaurar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {formOpen && (
        <section ref={formRef} className="glass mobile-card-lift mt-8 scroll-mt-28 rounded-lg p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">
                {editingId ? "Editar jugador" : "Añadir jugador"}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Completa la información deportiva y marca si está convocado.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
              aria-label="Cerrar formulario"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Nombre
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Número
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={form.number}
                onChange={(event) =>
                  setForm((current) => ({ ...current, number: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Posición
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(event) =>
                  setForm((current) => ({ ...current, position: event.target.value }))
                }
                placeholder="Portero, Cierre, Ala, Pivot"
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              >
                {teamCategories.flatMap((category) =>
                  category.split("-").map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )),
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Descripción
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(event) =>
                  setForm((current) => ({ ...current, bio: event.target.value }))
                }
                className="mt-2 w-full resize-none rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            <label className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.convocado}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    convocado: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-[var(--color-accent)]"
              />
              Convocado
            </label>

            <label className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-bg/70 px-4 py-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.visible_publico}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    visible_publico: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-[var(--color-accent)]"
              />
              Visible en el sitio público
            </label>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">
                Foto
              </label>
              <label className="mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-bg/40 text-center transition-colors hover:border-accent/60 hover:bg-accent/5">
                {form.image ? (
                  <span className="relative block aspect-[16/9] w-full">
                    {form.image.startsWith("blob:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.image}
                        alt="Vista previa del jugador"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={form.image}
                        alt="Vista previa del jugador"
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
                <Save size={18} aria-hidden="true" />
                Guardar jugador
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold transition-colors hover:border-red-400/50 hover:text-red-300"
                >
                  <Trash2 size={18} aria-hidden="true" />
                  Borrar
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <div id="admin-equipo" className="mt-8 scroll-mt-28">
        <PlayerGrid
          sections={sections}
          canManage={unlocked}
          onAddPlayer={openCreate}
          onEditPlayer={openEdit}
        />
      </div>

      {unlocked && (
        <section className="glass mobile-card-lift mt-8 rounded-lg p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                Panel activo
              </span>
              <h3 className="mt-4 text-xl font-bold">Administrar jugadores</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                Añade, edita o borra integrantes por categoría desde los controles
                del equipo.
              </p>
            </div>
            <button
              type="button"
              onClick={restoreDefaults}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Restaurar
            </button>
          </div>
        </section>
      )}

      {message && (
        <p className="mt-5 rounded-lg border border-border bg-bg/60 px-4 py-3 text-sm text-muted">
          {message}
        </p>
      )}
    </>
  );
}
