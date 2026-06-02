"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <div className="grid gap-4 sm:grid-cols-2">
      {sportCategoryCards.map((category) => {
        const section = sectionById.get(category.id);
        const isExpanded = expandedId === category.id;
        const playerCount = section ? playersFromSection(section).length : 0;

        return (
          <article
            key={category.id}
            id={`categoria-${category.id}`}
            className={`category-anchor-target alive-card premium-card scroll-mt-32 overflow-hidden transition-[grid-column] ${
              isExpanded ? "sm:col-span-2" : ""
            }`}
          >
            <button
              type="button"
              className="group block w-full text-left"
              onClick={() => handleToggle(category.id)}
              aria-expanded={isExpanded}
              aria-controls={`roster-${category.id}`}
            >
              <div className="relative aspect-[16/9] bg-surface">
                <Image
                  src={category.image}
                  alt={`Categoría ${category.name} (${category.range})`}
                  fill
                  className="interactive-image object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="cinematic-accent absolute bottom-3 left-4 text-xs font-black uppercase tracking-normal">
                  {category.range}
                </p>
                <span className="absolute right-3 top-3 rounded-md bg-bg/80 px-2 py-1 text-xs font-bold text-text backdrop-blur-sm">
                  {playerCount} integrantes
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-categories text-3xl font-black leading-none">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-normal text-accent">
                    {isExpanded ? "Ocultar plantilla" : "Ver plantilla y convocatorias"}
                  </p>
                </div>
                <ChevronDown
                  size={22}
                  className={`mt-1 shrink-0 text-muted transition-transform duration-300 ${
                    isExpanded ? "rotate-180 text-accent" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>

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
