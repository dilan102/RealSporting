"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { social } from "@/lib/content";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { PHONE_TEL, VENUE_NAME, WHATSAPP_URL } from "@/lib/constants";

const links: Array<{
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  ariaLabel?: string;
  accent?: boolean;
}> = [
  {
    label: "Instagram",
    href: social.instagram,
    icon: FaInstagram,
    description: "Síguenos y mira los momentos del club",
  },
  {
    label: "Facebook",
    href: social.facebook,
    icon: FaFacebook,
    description: "Noticias, eventos y comunidad",
  },
  {
    label: "Correo",
    href: `mailto:${social.email}`,
    icon: Mail,
    description: social.email,
    ariaLabel: "Enviar correo a Real Sporting",
  },
  {
    label: "Teléfono",
    href: PHONE_TEL,
    icon: Phone,
    description: social.phone,
    ariaLabel: "Llamar a Real Sporting",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: MessageCircle,
    description: "Escríbenos por WhatsApp",
    ariaLabel: "Escribir a Real Sporting por WhatsApp",
    accent: true,
  },
];

type SocialLinksProps = {
  showVenue?: boolean;
};

export function SocialLinks({ showVenue = false }: SocialLinksProps) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {links.map(({ label, href, icon: Icon, description, ariaLabel, accent }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={
            ariaLabel ||
            (label === "Instagram"
              ? "Seguir a Real Sporting en Instagram"
              : label === "Facebook"
                ? "Seguir a Real Sporting en Facebook"
                : label)
          }
          variants={fadeUpItem}
          className={`group flex min-h-40 flex-col justify-between rounded-lg border p-6 text-text shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg ${
            accent
              ? "border-[#25D366]/40 bg-[#25D366] text-white hover:border-[#25D366] hover:bg-[#1ebe5d]"
              : "light-panel border-border bg-bg hover:border-[var(--accent-gold)]"
          }`}
        >
          <span
            className={`grid size-12 place-items-center rounded-lg transition-all duration-300 ease-in-out ${
              accent
                ? "bg-white/20 text-white"
                : "bg-[var(--accent-green)] text-white group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--button-text)]"
            }`}
          >
            <Icon size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="font-black">{label}</p>
            <p
              className={`mt-1 overflow-wrap-anywhere text-sm leading-relaxed ${
                accent ? "text-white/90" : "text-muted"
              }`}
            >
              {description}
            </p>
          </div>
        </motion.a>
      ))}

      {showVenue && (
        <motion.div
          variants={fadeUpItem}
          className="light-panel group flex min-h-40 flex-col justify-between rounded-lg border border-border bg-bg p-6 text-text shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-[var(--accent-green)] text-white transition-all duration-300 ease-in-out group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--button-text)]">
            <MapPin size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="font-black">Sede</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{VENUE_NAME}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
