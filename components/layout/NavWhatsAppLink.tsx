"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

type NavWhatsAppLinkProps = {
  className?: string;
  compact?: boolean;
};

export function NavWhatsAppLink({ className = "", compact = false }: NavWhatsAppLinkProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "btn-green inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black text-white"
      }
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span>{compact ? "WhatsApp" : "Escríbenos"}</span>
    </a>
  );
}
