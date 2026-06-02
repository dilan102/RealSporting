import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { galleryItems } from "@/lib/content";

export function HomeGallerySection() {
  return (
    <section className="section-band section-ambient text-text">
      <div className="section-shell section-padding">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Galería</p>
            <h2 className="font-gallery kinetic-heading mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-5xl">
              Imágenes de apoyo para contar disciplina, equipo y comunidad.
            </h2>
          </div>
          <Link
            href="/entrenamientos"
            className="alive-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text transition-all hover:border-accent hover:text-accent"
          >
            Ver entrenamientos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
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
                  <Images size={15} aria-hidden="true" />
                  {item.category}
                </p>
                <h3 className="font-gallery mt-2 text-3xl font-black sm:text-4xl">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
