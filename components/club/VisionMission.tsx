"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Eye,
  Flag,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { club } from "@/lib/content";
import { fadeUpItem, staggerContainer } from "@/lib/motion";

const cards = [
  {
    icon: Target,
    title: "Misión",
    text: club.mission,
    image: "/trainings/3.svg",
  },
  {
    icon: Eye,
    title: "Visión",
    text: club.vision,
    image: "/banner.png",
  },
];

const valueIcons = [ShieldCheck, Users, Target, HeartHandshake, Flag];

export function VisionMission() {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {cards.map(({ icon: Icon, title, text, image }) => (
        <motion.article
          key={title}
          variants={fadeUpItem}
          className="overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors duration-300 hover:border-accent/40"
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
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-lg bg-accent text-bg">
              <Icon size={22} aria-hidden="true" />
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

export function ValuesGrid() {
  return (
    <motion.div
      className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {club.values.map((value, index) => {
        const Icon = valueIcons[index] || Flag;

        return (
          <motion.article
            key={value.title}
            variants={fadeUpItem}
            className="rounded-lg border border-border bg-bg-elevated p-5 transition-colors duration-300 hover:border-accent/40"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-lg bg-accent/15 text-accent">
              <Icon size={20} aria-hidden="true" />
            </div>
            <h3 className="font-black">{value.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{value.description}</p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}

export function Timeline() {
  return (
    <motion.ol
      className="grid gap-4 sm:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {club.milestones.map((m) => (
        <motion.li
          key={`${m.year}-${m.event}`}
          variants={fadeUpItem}
          className="rounded-lg border border-border bg-bg-elevated p-5"
        >
          <p className="text-sm font-black text-accent">{m.year}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{m.event}</p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
