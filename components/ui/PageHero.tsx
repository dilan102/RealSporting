import Image from "next/image";
import { club } from "@/lib/content";

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
  image = "/brand/gallery-team.jpg",
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-[#050805] text-white">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,9,0.94),rgba(5,14,9,0.72)_48%,rgba(5,14,9,0.28))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,9,0.18),rgba(5,14,9,0.86))]" />
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
          <p className="text-xs font-black uppercase tracking-normal text-[#d0a13a]">
            {eyebrow}
          </p>
        </div>
        <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/84 sm:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
