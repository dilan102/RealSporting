"use client";

import { ImagePlus, Upload } from "lucide-react";

export function UploadMock() {
  return (
    <section className="glass mt-16 rounded-lg border-dashed p-8 sm:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded-lg bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            Demo — subida real en fase 2
          </span>
          <h3 className="mt-4 text-xl font-bold">Registrar entrenamiento</h3>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Formulario de vista previa. En la siguiente fase se habilitará la
            carga de fotos y descripciones con almacenamiento persistente.
          </p>
        </div>
        <Upload className="text-accent/50" size={32} />
      </div>

      <form className="mt-8 grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-xs font-medium uppercase tracking-normal text-muted">
            Título del entrenamiento
          </label>
          <input
            type="text"
            disabled
            placeholder="Ej. Sesión técnica de definición"
            className="mt-2 w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm opacity-60"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-normal text-muted">
            Fecha
          </label>
          <input
            type="date"
            disabled
            className="mt-2 w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-normal text-muted">
            Descripción
          </label>
          <textarea
            disabled
            rows={4}
            placeholder="Describe los ejercicios, objetivos y resultados de la sesión..."
            className="mt-2 w-full resize-none rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-normal text-muted">
            Fotografía
          </label>
          <div className="mt-2 flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg/30 opacity-60">
            <ImagePlus className="text-muted" size={32} />
            <p className="mt-2 text-sm text-muted">
              Arrastra una imagen o haz clic para seleccionar
            </p>
          </div>
        </div>
        <div className="sm:col-span-2">
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-accent/30 px-6 py-3 text-sm font-semibold text-black/70 sm:w-auto"
          >
            Publicar entrenamiento (próximamente)
          </button>
        </div>
      </form>
    </section>
  );
}
