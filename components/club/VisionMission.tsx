"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  Eye,
  Flag,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { club } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";

const cards = [
  {
    icon: Target,
    title: "Misión",
    text: club.mission,
    image: "/logo.png",
  },
  {
    icon: Eye,
    title: "Visión",
    text: club.vision,
    image: "/balon.png",
  },
];

const valueIcons = [ShieldCheck, Users, Target, HeartHandshake, Flag];

export function VisionMission() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map(({ icon: Icon, title, text, image }, index) => (
        <motion.article
          key={title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
          className="mobile-card-lift overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors duration-300 hover:border-accent/40"
        >
          <div className="relative aspect-[16/9] bg-surface">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-lg bg-accent text-[var(--button-text)]">
              <Icon size={22} aria-hidden="true" />
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function ValuesGrid() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {club.values.slice(0, 4).map((value, index) => {
        const Icon = valueIcons[index] || Flag;

        return (
          <motion.article
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
            className="mobile-card-lift group relative overflow-hidden rounded-lg border border-border bg-bg-elevated p-7 transition-all duration-300 hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent-green)_9%,var(--card-bg))]"
          >
            <span className="pointer-events-none absolute right-5 top-3 font-display text-7xl leading-none text-[color-mix(in_srgb,var(--accent-gold)_20%,transparent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mb-6 grid size-14 place-items-center rounded-lg bg-accent/15 text-accent">
              <Icon size={44} aria-hidden="true" strokeWidth={1.6} />
            </div>
            <h3 className="relative text-3xl font-black">{value.title}</h3>
            <p className="relative mt-3 text-sm leading-7 text-muted">{value.description}</p>
          </motion.article>
        );
      })}
    </div>
  );
}

export function Timeline() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {club.milestones.map((m, index) => (
        <motion.li
          key={`${m.year}-${m.event}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.4, ease: PRELOADER_EASE }}
          className="mobile-card-lift rounded-lg border border-border bg-bg-elevated p-5"
        >
          <p className="text-sm font-black text-accent">{m.year}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{m.event}</p>
        </motion.li>
      ))}
    </ol>
  );
}

const odsItems = [
  {
    id: "ods-3",
    code: "ODS 3",
    title: "Salud y Bienestar",
    shortText: "Salud física, mental y apoyo psicológico en el proceso formativo.",
    detail:
      "Promover la salud física y mental de los participantes a través de actividades deportivas, educación para la salud y apoyo psicológico.",
  },
  {
    id: "ods-4",
    code: "ODS 4",
    title: "Educación de Calidad",
    shortText: "Formación integral con habilidades para la vida y valores.",
    detail:
      "Proporcionar desarrollo integral incluyendo habilidades para la vida, educación en valores y entrenamiento deportivo.",
  },
  {
    id: "ods-5",
    code: "ODS 5",
    title: "Igualdad de Género",
    shortText: "Acceso igualitario a oportunidades deportivas para todos los géneros.",
    detail:
      "Asegurar igualdad de acceso a oportunidades deportivas para niños, niñas y adolescentes de todos los géneros.",
  },
  {
    id: "ods-10",
    code: "ODS 10",
    title: "Reducción de Desigualdades",
    shortText: "Inclusión social y no discriminación para poblaciones diversas.",
    detail:
      "Promover inclusión social y no discriminación ofreciendo oportunidades a poblaciones diversas incluyendo víctimas del conflicto armado.",
  },
  {
    id: "ods-11",
    code: "ODS 11",
    title: "Ciudades y Comunidades Sostenibles",
    shortText: "Alianzas comunitarias para fortalecer tejido social local.",
    detail:
      "Fortalecer lazos con la comunidad local a través de alianzas con organizaciones, escuelas y entidades gubernamentales.",
  },
  {
    id: "ods-16",
    code: "ODS 16",
    title: "Paz, Justicia e Instituciones Sólidas",
    shortText: "Fútbol como herramienta de diálogo, tolerancia y paz.",
    detail:
      "Utilizar el fútbol para promover el diálogo, la tolerancia y una cultura de paz entre comunidades afectadas por el conflicto.",
  },
];

export function OdsCommitment() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {odsItems.map((item, index) => {
        const open = expanded === item.id;

        return (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.4, ease: PRELOADER_EASE }}
            className={`group overflow-hidden rounded-lg border bg-bg-elevated/95 transition-all duration-300 ${
              open
                ? "border-accent shadow-xl shadow-[var(--accent-gold)]/15"
                : "border-border hover:-translate-y-0.5 hover:border-accent/45"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : item.id)}
              className="w-full px-5 py-5 text-left sm:px-6"
              aria-expanded={open}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                    {item.code}
                  </p>
                  <h3 className="mt-2 text-xl font-black leading-tight">{item.title}</h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`mt-1 shrink-0 text-muted transition-transform duration-300 ${
                    open ? "rotate-180 text-accent" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted transition-all duration-300 group-hover:text-text">
                {item.shortText}
              </p>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden border-t border-border px-5 sm:px-6">
                <p className="py-4 text-sm leading-7 text-muted">{item.detail}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
