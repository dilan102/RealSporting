import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { club, navLinks, social } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                aria-hidden
                className="object-contain"
              />
              <p className="font-semibold">{club.name}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{club.tagline}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin size={14} className="text-accent" />
              {social.location}
            </p>
          </div>

          <div>
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
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-secondary"
                >
                  <Facebook size={16} /> Facebook
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${social.email}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
                >
                  <Mail size={16} /> {social.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${social.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
                >
                  <Phone size={16} /> {social.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          © {year} {club.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
