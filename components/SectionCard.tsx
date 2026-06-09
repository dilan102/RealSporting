import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  variant?: "full" | "card";
  id?: string;
}

export default function SectionCard({ children, className = "", variant = "card", id }: SectionCardProps) {
  if (variant === "full") {
    return <section id={id} className={className}>{children}</section>;
  }

  return (
    <section id={id} className={`section-card-hover rounded-3xl border border-white/8 bg-white/5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}>
      <div className="relative overflow-hidden rounded-[inherit] border border-white/6 px-4 py-6 sm:px-6 lg:px-8">
        <span className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {children}
      </div>
    </section>
  );
}
