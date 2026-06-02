import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Handshake,
  HeartPulse,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { odsItems } from "@/lib/content";

const odsIcons: Record<string, LucideIcon> = {
  "ods-3": HeartPulse,
  "ods-4": BookOpen,
  "ods-5": Users,
  "ods-10": Scale,
  "ods-11": Building2,
  "ods-16": Handshake,
};

export function OdsHomeSection() {
  return (
    <section className="section-ambient bg-bg text-text">
      <div className="section-shell section-padding">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.68fr)_minmax(0,1.32fr)]">
          <div>
            <p className="eyebrow">Impacto social</p>
            <h2 className="font-social-impact kinetic-heading mt-4 text-balance text-3xl font-black leading-[1.04] sm:text-4xl lg:text-5xl">
              El fútbol como herramienta de salud, educación, inclusión y paz.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted sm:text-base">
              Conoce cómo el club vincula su trabajo formativo con los Objetivos de Desarrollo
              Sostenible de Naciones Unidas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {odsItems.map((item) => {
              const Icon = odsIcons[item.id] ?? HeartPulse;

              return (
                <article key={item.id} className="alive-card premium-card p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/14 text-accent">
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-normal text-accent">
                        {item.code}
                      </p>
                      <h3 className="font-social-impact mt-1 text-lg font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.shortText}</p>
                    </div>
                  </div>
                </article>
              );
            })}
            <Link
              href="/club#compromiso-ods"
              className="btn-green alive-lift alive-card premium-card-hover flex min-h-[4.75rem] items-center justify-center gap-3 rounded-lg px-5 py-4 text-center sm:col-span-2"
            >
              <span className="font-social-impact max-w-2xl text-balance text-base font-black leading-snug sm:text-lg">
                Conoce los ODS (objetivos de desarrollo sostenible)
              </span>
              <ArrowRight size={20} className="shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
