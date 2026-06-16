"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof sportCategoryCards[number] | null>(null);
  const [selectedSection, setSelectedSection] = useState<TeamSection | null>(null);
  const [mounted, setMounted] = useState(false);

  const sectionById = useMemo(() => {
    return new Map(sections.map((section) => [section.id, section]));
  }, [sections]);

  const coachSection = sectionById.get(COACH_SECTION_ID);
  const coachCount = coachSection ? playersFromSection(coachSection).length : 0;
  const showCoachSection =
    coachSection && (canManage || coachCount > 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modalOpen]);

  const handleOpenModal = (category: typeof sportCategoryCards[number]) => {
    const section = sectionById.get(category.id);
    setSelectedCategory(category);
    setSelectedSection(section || null);
    setModalOpen(true);
  };

  const handleOpenCoachModal = () => {
    setSelectedCategory(null);
    setSelectedSection(coachSection || null);
    setModalOpen(true);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[9999] grid min-h-[100dvh] place-items-center overflow-y-auto bg-black/72 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar modal"
        onClick={() => setModalOpen(false)}
      />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="light-panel relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-border bg-bg-elevated p-4 text-text shadow-2xl sm:max-h-[calc(100dvh-4rem)] sm:p-6">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-bg text-text shadow-lg backdrop-blur-md hover:border-accent hover:text-accent"
            aria-label="Cerrar modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
          {selectedCategory && (
            <div className="mb-4">
              <h2 className="font-categories text-3xl font-black leading-none">
                {selectedCategory.name}
              </h2>
              <p className="mt-2 text-sm text-muted">{selectedCategory.description}</p>
            </div>
          )}
          {!selectedCategory && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-text">Cuerpo técnico</h2>
            </div>
          )}
          {selectedSection ? (
            <CategoryRosterContent
              section={selectedSection}
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
    </div>
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {sportCategoryCards.map((category) => {
          const section = sectionById.get(category.id);
          const playerCount = section ? playersFromSection(section).length : 0;

          return (
            <article
              key={category.id}
              id={`categoria-${category.id}`}
              className="category-anchor-target alive-card premium-card scroll-mt-32 overflow-hidden"
            >
              <button
                type="button"
                className="group block w-full text-left"
                onClick={() => handleOpenModal(category)}
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
                      Ver plantilla y convocatorias
                    </p>
                  </div>
                  <ChevronDown
                    size={22}
                    className="mt-1 shrink-0 text-muted transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </article>
          );
        })}

        {showCoachSection && coachSection && (
          <article
            id={`categoria-${COACH_SECTION_ID}`}
            className="category-anchor-target alive-card premium-card scroll-mt-32 overflow-hidden sm:col-span-2"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 border-b border-border bg-bg-elevated/60 px-5 py-5 text-left transition-colors hover:bg-bg-elevated sm:px-6"
              onClick={handleOpenCoachModal}
            >
              <div>
                <h3 className="text-2xl font-bold text-text">Cuerpo técnico</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-muted">
                  {coachCount} integrantes
                </p>
              </div>
              <ChevronDown
                size={22}
                className="text-muted transition-transform duration-300"
                aria-hidden="true"
              />
            </button>
          </article>
        )}
      </div>

      {mounted && modalOpen ? createPortal(modal, document.body) : null}
    </>
  );
}
