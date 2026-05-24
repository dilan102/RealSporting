import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { club } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-bg text-text">
      <div className="pointer-events-none absolute inset-0 grid-overlay" />

      <div className="relative mx-auto grid min-h-[96vh] max-w-7xl gap-8 px-4 pb-10 pt-24 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:px-8">
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
            Escuela deportiva
          </div>

          <h1
            className="mt-6 max-w-4xl text-[clamp(3.2rem,17vw,5.8rem)] font-black leading-[0.86] tracking-tight text-text sm:mt-8 sm:text-7xl lg:text-8xl"
          >
            Desde Usme.
            <br />
            Con disciplina.
            <br />
            Hacia el futuro.
          </h1>

          <p
            className="mobile-reveal mobile-reveal-delay-1 mt-6 max-w-2xl text-base font-semibold leading-7 text-muted sm:text-xl sm:leading-8"
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
          className="mobile-reveal mobile-reveal-delay-3 mobile-card-lift relative aspect-[0.86] min-h-[430px] overflow-hidden rounded-[2rem] border border-border bg-bg-elevated shadow-2xl sm:aspect-[16/10] sm:min-h-[430px] sm:rounded-lg lg:aspect-auto lg:min-h-[620px]"
        >
          <Image
            src="/banner.png"
            alt={`Jugadores de ${club.name}`}
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 1024px) 43vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101811]/90 via-[#101811]/12 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent backdrop-blur-md sm:bg-transparent sm:px-0 sm:py-0">
              <MapPin size={15} aria-hidden="true" />
              Usme · Bogotá
            </p>
            <p className="mt-4 max-w-sm text-2xl font-black leading-tight sm:text-2xl">
              Un proceso para crecer dentro y fuera de la cancha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
