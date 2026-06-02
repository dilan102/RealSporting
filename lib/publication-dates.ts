const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayDateKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
  }).format(now);
}

export function dateFromInput(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function dateToInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const date = dateFromInput(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return dateToInputValue(date);
}

export function defaultEndDateFromStart(startDate: string, days = 30) {
  return addDaysToDateKey(startDate, days);
}

export function validateDateKey(value: string, label: string) {
  const date = value.trim();

  if (!date) {
    throw new Error(`La ${label} no puede estar vacía.`);
  }

  if (!DATE_KEY_PATTERN.test(date)) {
    throw new Error(`La ${label} no tiene un formato válido.`);
  }

  return date;
}

export function validatePublicationDateRange(startDate: string, endDate: string) {
  const start = validateDateKey(startDate, "fecha de inicio");
  const end = validateDateKey(endDate, "fecha de fin");

  if (end < start) {
    throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
  }

  return { startDate: start, endDate: end };
}

/** true cuando hoy (Bogotá) es igual o posterior a la fecha de fin. */
export function hasReachedEndDate(endDate: string | null | undefined, now = new Date()) {
  if (!endDate) {
    return false;
  }

  return getTodayDateKey(now) >= endDate;
}

export function endDateCutoffForQuery(now = new Date()) {
  return dateFromInput(getTodayDateKey(now));
}

export function formatPublicationRange(startDate: string, endDate: string) {
  const start = dateFromInput(startDate);
  const end = dateFromInput(endDate);
  const formatter = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  if (startDate === endDate) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}
