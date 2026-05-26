import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { club } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg text-text">
      <div className="pointer-events-none absolute inset-0 grid-overlay" />

      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-8 px-4 pb-16 pt-24 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:px-8">
        <div className="mobile-reveal relative z-10">
          <div
            className="inline-flex items-center gap-3 rounded-full border border-border bg-bg-elevated/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-accent shadow-sm backdrop-blur-md sm:rounded-lg"
          >
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

          <h1
            className="mt-6 max-w-4xl text-[clamp(2.55rem,12.5vw,4.35rem)] font-black leading-[0.92] tracking-tight text-text sm:mt-8 sm:text-[4.9rem] sm:leading-[0.9] lg:text-8xl"
          >
            Desde Usme.
            <br />
            Con disciplina.
            <br />
            Hacia el futuro.
          </h1>

          <p
            className="mobile-reveal mobile-reveal-delay-1 mt-6 max-w-2xl text-[0.98rem] font-semibold leading-7 text-muted sm:text-lg sm:leading-8 lg:text-xl"
          >
            {club.tagline}. Formamos jugadores con método, valores y sentido
            de pertenencia.
          </p>

          <div
            className="mobile-reveal mobile-reveal-delay-2 mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center"
          >
            <Link
              href="/contacto"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-bg shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90 sm:rounded-lg"
            >
              Inscripción
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/club"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-bg-elevated/80 px-5 text-sm font-bold text-text backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent sm:rounded-lg"
            >
              Proyecto deportivo
            </Link>
          </div>
        </div>

        <div
          className="relative hidden aspect-auto min-h-[620px] overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-2xl lg:block"
        >
          <Image
            src="/banner.png"
            alt={`Jugadores de ${club.name}`}
            fill
            priority
            className="object-cover object-center"
            sizes="43vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101811]/90 via-[#101811]/12 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
              <MapPin size={15} aria-hidden="true" />
              Usme · Bogotá
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
