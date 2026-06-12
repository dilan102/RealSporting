"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { club } from "@/lib/content";

type HeroCopy = {
  badge?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  location?: string;
};

export function Hero({ copy = {} }: { copy?: HeroCopy }) {
  const title = copy.title || "Desde Usme, con disciplina, hacia el futuro.";

  return (
    <section className="relative isolate min-h-[94svh] overflow-hidden">
      {/* Hero Image - Simple, No parallax */}
      <Image
        src="/brand/hero-training.jpg"
        alt="Entrenamiento del Club Deportivo Real Sporting en Usme"
        fill
        priority
        sizes="100vw"
        className="hero-photo absolute inset-0 object-cover object-[center_38%]"
        aria-hidden="true"
      />

      {/* Overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Watermark logo - subtle background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <Image
          src="/logo.png"
          alt=""
          width={500}
          height={500}
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="section-shell relative z-10 flex min-h-[94svh] items-end pb-10 pt-28 sm:pb-14 sm:pt-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt=""
              width={24}
              height={24}
              className="object-contain"
              aria-hidden="true"
            />
            {copy.badge || "Club Deportivo Real Sporting de Usme"}
          </div>

          {/* Title */}
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
            {copy.subtitle ||
              `${club.tagline}. Formamos jugadores con método, valores y sentido de pertenencia territorial.`}
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/club"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/12 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg sm:text-base"
            >
              {copy.cta || "Conocer el club"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Location */}
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
            <MapPin size={14} aria-hidden="true" />
            {copy.location || "Usme · Bogotá D.C."}
          </p>
        </div>
      </div>
    </section>
  );
}
