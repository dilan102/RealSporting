import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { social } from "@/lib/content";

export function SocialStrip() {
  return (
    <section className="border-y border-border bg-bg-elevated/50">
      <div className="mobile-scrollbar-none mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-6 sm:flex-wrap sm:justify-center sm:gap-10 sm:px-6 sm:py-8 lg:px-8">
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-accent sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <Instagram size={18} /> Instagram
        </a>
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-accent-secondary sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <Facebook size={18} /> Facebook
        </a>
        <a
          href={`mailto:${social.email}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-text sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <Mail size={18} /> {social.email}
        </a>
        <a
          href={`tel:${social.phone.replace(/\s/g, "")}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-text sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <Phone size={18} /> {social.phone}
        </a>
        <Link
          href="/contacto"
          className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent hover:text-accent-secondary sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
        >
          Página de contacto →
        </Link>
      </div>
    </section>
  );
}
