"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, MessageCircle } from "lucide-react";
import { registrationSteps } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";
import { PRELOADER_EASE } from "@/lib/preloader";

export function HomeContactBand() {
  return (
    <section className="bg-bg text-text">
      <div className="section-shell pb-20 pt-8 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: PRELOADER_EASE }}
          className="home-inscription-band cinematic-section relative overflow-hidden rounded-lg border text-white shadow-2xl shadow-[var(--accent-green)]/10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(208,161,58,0.22),transparent_38%),radial-gradient(circle_at_88%_82%,rgba(43,118,85,0.28),transparent_42%)]"
            aria-hidden="true"
          />
          <div
            className="home-inscription-shine pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:p-10">
            <div>
              <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
                Inscripción
              </p>
              <h2 className="mt-4 text-balance text-3xl font-black leading-tight sm:text-5xl">
                Un ingreso claro para familias, aspirantes y cuerpo técnico.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                Completa el proceso con acompañamiento del club y canales directos para resolver
                dudas antes de tu primera sesión.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/formulario-miembros-2026"
                  className="btn-gold alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
                >
                  Iniciar inscripción
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href={buildWhatsAppUrl("Hola Real Sporting, quiero información sobre inscripciones.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black text-white"
                >
                  WhatsApp
                  <MessageCircle size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              {registrationSteps.map((step, index) => (
                <motion.article
                  key={step.step}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index, duration: 0.4, ease: PRELOADER_EASE }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="alive-card rounded-lg border border-white/14 bg-white/10 p-4 backdrop-blur-sm transition-shadow hover:border-[color-mix(in_srgb,var(--cinematic-accent)_45%,transparent)] hover:shadow-lg hover:shadow-[var(--accent-gold)]/10"
                >
                  <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
                    {step.step}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/72">{step.text}</p>
                </motion.article>
              ))}
              <Link
                href="/contacto#documentos"
                className="alive-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-4 text-sm font-black text-white transition-all hover:border-[var(--cinematic-accent)] hover:bg-white/14"
              >
                Ver documentos
                <FileText size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
