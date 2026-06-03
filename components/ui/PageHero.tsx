import Image from "next/image";
import { club } from "@/lib/content";
import { PAGE_HERO_IMAGE } from "@/lib/site";

type PageHeroProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  image?: string;
};

export function PageHero({
  title,
  subtitle,
  eyebrow = club.name,
  image = PAGE_HERO_IMAGE,
}: PageHeroProps) {
  return (
    <section className="cinematic-section section-ambient relative isolate overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="hero-photo object-cover object-center opacity-60"
          sizes="100vw"
        />
        <div className="hero-overlay-h absolute inset-0" />
        <div className="hero-overlay-v absolute inset-0" />
        <div className="absolute inset-0 grid-overlay opacity-[0.12]" />
      </div>

      <div className="section-shell relative flex min-h-[360px] flex-col justify-end pb-12 pt-32 sm:min-h-[430px] sm:pb-16">
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg border border-white/16 bg-white/10 p-1 backdrop-blur">
            <Image
              src="/logo.png"
              alt=""
              width={42}
              height={42}
              className="object-contain"
              aria-hidden="true"
            />
          </span>
          <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
            {eyebrow}
          </p>
        </div>
        <h1 className="font-hero kinetic-heading max-w-4xl text-balance text-6xl font-black leading-[0.88] tracking-normal sm:text-7xl lg:text-8xl xl:text-9xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/84 sm:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
