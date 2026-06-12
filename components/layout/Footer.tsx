"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { club, navLinks, social } from "@/lib/content";
import { PHONE_TEL, VENUE_NAME } from "@/lib/constants";

const MapEmbed = dynamic(() => import("@/components/MapEmbed"), {
  loading: () => <div className="h-64 bg-bg-elevated" />,
  ssr: false,
});

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      {/* Gradient accent line */}
      <div className="h-1.5 bg-gradient-to-r from-accent to-accent-gold" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-16">
          {/* Brand Section */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg border border-white/10 bg-white/5">
                <Image
                  src="/logo.png"
                  alt="Logotipo Real Sporting"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black leading-none text-text">{club.name}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">Usme</p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-relaxed text-text/80">{club.tagline}</p>

            <div className="mt-6 flex items-start gap-2 text-sm text-text/80">
              <MapPin size={16} className="shrink-0 text-accent" aria-hidden="true" />
              <span>{VENUE_NAME}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`mailto:${social.email}`}
                aria-label="Email"
                className="grid size-10 place-items-center rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Navegación</p>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Contacto</p>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href={`mailto:${social.email}`}
                  className="inline-flex items-center gap-2 text-sm text-text/80 hover:text-accent transition-colors"
                >
                  <Mail size={16} />
                  {social.email}
                </a>
              </li>
              <li>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2 text-sm text-text/80 hover:text-accent transition-colors"
                >
                  <Phone size={16} />
                  {social.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-accent">Acciones</p>
            <div className="mt-6 grid gap-3">
              <Link
                href="/formulario-miembros-2026"
                className="group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-text/80 hover:border-accent hover:text-accent transition-colors"
              >
                Inscribirse
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-text/80 hover:border-accent hover:text-accent transition-colors"
              >
                Contactar
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="alive-card mt-12 overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">
              Ubicación — {VENUE_NAME}
            </p>
          </div>
          <MapEmbed compact />
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center text-xs font-medium text-muted">
          <p>© {year} {club.name}. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs text-muted/70">Hecho con ❤️ para Usme</p>
        </div>
      </div>
    </footer>
  );
}
