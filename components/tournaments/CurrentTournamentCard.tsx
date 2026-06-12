"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Shield, UsersRound, Zap } from "lucide-react";
import type { CurrentTournament } from "@/lib/current-tournament-store";
import { formatPublicationRange } from "@/lib/publication-dates";

export function CurrentTournamentCard({
  item,
  canManage = false,
  onEdit,
  onDelete,
}: {
  item: CurrentTournament;
  canManage?: boolean;
  onEdit?: (item: CurrentTournament) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <article className="alive-card group overflow-hidden rounded-lg border-2 border-accent bg-bg-elevated shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="interactive-image object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="image-card-overlay absolute inset-0" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/45 px-3 py-1 text-xs font-black uppercase tracking-normal text-white backdrop-blur">
          <Zap size={14} aria-hidden="true" className="text-yellow-400" />
          En juego
        </span>
        {item.visibility === "draft" && (
          <span className="absolute right-4 top-4 rounded-lg bg-accent px-3 py-1 text-xs font-black text-[var(--button-text)]">
            Borrador
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-accent animate-pulse"></span>
          <p className="text-xs font-bold uppercase tracking-normal text-accent">
            Torneo actual
          </p>
        </div>

        <h3 className="font-stadium mt-3 text-4xl font-black leading-none text-accent">
          {item.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{item.description}</p>

        <div className="mt-5 grid gap-3 text-sm font-semibold text-text">
          <span className="flex items-center gap-2">
            <CalendarDays size={16} className="text-accent" aria-hidden="true" />
            {formatPublicationRange(item.startDate, item.endDate)}
          </span>
          <span className="flex items-center gap-2">
            <Shield size={16} className="text-accent" aria-hidden="true" />
            {item.category}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-accent" aria-hidden="true" />
            {item.venue}
          </span>
          {item.opponent && <span className="text-muted">Rival: {item.opponent}</span>}
        </div>

        {item.schedule && (
          <div className="mt-5 rounded-lg border border-accent/30 bg-accent/5 p-3">
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Programación
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{item.schedule}</p>
          </div>
        )}

        {item.images.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-normal text-muted mb-3">
              Galería ({item.images.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {item.images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={img}
                    alt={`Galería ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/equipo#categoria-${encodeURIComponent(item.category)}`}
          className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-accent/35 bg-accent/10 px-4 text-xs font-black text-accent transition-colors hover:bg-accent hover:text-[var(--button-text)]"
        >
          <UsersRound size={15} aria-hidden="true" />
          Ver convocados de {item.category || "la categoría"}
        </Link>

        {canManage && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="rounded-lg border border-accent bg-accent/10 px-4 py-2 text-xs font-black text-accent transition-colors hover:bg-accent/20"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="rounded-lg border border-red-500/35 px-4 py-2 text-xs font-black text-red-600 transition-colors hover:bg-red-500/10"
            >
              Borrar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
