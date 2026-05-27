"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { social } from "@/lib/content";
import { buildGmailComposeUrl } from "@/lib/email";
import { fadeUpItem, staggerContainer } from "@/lib/motion";

const links = [
  {
    label: "Instagram",
    href: social.instagram,
    icon: Instagram,
    description: "Síguenos y mira los momentos del club",
  },
  {
    label: "Facebook",
    href: social.facebook,
    icon: Facebook,
    description: "Noticias, eventos y comunidad",
  },
  {
    label: "Correo",
    href: buildGmailComposeUrl({
      to: social.email,
      subject: "Contacto Real Sporting",
    }),
    icon: Mail,
    description: social.email,
  },
  {
    label: "Teléfono",
    href: `tel:${social.phone.replace(/\s/g, "")}`,
    icon: Phone,
    description: social.phone,
  },
];

export function SocialLinks() {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {links.map(({ label, href, icon: Icon, description }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          variants={fadeUpItem}
          className="light-panel group flex min-h-40 flex-col justify-between rounded-lg border border-border bg-bg p-6 text-text shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-[var(--accent-green)] text-white transition-all duration-300 ease-in-out group-hover:bg-[var(--accent-gold)] group-hover:text-[var(--button-text)]">
            <Icon size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="font-black">{label}</p>
            <p className="mt-1 overflow-wrap-anywhere text-sm leading-relaxed text-muted">
              {description}
            </p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
