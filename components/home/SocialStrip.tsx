import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { social } from "@/lib/content";

export function SocialStrip() {
  return (
    <section className="border-y border-border bg-bg-elevated/50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 py-8 sm:gap-10 sm:px-6 lg:px-8">
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <Instagram size={18} /> Instagram
        </a>
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-secondary"
        >
          <Facebook size={18} /> Facebook
        </a>
        <a
          href={`mailto:${social.email}`}
          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
        >
          <Mail size={18} /> {social.email}
        </a>
        <a
          href={`tel:${social.phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
        >
          <Phone size={18} /> {social.phone}
        </a>
        <Link
          href="/contacto"
          className="text-sm font-medium text-accent hover:text-accent-secondary"
        >
          Página de contacto →
        </Link>
      </div>
    </section>
  );
}
