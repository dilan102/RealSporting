import Image from "next/image";
import { CalendarDays, MapPin, Shield, Trophy } from "lucide-react";
import type { Tournament } from "@/lib/tournament-store";
import { formatPublicationRange } from "@/lib/publication-dates";

const statusLabel: Record<Tournament["status"], string> = {
  played: "Torneo jugado",
  won: "Torneo ganado",
  future: "Torneo por jugar",
};

export function TournamentCard({
  item,
  canManage = false,
  onEdit,
  onDelete,
}: {
  item: Tournament;
  canManage?: boolean;
  onEdit?: (item: Tournament) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <article className="alive-card group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm">
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
          <Trophy size={14} aria-hidden="true" />
          {statusLabel[item.status]}
        </span>
        {item.visibility === "draft" && (
          <span className="absolute right-4 top-4 rounded-lg bg-accent px-3 py-1 text-xs font-black text-[var(--button-text)]">
            Borrador
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-muted">
          <CalendarDays size={15} aria-hidden="true" />
          {formatPublicationRange(item.startDate, item.endDate)}
        </p>
        <h3 className="font-stadium mt-3 text-3xl font-black leading-none">{item.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{item.description}</p>

        <div className="mt-4 grid gap-2 text-sm font-semibold text-text">
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
          <div className="mt-4 rounded-lg border border-border bg-bg/70 p-3">
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Programación
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{item.schedule}</p>
          </div>
        )}

        {canManage && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="rounded-lg border border-border px-4 py-2 text-xs font-black text-text transition-colors hover:border-accent"
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
