import type { OdsItem } from "@/lib/content";

type Props = {
  item: OdsItem;
  className?: string;
};

export function OdsInfographicPoster({ item, className = "" }: Props) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-border bg-[#f8faf7] text-[#1a241f] shadow-xl ${className}`}
      role="img"
      aria-label={item.infographicTitle}
    >
      <div className="px-6 py-5 text-white sm:px-8" style={{ backgroundColor: item.color }}>
        <div className="flex items-center gap-4">
          <span className="font-hero text-6xl font-black leading-none sm:text-7xl">
            {item.number}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/90">
              {item.code}
            </p>
            <h3 className="font-social-impact text-2xl font-black leading-tight sm:text-3xl">
              {item.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
        <div>
          <p className="text-sm font-black uppercase tracking-widest" style={{ color: item.color }}>
            {item.infographicTitle}
          </p>
          <p className="mt-3 text-base leading-7">{item.shortText}</p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-normal text-[#4a5d50]">
            Acciones del club
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {item.bullets.map((bullet) => (
              <li
                key={bullet.text}
                className="flex items-start gap-2 rounded-md border border-[#d8e0da] bg-white px-3 py-2 text-sm leading-6"
              >
                <span aria-hidden="true">{bullet.icon}</span>
                <span>{bullet.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-normal text-[#4a5d50]">
            Estadísticas del club
          </p>
          <ul className="mt-3 grid gap-4 sm:grid-cols-3">
            {item.stats.map((stat) => (
              <li key={stat.label}>
                <p
                  className="font-training text-3xl font-black leading-none"
                  style={{ color: item.color }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#4a5d50]">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg px-5 py-4 text-white" style={{ backgroundColor: item.color }}>
          <p className="text-xs font-black uppercase tracking-widest text-white/90">
            Objetivo del club
          </p>
          <p className="mt-2 text-lg font-black leading-snug">«{item.clubObjective}»</p>
        </div>

        <p className="text-sm leading-7 text-[#4a5d50]">
          <span className="font-black text-[#1a241f]">Impacto esperado: </span>
          {item.impact}
        </p>

        <p className="text-xs font-black uppercase tracking-widest" style={{ color: item.color }}>
          Club Deportivo Real Sporting · Usme
        </p>
      </div>
    </div>
  );
}
