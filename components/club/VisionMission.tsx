"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
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
    image: "/brand/gallery-team.jpg",
  },
  {
    icon: Eye,
    title: "Visión",
    text: club.vision,
    image: "/brand/hero-training.jpg",
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
          className="alive-card mobile-card-lift group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors duration-300 hover:border-accent/40"
        >
          <div className="relative aspect-[16/9] bg-surface">
            <Image
              src={image}
              alt={title}
              fill
              className="interactive-image object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-lg bg-accent text-[var(--button-text)]">
              <Icon size={22} aria-hidden="true" />
            </span>
          </div>
          <div className="p-6">
            <h3 className="font-institutional text-3xl font-black">{title}</h3>
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
      {club.values.map((value, index) => {
        const Icon = valueIcons[index] || Flag;

        return (
          <motion.article
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
            className="alive-card mobile-card-lift group relative overflow-hidden rounded-lg border border-border bg-bg-elevated p-7 transition-all duration-300 hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent-green)_9%,var(--card-bg))]"
          >
            <span className="pointer-events-none absolute right-5 top-3 font-display text-7xl leading-none text-[color-mix(in_srgb,var(--accent-gold)_20%,transparent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mb-6 grid size-14 place-items-center rounded-lg bg-accent/15 text-accent">
              <Icon size={44} aria-hidden="true" strokeWidth={1.6} />
            </div>
            <h3 className="font-social-impact relative text-3xl font-black">{value.title}</h3>
            <p className="relative mt-3 text-sm leading-7 text-muted">{value.description}</p>
          </motion.article>
        );
      })}
    </div>
  );
}

export function Timeline() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastIndex = club.milestones.length - 1;

  return (
    <div className="relative">
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-[1.35rem] top-0 w-0.5 origin-top rounded-full bg-[color-mix(in_srgb,var(--accent-green)_35%,var(--border))]"
        initial={{ scaleY: reducedMotion ? 1 : 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: reducedMotion ? 0.1 : 1, ease: PRELOADER_EASE }}
      />

      <ol className="space-y-5 sm:space-y-6">
        {club.milestones.map((milestone, index) => {
          const isActive = activeIndex === index;
          const isLatest = index === lastIndex;

          return (
            <motion.li
              key={`${milestone.period}-${milestone.title}`}
              initial={{ opacity: 0, x: reducedMotion ? 0 : -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: reducedMotion ? 0 : index * 0.12,
                duration: 0.45,
                ease: PRELOADER_EASE,
              }}
              className="relative pl-12 sm:pl-14"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            >
              <motion.span
                aria-hidden="true"
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isActive || isLatest
                    ? "var(--accent-gold)"
                    : "var(--bg-elevated)",
                  borderColor: isActive || isLatest
                    ? "var(--accent-gold)"
                    : "var(--accent-green)",
                }}
                transition={{ duration: 0.25, ease: PRELOADER_EASE }}
                className="absolute left-0 top-5 z-10 size-[1.125rem] rounded-full border-[3px] shadow-sm"
              />

              <motion.article
                tabIndex={0}
                animate={{ y: isActive ? -2 : 0 }}
                whileHover={reducedMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.25, ease: PRELOADER_EASE }}
                className={`alive-card mobile-card-lift rounded-lg border bg-bg-elevated p-5 shadow-sm transition-[border-color,box-shadow] sm:p-6 ${
                  isActive
                    ? "border-[color-mix(in_srgb,var(--accent-gold)_55%,var(--border))] shadow-lg shadow-[color-mix(in_srgb,var(--accent-gold)_18%,transparent)]"
                    : "border-border"
                } ${
                  isLatest
                    ? "ring-2 ring-[color-mix(in_srgb,var(--accent-gold)_28%,transparent)]"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="font-display text-4xl leading-none text-[color-mix(in_srgb,var(--accent-gold)_22%,transparent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-normal ${
                      isLatest
                        ? "bg-[color-mix(in_srgb,var(--accent-gold)_18%,transparent)] text-accent"
                        : "bg-[color-mix(in_srgb,var(--accent-green)_12%,transparent)] text-[var(--accent-green)]"
                    }`}
                  >
                    {milestone.period}
                  </span>
                </div>
                <h3 className="font-training mt-3 text-xl font-black text-text sm:text-2xl">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted sm:text-base">{milestone.event}</p>
              </motion.article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

