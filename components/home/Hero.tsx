"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { club, institutionalStats } from "@/lib/content";
import { HeroScrollEffect } from "@/components/ui/HeroScrollEffect";
import { useScrollValue } from "@/hooks/useScrollValue";
import { useHeroReady, useCriticalImage } from "@/hooks/useLoading";
import CountUp from "@/components/CountUp";

type HeroCopy = {
  badge?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  location?: string;
};

export function Hero({ copy = {} }: { copy?: HeroCopy }) {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const title = copy.title || "Desde Usme, Con disciplina, Hacia el futuro.";

  // Marcar Hero como listo cuando esté renderizado
  useHeroReady();

  // Monitorizar la carga de la imagen crítica
  useCriticalImage('hero-image');

  useScrollValue((scrollY) => {
    if (imageRef.current) {
      const value = Math.min(scrollY * 0.06, 32);
      // Escribir directo al DOM, cero re-renders
      imageRef.current.style.transform = `translate3d(0, ${value}px, 0) scale(1.04)`;
    }
  });

  return (
    <section className="cinematic-section relative isolate min-h-[94svh] overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 scale-[1.04]"
      >
        <Image
          src="/brand/hero-training.jpg"
          alt="Entrenamiento del Club Deportivo Real Sporting en Usme"
          fill
          priority
          sizes="100vw"
          data-critical-image="hero-image"
          className="hero-photo object-cover object-[center_38%]"
        />
      </div>
      <div className="hero-overlay-h absolute inset-0" />
      <div className="hero-overlay-v absolute inset-0" />

      <HeroScrollEffect />
      {/* Watermark escudo (shield) as background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <Image
          src="/logo.png"
          alt=""
          width={600}
          height={600}
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      {/* Glow verde suave detrás del escudo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[450px] h-[450px] rounded-full blur-[60px] bg-gradient-to-r from-transparent via-[#00FF78] to-transparent opacity-[0.06]" />
      </div>
      <div className="section-shell relative z-10 flex min-h-[94svh] items-end pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pb-16">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.55fr)] lg:items-end">
          <div className="max-w-5xl">
            <div className="mobile-reveal cinematic-accent inline-flex items-center gap-3 rounded-lg border border-white/18 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-normal shadow-sm backdrop-blur-md">
              <Image
                src="/logo.png"
                alt=""
                width={30}
                height={30}
                className="object-contain"
                aria-hidden="true"
              />
              {copy.badge || "Club Deportivo Real Sporting de Usme"}
            </div>

            <h1 className="font-hero mt-6 max-w-5xl text-6xl font-black leading-[0.88] tracking-normal text-white drop-shadow-xl sm:text-7xl lg:text-9xl mobile-reveal mobile-reveal-delay-1 hero-title-enter">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/88 sm:text-xl mobile-reveal mobile-reveal-delay-2">
              {copy.subtitle ||
                `${club.tagline}. Formamos jugadores con método, valores y sentido de pertenencia territorial.`}
            </p>

            <div className="mt-8 mobile-reveal mobile-reveal-delay-3">
              <Link
                href="/club"
                className="cta-btn alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[var(--cinematic-accent)] hover:bg-white/16"
              >
                {copy.cta || "Conocer el club"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-white/76">
              <MapPin size={15} aria-hidden="true" />
              {copy.location || "Usme · Bogotá D.C."}
            </p>
          </div>

          <aside className="grid gap-3 rounded-lg border border-white/16 bg-black/28 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-center gap-3 border-b border-white/12 pb-4 sm:col-span-2 lg:col-span-1">
              <span className="grid size-11 place-items-center rounded-lg bg-accent text-[var(--button-text)]">
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <p className="text-sm font-black uppercase tracking-normal text-white">
                Datos institucionales
              </p>
            </div>
            {institutionalStats.map((stat) => (
              <div key={stat.label} className="alive-card rounded-lg border border-white/12 bg-white/8 p-4">
                <p className="font-training cinematic-accent text-5xl font-black leading-none">
                  <CountUp to={Number(stat.value.replace(/\D/g, "")) || 0} suffix={stat.value.replace(/\d/g, "") || ""} />
                </p>
                <p className="mt-2 text-sm font-black text-white">{stat.label}</p>
                <p className="mt-1 text-xs leading-5 text-white/68">{stat.detail}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
