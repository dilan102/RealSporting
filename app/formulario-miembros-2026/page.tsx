import type { Metadata } from "next";
import { ClipboardList, LockKeyhole, MailCheck } from "lucide-react";
import { MemberInfoForm } from "@/components/contact/MemberInfoForm";
import { PageHero } from "@/components/ui/PageHero";
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
      />

      <section className="border-b border-border bg-gradient-to-b from-accent/10 via-bg to-bg">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-bg-elevated/50 p-8 backdrop-blur-sm sm:p-12">
            <div className="mb-8 inline-block rounded-lg bg-accent/20 px-4 py-2">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">Real Sporting 2026</p>
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Actualización de información institucional
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/80">
              Completa el formulario con todos tus datos. La información es privada y se utiliza únicamente para mejorar nuestro proceso deportivo y administrativo.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {summaryItems.map(({ title, text, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-lg border border-border/50 bg-bg/50 p-4"
                >
                  <Icon className="text-accent" size={24} aria-hidden="true" />
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-text/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <MemberInfoForm />
        </div>
      </section>
    </main>
  );
}
