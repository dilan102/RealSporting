import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { odsItems } from "@/lib/content";

export function OdsHomeSection() {
  return (
    <section className="bg-bg text-text">
      <div className="section-shell section-padding">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.32fr)]">
          <div>
            <p className="eyebrow">Impacto social</p>
            <h2 className="mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-5xl">
              El fútbol como herramienta de salud, educación, inclusión y paz.
            </h2>
            <Link
              href="/club"
              className="btn-green mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
            >
              Ver compromiso
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {odsItems.map((item) => (
              <article key={item.id} className="premium-card p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/14 text-accent">
                    <Leaf size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-accent">
                      {item.code}
                    </p>
                    <h3 className="mt-1 text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.shortText}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
