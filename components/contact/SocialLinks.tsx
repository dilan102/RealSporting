"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { social } from "@/lib/content";
import { fadeUpItem, staggerContainer } from "@/lib/motion";

const links = [
  {
    label: "Instagram",
    href: social.instagram,
    icon: Instagram,
    description: "Síguenos y mira los momentos del club",
    color: "hover:border-pink-500/40 hover:text-pink-400",
  },
  {
    label: "Facebook",
    href: social.facebook,
    icon: Facebook,
    description: "Noticias, eventos y comunidad",
    color: "hover:border-blue-500/40 hover:text-blue-400",
  },
  {
    label: "Correo",
    href: `mailto:${social.email}`,
    icon: Mail,
    description: social.email,
    color: "hover:border-accent/40 hover:text-accent",
  },
  {
    label: "Teléfono",
    href: `tel:${social.phone.replace(/\s/g, "")}`,
    icon: Phone,
    description: social.phone,
    color: "hover:border-accent-secondary/40 hover:text-accent-secondary",
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
      {links.map(({ label, href, icon: Icon, description, color }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          variants={fadeUpItem}
          className={`flex flex-col gap-4 rounded-lg border border-border bg-bg-elevated p-6 transition-colors duration-300 ${color}`}
        >
          <Icon size={28} />
          <div>
            <p className="font-semibold">{label}</p>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
}
