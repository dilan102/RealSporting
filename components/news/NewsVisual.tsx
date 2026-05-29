import Image from "next/image";
import { Dumbbell, HeartHandshake, Shield, Trophy } from "lucide-react";
import type { News } from "@/lib/content";
import { NEWS_FALLBACK_IMAGE } from "@/lib/site";

const defaultBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjNzc3Nzc3Ii8+PC9zdmc+";

export function getCategoryClass(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("cantera")) {
    return "border-emerald-600/30 bg-emerald-600/12 text-emerald-700 dark:text-emerald-300";
  }

  if (normalized.includes("entrenamiento")) {
    return "border-[var(--accent-gold)]/40 bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]";
  }

  if (normalized.includes("comunidad")) {
    return "border-blue-500/30 bg-blue-500/12 text-blue-600 dark:text-blue-300";
  }

  if (normalized.includes("competencia")) {
    return "border-red-500/30 bg-red-500/12 text-red-600 dark:text-red-300";
  }

  return "border-border bg-bg-elevated text-accent";
}

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("entrenamiento")) {
    return Dumbbell;
  }

  if (normalized.includes("comunidad")) {
    return HeartHandshake;
  }

  if (normalized.includes("competencia")) {
    return Trophy;
  }

  return Shield;
}

export function NewsBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] shadow-sm backdrop-blur-md ${getCategoryClass(category)}`}
    >
      {category}
    </span>
  );
}

export function NewsVisual({
  item,
  sizes,
  priority = false,
  className = "",
}: {
  item: News;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const imageSrc = item.image || NEWS_FALLBACK_IMAGE;
  const hasImage = Boolean(imageSrc);
  const Icon = getCategoryIcon(item.category);

  if (hasImage) {
    return (
      <Image
        src={imageSrc}
        alt={item.title}
        fill
        priority={priority}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={defaultBlurDataURL}
        className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--accent-green),var(--accent-gold))]">
      <div className="grid size-20 place-items-center rounded-lg border border-white/25 bg-black/20 text-white shadow-xl backdrop-blur-md">
        <Icon size={42} aria-hidden="true" />
      </div>
    </div>
  );
}
