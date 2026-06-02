import type { Metadata } from "next";
import { ClipboardList, LockKeyhole, MailCheck } from "lucide-react";
import { MemberInfoForm } from "@/components/contact/MemberInfoForm";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Información Miembros 2026 | Club Deportivo Real Sporting",
  },
  description:
    "Formulario privado de información general para miembros del Club Deportivo Real Sporting de Usme 2026.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: pageOpenGraph(
    "Información Miembros 2026 | Club Deportivo Real Sporting",
    "Formulario privado de información general para miembros del Club Deportivo Real Sporting de Usme 2026.",
  ),
};

const summaryItems = [
  {
    title: "Registro institucional",
    text: "Actualización de información para el proceso deportivo y administrativo 2026.",
    icon: LockKeyhole,
  },
  {
    title: "Información completa",
    text: "Incluye autorizaciones, datos del inscrito y datos del representante.",
    icon: ClipboardList,
  },
  {
    title: "Recepción del club",
    text: "Las respuestas se envían por el canal de inscripción configurado para Real Sporting.",
    icon: MailCheck,
  },
];

export default function FormularioMiembros2026Page() {
  return (
    <main className="bg-bg text-text transition-colors">
      <PageHero
        title="Información general Miembros 2026"
        subtitle="Formulario institucional para actualizar autorizaciones y datos de integrantes del Club Deportivo Real Sporting de Usme."
        eyebrow="Real Sporting de Usme"
        image="/brand/gallery-team.jpg"
      />

      <section className="section-ambient border-b border-[color-mix(in_srgb,var(--accent-green)_18%,var(--border))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-green)_9%,var(--bg-primary))_0%,var(--bg-primary)_55%,color-mix(in_srgb,var(--accent-gold)_8%,var(--bg-primary))_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="alive-card rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated/92 p-5 shadow-xl shadow-[color-mix(in_srgb,var(--accent-green)_12%,transparent)] backdrop-blur sm:p-6">
              <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                Club Deportivo Real Sporting 2026
              </p>
              <h2 className="font-institutional mt-2 text-3xl font-black tracking-normal sm:text-4xl">
                Se solicita a todos los miembros del Club diligenciar toda la información aquí solicitada.
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-muted sm:text-base">
                La información suministrada será usada para la gestión de recursos, acompañamiento integral y programas deportivos adaptados a la realidad de la comunidad.
              </p>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {summaryItems.map(({ title, text, icon: Icon }) => (
                <article
                  key={title}
                  className="alive-card rounded-lg border border-border bg-bg-elevated/90 p-4 shadow-sm"
                >
                  <Icon className="text-[var(--accent-green)]" size={22} aria-hidden="true" />
                  <h3 className="font-social-impact mt-3 text-base font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <RevealSection>
            <MemberInfoForm />
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
