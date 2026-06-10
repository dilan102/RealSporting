"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { club } from "@/lib/content";

export function ValuePillarsStrip() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
      {club.values.map((value, index) => {
        const open = expanded === value.title;

        return (
          <article
            key={value.title}
            className={`animate-fade-in valor-item mobile-card-lift bg-bg-elevated transition-all duration-300 motion-reduce:transform-none ${
              open
                ? "ring-2 ring-inset ring-accent shadow-lg shadow-[var(--accent-gold)]/12"
                : "hover:bg-bg hover:shadow-md"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : value.title)}
              className="group w-full p-6 text-left"
              aria-expanded={open}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-black text-accent transition-colors group-hover:text-accent-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-muted transition-transform duration-300 ${
                    open ? "rotate-180 text-accent" : "group-hover:text-accent"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-2 text-2xl font-black">{value.title}</h3>
              {open && (
                <p
                  className="mt-3 overflow-hidden text-sm leading-7 text-muted"
                >
                  {value.description}
                </p>
              )}
            </button>
          </article>
        );
      })}
    </div>
  );
}
