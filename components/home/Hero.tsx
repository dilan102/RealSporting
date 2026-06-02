"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { club, institutionalStats } from "@/lib/content";

export function Hero() {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      return;
    }

    const onScroll = () => setParallax(Math.min(window.scrollY * 0.16, 92));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="cinematic-section relative isolate min-h-[94svh] overflow-hidden">
      <div
        className="absolute inset-0 scale-[1.04]"
        style={{ transform: `translate3d(0, ${parallax}px, 0) scale(1.04)` }}
      >
        <Image
          src="/brand/hero-training.jpg"
          alt="Entrenamiento del Club Deportivo Real Sporting en Usme"
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover object-[center_38%]"
        />
      </div>
      <div className="hero-overlay-h absolute inset-0" />
      <div className="hero-overlay-v absolute inset-0" />
      <div className="hero-radial-vignette absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.14]" />

      <div className="section-shell relative flex min-h-[94svh] items-end pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pb-16">
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
              Club Deportivo Real Sporting de Usme
            </div>

            <h1 className="font-hero mt-6 max-w-5xl text-6xl font-black leading-[0.88] tracking-normal text-white drop-shadow-xl sm:text-7xl lg:text-9xl mobile-reveal mobile-reveal-delay-1">
              Desde Usme,
              <br />
              Con disciplina,
              <br />
              Hacia el futuro.
            </h1>

            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/88 sm:text-xl mobile-reveal mobile-reveal-delay-2">
              {club.tagline}. Formamos jugadores con método, valores y sentido
              de pertenencia territorial.
            </p>

            <div className="mt-8 mobile-reveal mobile-reveal-delay-3">
              <Link
                href="/club"
                className="alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[var(--cinematic-accent)] hover:bg-white/16"
              >
                Conocer el club
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-white/76">
              <MapPin size={15} aria-hidden="true" />
              Usme · Bogotá D.C.
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
                <p className="font-training cinematic-accent text-5xl font-black leading-none">{stat.value}</p>
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
