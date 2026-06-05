"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

const DAY_START_MINUTES = 6 * 60;
const NIGHT_START_MINUTES = 18 * 60;
const HALF_DAY_MINUTES = 12 * 60;

function getTimeState(date: Date) {
  const minutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  const isDay = minutes >= DAY_START_MINUTES && minutes < NIGHT_START_MINUTES;
  const arcProgress = isDay
    ? (minutes - DAY_START_MINUTES) / HALF_DAY_MINUTES
    : minutes >= NIGHT_START_MINUTES
      ? (minutes - NIGHT_START_MINUTES) / HALF_DAY_MINUTES
      : (minutes + DAY_START_MINUTES) / HALF_DAY_MINUTES;
  const height = Math.sin(Math.PI * arcProgress);

  return {
    isDay,
    arcProgress: Number(arcProgress.toFixed(4)),
    height: Number(height.toFixed(4)),
  };
}

export function DayNightScrollIndicator() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    updateNow();
    const interval = window.setInterval(updateNow, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timeState = getTimeState(now ?? new Date(2026, 0, 1, 0, 0, 0));
  const timeLabel = now
    ? new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(now)
    : "--:--";
  const dateLabel = now
    ? new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
        .format(now)
        .replace(".", "")
    : "-- ---";
  const clockStyle = useMemo(
    () =>
      ({
        "--day-progress": timeState.isDay ? 1 : 0,
        "--sun-arc": timeState.isDay ? timeState.arcProgress : 0,
        "--sun-height": timeState.isDay ? timeState.height : 0,
        "--moon-arc": timeState.isDay ? 0 : timeState.arcProgress,
        "--moon-height": timeState.isDay ? 0 : timeState.height,
      }) as CSSProperties,
    [timeState.arcProgress, timeState.height, timeState.isDay],
  );

  return (
    <div className="day-night-widget" style={clockStyle}>
      <div className="day-night-indicator" aria-hidden="true">
        <span className="day-night-sun" />
        <span className="day-night-moon">
          <span />
          <span />
          <span />
        </span>
        <span className="day-night-stars">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} />
          ))}
        </span>
        <span className="day-night-water" />
      </div>
      <time className="day-night-clock" dateTime={now?.toISOString()}>
        <span>{timeLabel}</span>
        <span>{dateLabel}</span>
      </time>
    </div>
  );
}
