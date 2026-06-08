import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { galleryItems } from "@/lib/content";

export function HomeGallerySection() {
  return (
    <section className="section-band section-ambient text-text">
      <div className="section-shell section-padding">
        <div className="max-w-3xl">
          <p className="eyebrow">Entrenamiento</p>
          <h2 className="font-gallery kinetic-heading mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-5xl">
            Sesiones con método, intensidad y trabajo en equipo cada semana.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Vista visual del trabajo en cancha. Más abajo encontrarás el registro de las últimas
            sesiones publicadas.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          {galleryItems.map((item, index) => (
            <Link
              key={item.title}
              href="/entrenamientos"
              className={`cinematic-card alive-card premium-card-hover hero-card-glow group relative min-h-[280px] overflow-hidden rounded-lg border border-border shadow-sm ${
                index === 0 ? "lg:row-span-2 lg:min-h-[580px]" : ""
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="interactive-image object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 38vw, 100vw"}
              />
              <div className="image-card-overlay absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="cinematic-accent inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal">
                  <Dumbbell size={15} aria-hidden="true" />
                  {item.category}
                </p>
                <h3 className="font-gallery mt-2 text-3xl font-black sm:text-4xl">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/entrenamientos"
          className="btn-green alive-lift alive-card premium-card-hover mt-4 flex min-h-[4.75rem] w-full items-center justify-center gap-3 rounded-lg px-5 py-4 text-center"
        >
          <span className="font-gallery max-w-2xl text-balance text-base font-black leading-snug sm:text-lg">
            Mira nuestros entrenamientos
          </span>
          <ArrowRight size={20} className="shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
