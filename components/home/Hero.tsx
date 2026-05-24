import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { club } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg text-text">
      <div className="pointer-events-none absolute inset-0 grid-overlay" />

      <div className="relative mx-auto grid min-h-[96vh] max-w-7xl gap-10 px-4 pb-14 pt-28 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:px-8">
        <div>
          <div
            className="inline-flex items-center gap-3 rounded-lg border border-border bg-bg-elevated/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-accent"
          >
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              className="object-contain"
              aria-hidden="true"
            />
            Escuela deportiva
          </div>

          <h1
            className="mt-7 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-text sm:mt-8 sm:text-7xl lg:text-8xl"
          >
            Desde Usme.
            <br />
            Con disciplina.
            <br />
            Hacia el futuro.
          </h1>

          <p
            className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-muted sm:text-xl"
          >
            {club.tagline}. Formamos jugadores con método, valores y sentido
            de pertenencia.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/contacto"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-bold text-bg transition-colors hover:bg-accent/90"
            >
              Inscripción
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/club"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-bg-elevated/80 px-5 text-sm font-bold text-text transition-colors hover:border-accent/50 hover:text-accent"
            >
              Proyecto deportivo
            </Link>
          </div>
        </div>

        <div
          className="relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-2xl sm:min-h-[430px] lg:aspect-auto lg:min-h-[620px]"
        >
          <Image
            src="/banner.png"
            alt={`Jugadores de ${club.name}`}
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 1024px) 43vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101811]/85 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
              <MapPin size={15} aria-hidden="true" />
              Usme · Bogotá
            </p>
            <p className="mt-4 max-w-sm text-2xl font-black leading-tight">
              Un proceso para crecer dentro y fuera de la cancha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
