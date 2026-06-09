export default function SectionDivider({ label }: { label: string }) {
  return (
    <div className="section-shell py-4 sm:py-6">
      <div className="terminal-divider flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-white/65">
        <span className="h-px flex-1 bg-white/10" />
        <span className="font-mono">{"// " + label.toUpperCase()}</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
