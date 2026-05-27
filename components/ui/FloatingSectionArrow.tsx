"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type FloatingSectionArrowProps = {
  sectionIds: string[];
};

export function FloatingSectionArrow({ sectionIds }: FloatingSectionArrowProps) {
  const [targetId, setTargetId] = useState<string | null>(sectionIds[1] ?? null);

  const idsKey = useMemo(() => sectionIds.join("|"), [sectionIds]);

  useEffect(() => {
    const ids = idsKey.split("|").filter(Boolean);

    const updateTarget = () => {
      const scrollAnchor = window.scrollY + window.innerHeight * 0.42;
      const currentIndex = ids.reduce((activeIndex, id, index) => {
        const element = document.getElementById(id);

        if (!element) {
          return activeIndex;
        }

        return element.offsetTop <= scrollAnchor ? index : activeIndex;
      }, 0);
      const nextId = ids[currentIndex + 1] ?? null;
      const pageEndReached =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      setTargetId(pageEndReached ? null : nextId);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [idsKey]);

  if (!targetId) {
    return null;
  }

  const scrollToTarget = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      aria-label="Ir a la siguiente sección"
      onClick={scrollToTarget}
      className="group fixed bottom-5 left-1/2 z-[70] grid size-13 -translate-x-1/2 place-items-center rounded-full border-2 border-white/90 bg-[var(--accent-gold)] text-[var(--button-text)] shadow-[0_12px_34px_rgba(0,0,0,0.36),0_0_0_6px_color-mix(in_srgb,var(--accent-green)_24%,transparent)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--accent-green)] hover:text-white sm:bottom-7 sm:size-14"
    >
      <ChevronDown
        size={25}
        className="transition-transform duration-300 group-hover:translate-y-1"
        aria-hidden="true"
      />
    </button>
  );
}
