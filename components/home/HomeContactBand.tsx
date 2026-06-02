import Link from "next/link";
import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import { registrationSteps } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";

export function HomeContactBand() {
  return (
    <section className="bg-bg text-text">
      <div className="section-shell pb-20 pt-8 sm:pb-24">
        <div className="overflow-hidden rounded-lg border border-border bg-[#050805] text-white shadow-2xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-[#f3c548]">
                Inscripción
              </p>
              <h2 className="mt-4 text-balance text-3xl font-black leading-tight sm:text-5xl">
                Un ingreso claro para familias, aspirantes y cuerpo técnico.
              </h2>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/formulario-miembros-2026"
                  className="btn-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
                >
                  Iniciar inscripción
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href={buildWhatsAppUrl("Hola Real Sporting, quiero información sobre inscripciones.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/24 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition-all hover:border-[#f3c548] hover:bg-white/16"
                >
                  WhatsApp
                  <MessageCircle size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              {registrationSteps.map((step) => (
                <article key={step.step} className="rounded-lg border border-white/12 bg-white/8 p-4">
                  <p className="text-xs font-black uppercase tracking-normal text-[#f3c548]">
                    {step.step}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/72">{step.text}</p>
                </article>
              ))}
              <Link
                href="/contacto#documentos"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/18 px-4 text-sm font-black text-white transition-all hover:border-[#f3c548]"
              >
                Ver documentos
                <FileText size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
