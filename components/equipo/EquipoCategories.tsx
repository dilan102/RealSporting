"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { sportCategoryCards } from "@/lib/content";
import type { Player, TeamCategoryId, TeamSection } from "@/lib/content";
import { CategoryRosterContent, playersFromSection } from "./CategoryRosterContent";

type EquipoCategoriesProps = {
  sections: TeamSection[];
  canManage?: boolean;
  onAddPlayer?: (category: TeamCategoryId) => void;
  onEditPlayer?: (player: Player) => void;
};

const COACH_SECTION_ID = "entrenadores";

export function EquipoCategories({
  sections,
  canManage = false,
  onAddPlayer,
  onEditPlayer,
}: EquipoCategoriesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sectionById = useMemo(() => {
    return new Map(sections.map((section) => [section.id, section]));
  }, [sections]);

  const coachSection = sectionById.get(COACH_SECTION_ID);
  const coachCount = coachSection ? playersFromSection(coachSection).length : 0;
  const showCoachSection =
    coachSection && (canManage || coachCount > 0);

  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#categoria-(.+)$/);
      if (!match) {
        return;
      }

      const id = decodeURIComponent(match[1]);
      const exists =
        sportCategoryCards.some((category) => category.id === id) ||
        id === COACH_SECTION_ID;

      if (exists) {
        setExpandedId(id);
        window.requestAnimationFrame(() => {
          document
            .getElementById(`categoria-${id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const handleToggle = (id: string) => {
    setExpandedId((current) => {
      const next = current === id ? null : id;
      if (next) {
        window.history.replaceState(null, "", `#categoria-${next}`);
      } else {
        window.history.replaceState(null, "", window.location.pathname);
      }
      return next;
    });
  };

  return (
    <div className="grid gap-8">
      {sportCategoryCards.map((category) => {
        const section = sectionById.get(category.id);
        const isExpanded = expandedId === category.id;
        const playerCount = section ? playersFromSection(section).length : 0;

        return (
          <article
            key={category.id}
            id={`categoria-${category.id}`}
            className="category-anchor-target scroll-mt-32 overflow-hidden border-t border-border pt-8 first:border-t-0 first:pt-0"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-stretch">
              <button
                type="button"
                className="group relative min-h-[320px] overflow-hidden rounded-lg border border-border bg-surface text-left"
                onClick={() => handleToggle(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`roster-${category.id}`}
              >
                <Image
                  src={category.image}
                  alt={`Entrenamiento categoría ${category.name} (${category.range})`}
                  fill
                  className="interactive-image object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  sizes="(min-width: 1024px) 44vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.72))]" />
                <span className="absolute left-4 top-4 rounded-lg border border-white/20 bg-black/40 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur">
                  {category.ages}
                </span>
                <span className="absolute bottom-4 left-4 right-4">
                  <span className="block font-categories text-5xl font-black leading-none text-white sm:text-6xl">
                    {category.name}
                  </span>
                  <span className="mt-2 block text-xs font-black uppercase tracking-normal text-white/72">
                    Nacidos {category.range} · {playerCount} integrantes
                  </span>
                </span>
              </button>

              <div className="flex flex-col justify-between rounded-lg border border-border bg-bg-elevated p-5 sm:p-6">
                <div>
                  <p className="eyebrow">Categoría formativa</p>
                  <h3 className="font-categories mt-3 text-4xl font-black leading-none sm:text-5xl">
                    {category.name}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-muted">{category.description}</p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-3">
                    {category.objectives.map((objective) => (
                      <span
                        key={objective}
                        className="rounded-lg border border-border bg-bg px-3 py-3 text-sm font-bold text-text"
                      >
                        {objective}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(category.id)}
                    className="alive-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent/45 bg-accent/10 px-4 text-sm font-black text-accent hover:bg-accent hover:text-[var(--button-text)]"
                  >
                    {isExpanded ? "Ocultar convocados" : "Ver convocados"}
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <Link
                    href="/formulario-miembros-2026"
                    className="btn-gold alive-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black"
                  >
                    Inscripción
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div
              id={`roster-${category.id}`}
              className={`grid transition-all duration-300 ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {section ? (
                  <CategoryRosterContent
                    section={section}
                    canManage={canManage}
                    onAddPlayer={onAddPlayer}
                    onEditPlayer={onEditPlayer}
                  />
                ) : (
                  <div className="border-t border-border p-4 sm:p-5">
                    <p className="rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
                      Jugadores en proceso de registro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      {showCoachSection && coachSection && (
        <article
          id={`categoria-${COACH_SECTION_ID}`}
          className={`category-anchor-target alive-card premium-card scroll-mt-32 overflow-hidden sm:col-span-2 ${
            expandedId === COACH_SECTION_ID ? "" : ""
          }`}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 border-b border-border bg-bg-elevated/60 px-5 py-5 text-left transition-colors hover:bg-bg-elevated sm:px-6"
            onClick={() => handleToggle(COACH_SECTION_ID)}
            aria-expanded={expandedId === COACH_SECTION_ID}
            aria-controls={`roster-${COACH_SECTION_ID}`}
          >
            <div>
              <h3 className="text-2xl font-bold text-text">Cuerpo técnico</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-muted">
                {coachCount} integrantes
              </p>
            </div>
            <ChevronDown
              size={22}
              className={`text-muted transition-transform duration-300 ${
                expandedId === COACH_SECTION_ID ? "rotate-180 text-accent" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            id={`roster-${COACH_SECTION_ID}`}
            className={`grid transition-all duration-300 ${
              expandedId === COACH_SECTION_ID
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <CategoryRosterContent
                section={coachSection}
                canManage={canManage}
                onAddPlayer={onAddPlayer}
                onEditPlayer={onEditPlayer}
              />
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
