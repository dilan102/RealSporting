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
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              className={`alive-card group relative min-h-[280px] overflow-hidden rounded-lg border border-border bg-[#050805] text-white shadow-sm ${
                index === 0 ? "lg:row-span-2 lg:min-h-[580px]" : ""
              }`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="interactive-image object-cover"
                sizes={index === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 38vw, 100vw"}
              />
              <div className="image-card-overlay absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-[#f3c548]">
                  <Dumbbell size={15} aria-hidden="true" />
                  {item.category}
                </p>
                <h3 className="font-gallery mt-2 text-3xl font-black sm:text-4xl">{item.title}</h3>
              </div>
            </article>
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
