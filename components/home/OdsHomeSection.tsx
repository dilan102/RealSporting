"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { OdsItem } from "@/lib/content";
import { odsItems } from "@/lib/content";
import { OdsFlipCard } from "@/components/club/OdsFlipCard";
import { OdsInfographicModal } from "@/components/club/OdsInfographicModal";

export function OdsHomeSection() {
  const [infographicItem, setInfographicItem] = useState<OdsItem | null>(null);

  return (
    <>
      <section className="section-ambient bg-bg text-text">
        <div className="section-shell section-padding">
          <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.32fr)]">
            <div>
              <p className="eyebrow">Impacto social</p>
              <h2 className="font-social-impact kinetic-heading mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-5xl">
                El fútbol como herramienta de salud, educación, inclusión y paz.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-muted sm:text-base">
                Toca un ODS para voltear la tarjeta, leer más detalle y abrir la infografía del
                club.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {odsItems.map((item) => (
                <OdsFlipCard
                  key={item.id}
                  item={item}
                  variant="home"
                  onOpenInfographic={setInfographicItem}
                />
              ))}
              <Link
                href="/club#compromiso-ods"
                className="btn-green alive-lift alive-card premium-card-hover flex min-h-[4.75rem] items-center justify-center gap-3 rounded-lg px-5 py-4 text-center sm:col-span-2"
              >
                <span className="font-social-impact max-w-2xl text-balance text-base font-black leading-snug sm:text-lg">
                  Conoce los ODS (objetivos de desarrollo sostenible)
                </span>
                <ArrowRight size={20} className="shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <OdsInfographicModal
        item={infographicItem}
        onClose={() => setInfographicItem(null)}
      />
    </>
  );
}
