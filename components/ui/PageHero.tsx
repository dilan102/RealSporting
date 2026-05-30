import Image from "next/image";
import { club } from "@/lib/content";

type PageHeroProps = {
  title: string;
  subtitle: string;
  image?: string;
};

export function PageHero({
  title,
  subtitle,
  image = "/banner.png",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg-elevated">
      <div className="relative min-h-[280px] sm:min-h-[360px]">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="hero-img object-cover object-center"
          sizes="100vw"
        />
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-25" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[280px] max-w-7xl flex-col justify-end px-4 py-10 sm:min-h-[360px] sm:px-6 sm:py-14 lg:px-8">
          <p className="max-w-3xl whitespace-normal text-xs font-black uppercase tracking-[0.14em] text-accent sm:text-sm">
            {club.name}
          </p>
          <h1 className="mt-3 max-w-3xl whitespace-normal text-[clamp(2.4rem,10vw,4.5rem)] font-black leading-[0.95] text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
