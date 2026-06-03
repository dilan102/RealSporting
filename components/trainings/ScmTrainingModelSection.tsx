import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { scmTrainingModel } from "@/lib/content";

const modelIcons: LucideIcon[] = [Brain, Dumbbell, ClipboardCheck, CalendarDays];

export function ScmTrainingModelSection() {
  return (
    <section id="modelo-scm" className="scroll-mt-28 border-b border-border bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealSection>
          <SectionHeading
            eyebrow="Modelo SCM"
            title="Cómo entrenamos"
            description="La Sinergia Cognitivo-Motriz une cuerpo, lectura del juego y valores para resolver problemas reales del fútbol sala."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scmTrainingModel.map(({ title, text }, index) => {
              const Icon = modelIcons[index];

              return (
                <article
                  key={title}
                  className="alive-card light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg"
                >
                  <Icon className="text-[var(--accent-gold)]" size={24} aria-hidden="true" />
                  <h3 className="font-training mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </article>
              );
            })}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
