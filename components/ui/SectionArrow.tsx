"use client";

import { ChevronDown } from "lucide-react";

export function SectionArrow({
  targetId,
  label = "Ir a la siguiente sección",
  className = "",
}: {
  targetId: string;
  label?: string;
  className?: string;
}) {
  const scrollToTarget = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={scrollToTarget}
      className={`group mx-auto mt-8 grid size-12 place-items-center rounded-full border border-accent/35 bg-bg-elevated/80 text-accent shadow-[0_0_28px_color-mix(in_srgb,var(--color-accent)_22%,transparent)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-bg sm:size-14 ${className}`}
    >
      <ChevronDown
        size={24}
        className="transition-transform duration-300 group-hover:translate-y-1"
        aria-hidden="true"
      />
    </button>
  );
}
