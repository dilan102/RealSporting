"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { club, navLinks, social } from "@/lib/content";
import { PHONE_TEL, VENUE_NAME } from "@/lib/constants";
import MapEmbed from "@/components/MapEmbed";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="h-2 bg-[linear-gradient(90deg,var(--accent-green),var(--accent-gold),#0A0A0A)]" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_0.75fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logotipo Club Deportivo Real Sporting"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="font-semibold">{club.name}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{club.tagline}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin size={14} className="text-accent" />
              {VENUE_NAME}
            </p>
          </div>

          <div className="border-y border-[color-mix(in_srgb,var(--accent-gold)_30%,transparent)] py-6 md:border-x md:border-y-0 md:px-8 md:py-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Navegación
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Contacto
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir a Real Sporting en Instagram"
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Instagram size={16} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir a Real Sporting en Facebook"
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Facebook size={16} /> Facebook
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${social.email}`}
                  aria-label="Enviar correo a Real Sporting"
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
                >
                  <Mail size={16} /> {social.email}
                </a>
              </li>
              <li>
                <a
                  href={PHONE_TEL}
                  aria-label="Llamar a Real Sporting"
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
                >
                  <Phone size={16} /> {social.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--accent-gold)_30%,transparent)] bg-bg">
          <MapEmbed />
        </div>

        <div className="mt-12 border-t border-[color-mix(in_srgb,var(--accent-gold)_30%,transparent)] pt-6 text-center text-xs text-muted">
          © {year} {club.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
