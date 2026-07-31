"use client";

import { useEffect, useState } from "react";

export function DayNightScrollIndicator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const interval = window.setInterval(updateNow, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timeLabel = now
    ? new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).format(now)
    : "--:--:--";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        background: "rgba(255,255,255,0.12)",
        color: "#fff",
        fontSize: "0.95rem",
        fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <time dateTime={now?.toISOString()}>{timeLabel}</time>
    </div>
  );
}
