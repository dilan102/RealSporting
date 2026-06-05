"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, RotateCcw, Save, Trophy } from "lucide-react";
import type { TournamentStatus } from "@/lib/tournament-store";

type EditableField = {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
};

type EditableGroup = {
  id: string;
  title: string;
  description: string;
  fields: EditableField[];
};

type OverrideResponse = {
  error?: string;
  items?: Record<string, string>;
};

export type TournamentSectionCopy = {
  status: TournamentStatus;
  title: string;
  description: string;
};

function buildGroups(sections: TournamentSectionCopy[]): EditableGroup[] {
  return [
    {
      id: "hero",
      title: "Encabezado",
      description: "Texto principal de la página.",
      fields: [
        { key: "torneos.hero.eyebrow", label: "Etiqueta", value: "Competencia" },
        { key: "torneos.hero.title", label: "Título", value: "Torneos" },
        {
          key: "torneos.hero.subtitle",
          label: "Subtítulo",
          value: "Programación competitiva, resultados, participaciones y próximos retos del club.",
          multiline: true,
        },
      ],
    },
    ...sections.map((section) => ({
      id: section.status,
      title: section.title,
      description: section.description,
      fields: [
        {
          key: `torneos.sections.${section.status}.title`,
          label: "Título",
          value: section.title,
        },
        {
          key: `torneos.sections.${section.status}.description`,
          label: "Descripción",
          value: section.description,
          multiline: true,
        },
      ],
    })),
    {
      id: "admin",
      title: "Bloque administrador",
      description: "Título que aparece encima del formulario de programación.",
      fields: [
        { key: "torneos.admin.eyebrow", label: "Etiqueta", value: "Administrador" },
        { key: "torneos.admin.title", label: "Título", value: "Subir programación" },
      ],
    },
  ];
}

export function TournamentSectionsManager({
  sections,
  initialValues,
}: {
  sections: TournamentSectionCopy[];
  initialValues: Record<string, string>;
}) {
  const router = useRouter();
  const groups = useMemo(() => buildGroups(sections), [sections]);
  const defaults = useMemo(
    () =>
      groups.reduce<Record<string, string>>((accumulator, group) => {
        group.fields.forEach((field) => {
          accumulator[field.key] = field.value;
        });

        return accumulator;
      }, {}),
    [groups],
  );

  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...defaults,
    ...initialValues,
  }));
  const [accessKey, setAccessKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id || "hero");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues({ ...defaults, ...initialValues });
  }, [defaults, initialValues]);

  useEffect(() => {
    const syncAdminAccess = () => {
      const key = window.sessionStorage.getItem("cdrs-admin-key") || "";
      const role = window.sessionStorage.getItem("cdrs-admin-role");

      setAccessKey(key);
      setUnlocked(Boolean(key) && role === "owner");
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

  const activeGroup = groups.find((group) => group.id === activeGroupId) || groups[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!unlocked) {
      setMessage("Activa el administrador total antes de guardar secciones.");
      return;
    }

    setSaving(true);
    setMessage("Guardando secciones...");

    try {
      const currentResponse = await fetch("/api/content-overrides", {
        cache: "no-store",
        credentials: "include",
      });
      const currentPayload = (await currentResponse.json()) as OverrideResponse;
      const nextItems = { ...(currentPayload.items || {}) };

      Object.entries(values).forEach(([key, value]) => {
        const fallback = defaults[key] || "";
        const trimmed = value.trim();

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
        throw new Error(payload.error || "No se pudieron guardar las secciones.");
      }

      router.refresh();
      setMessage("Secciones actualizadas.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "No se pudieron guardar las secciones.",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetActiveGroup = () => {
    if (!activeGroup) {
      return;
    }

    setValues((current) => {
      const next = { ...current };
      activeGroup.fields.forEach((field) => {
        next[field.key] = defaults[field.key] || "";
      });

      return next;
    });
    setMessage("Sección restaurada en el formulario.");
  };

  if (!unlocked || !activeGroup) {
    return null;
  }

  return (
    <section
      id="admin-secciones-torneos"
      className="glass mobile-card-lift section-shell mt-10 scroll-mt-28 rounded-lg border-dashed p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            <Edit3 size={14} aria-hidden="true" />
            Edición de secciones
          </span>
          <h2 className="mt-4 text-xl font-bold">Textos de la página de torneos</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Ajusta el encabezado, las tarjetas y los títulos de cada bloque competitivo.
          </p>
        </div>
        <Trophy className="text-accent/50" size={32} aria-hidden="true" />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`min-h-10 rounded-lg border px-4 text-sm font-black transition-colors ${
              activeGroupId === group.id
                ? "border-accent bg-accent text-[var(--button-text)]"
                : "border-border bg-bg text-text hover:border-accent"
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
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
            {saving ? "Guardando..." : "Guardar secciones"}
          </button>
          <button
            type="button"
            onClick={resetActiveGroup}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-black text-text transition-colors hover:border-accent"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar sección
          </button>
        </div>
      </form>
    </section>
  );
}
