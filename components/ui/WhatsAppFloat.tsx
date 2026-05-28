"use client";

import { MessageCircle } from "lucide-react";
import { social } from "@/lib/content";

export function WhatsAppFloat() {
  const phone = social.phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    "Hola Real Sporting, quiero informacion sobre inscripciones generales.",
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-[75] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      aria-label="WhatsApp de inscripciones"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/45 animate-ping" aria-hidden="true" />
      <MessageCircle size={26} className="relative z-10" aria-hidden="true" />
    </a>
  );
}
