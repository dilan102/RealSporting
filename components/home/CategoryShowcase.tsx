import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sportCategoryCards } from "@/lib/content";

export function CategoryShowcase() {
  return (
    <section className="section-band-strong text-text">
      <div className="section-shell section-padding">
        <div className="flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Categorías</p>
            <h2 className="mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-6xl">
              Un proceso por edades, con objetivos claros para cada etapa.
            </h2>
          </div>
          <Link
            href="/equipo"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text transition-all hover:border-accent hover:text-accent"
          >
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sportCategoryCards.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href="/equipo"
              className="premium-card-hover group relative min-h-[360px] overflow-hidden rounded-lg border border-border bg-[#050805] text-white"
            >
              <Image
                src={category.image}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="image-card-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-black uppercase tracking-normal text-[#f3c548]">
                  {category.range}
                </p>
                <h3 className="mt-2 text-3xl font-black">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/82">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
