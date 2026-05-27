"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "countup.js";
import { ArrowRight, MapPin } from "lucide-react";
import { RegistrationModal } from "@/components/contact/RegistrationModal";
import { club } from "@/lib/content";

const heroImages = ["/banner.png", "/trainings/3.svg", "/trainings/6.svg"];

const stats = [
  { value: 7, suffix: "", label: "Categorías" },
  { value: 20, suffix: "+", label: "Espacios" },
  { value: 2026, suffix: "", label: "Proyección" },
];

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const counter = new CountUp(ref.current, value, {
      duration: 1.7,
      suffix,
      separator: "",
    });

    if (!counter.error) {
      counter.start();
    }
  }, [suffix, value]);

  return (
    <div className="rounded-lg border border-white/20 bg-white/95 p-4 shadow-sm backdrop-blur-md">
      <span ref={ref} className="block text-4xl font-black leading-none text-accent" />
      <span className="mt-2 block text-xs font-black uppercase tracking-[0.14em] text-[#223127]">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(Math.min(window.scrollY * 0.16, 90));

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-bg text-text">
      <div className="absolute inset-0">
        <Image
          src={heroImages[0]}
          alt={`Jugadores de ${club.name}`}
          fill
          priority
          sizes="100vw"
          className="hero-main-image object-center"
          style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
        />
      </div>
      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/35 to-black/18" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="max-w-5xl">
          <div className="animate-[mobile-reveal_760ms_cubic-bezier(0.22,1,0.36,1)_both] inline-flex items-center gap-3 rounded-lg border border-white/20 bg-white/95 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-accent shadow-sm backdrop-blur-md">
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              className="object-contain"
              aria-hidden="true"
            />
            Club deportivo
          </div>

          <h1 className="mt-6 max-w-5xl animate-[mobile-reveal_820ms_cubic-bezier(0.22,1,0.36,1)_90ms_both] text-[clamp(3rem,12vw,6rem)] font-black leading-[0.96] text-white drop-shadow-xl">
            Desde Usme.
            <br />
            Con disciplina.
            <br />
            Hacia el futuro.
          </h1>

          <p className="mt-6 max-w-2xl animate-[mobile-reveal_820ms_cubic-bezier(0.22,1,0.36,1)_180ms_both] text-base font-semibold leading-8 text-white sm:text-xl">
            {club.tagline}. Formamos jugadores con método, valores y sentido
            de pertenencia.
          </p>

          <div className="mt-8 grid animate-[mobile-reveal_820ms_cubic-bezier(0.22,1,0.36,1)_270ms_both] gap-3 sm:flex sm:flex-wrap sm:items-center">
            <RegistrationModal
              className="btn-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-black"
            >
              Inscríbete
              <ArrowRight size={16} aria-hidden="true" />
            </RegistrationModal>
            <Link
              href="/club"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/45 bg-white/12 px-6 text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-[1.03] hover:border-accent hover:bg-white/18 hover:shadow-lg hover:shadow-[var(--accent-gold)]/20"
            >
              Proyecto deportivo
            </Link>
          </div>

          <div className="mt-9 grid max-w-2xl animate-[mobile-reveal_820ms_cubic-bezier(0.22,1,0.36,1)_360ms_both] gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>

          <p className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/85">
            <MapPin size={15} aria-hidden="true" />
            Usme · Bogotá
          </p>
        </div>
      </div>
    </section>
  );
}
