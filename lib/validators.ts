const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

const JUNK_PATTERNS = [
  /bjhbhjhj/i,
  /lñmñl/i,
  /hjh/i,
  /jhj/i,
  /jaja(?:ja){3,}/i,
  /asdf+/i,
  /qwe+/i,
  /qwerty/i,
  /1234+/i,
  /zxczx/i,
  /nmnm/i,
  /kjsj/i,
  /kkkk+/i,
  /llll+/i,
  /(?:[bcdfghjklmnpqrstvwxyzñ]{6,})/i,
  /(.)\1{5,}/i,
];

const MINIMUM_MEANINGFUL_LENGTH = 5;
const MAX_VISIBLE_TEXT_LENGTH = 180;

export const TRAINING_TEXT_PLACEHOLDER =
  "Detalles del entrenamiento en proceso de actualización...";

export const NEWS_TITLE_PLACEHOLDER = "Actualización oficial del club";

export const NEWS_TEXT_PLACEHOLDER =
  "Información en proceso de actualización por el equipo de comunicaciones.";

export function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"'\/]/g, (character) => HTML_ENTITY_MAP[character]);
}

export function sanitizeText(value: string): string {
  return escapeHtml(normalizeText(value));
}

export function normalizeVisibleText(value: string, maxLength = MAX_VISIBLE_TEXT_LENGTH): string {
  const cleaned = normalizeText(value);

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1).trim()}…`;
}

export function isLikelyJunkText(value: string): boolean {
  const text = normalizeText(value);

  if (text.length < MINIMUM_MEANINGFUL_LENGTH) {
    return true;
  }

  if (JUNK_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúüñ]/gi, '');

  if (normalized.length === 0) {
    return true;
  }

  const repeatedCharMatch = normalized.match(/(.)\1{4,}/i);
  if (repeatedCharMatch) {
    return true;
  }

  const vowelCount = (normalized.match(/[aeiouáéíóúü]/gi) || []).length;
  if (normalized.length >= 8 && vowelCount / normalized.length < 0.18) {
    return true;
  }

  const uniqueRatio = new Set(normalized).size / normalized.length;
  if (normalized.length >= 9 && uniqueRatio < 0.28) {
    return true;
  }

  return false;
}

export function sanitizeTextOrDefault(value: string, placeholder: string): string {
  const cleaned = sanitizeText(value);

  return cleaned && !isLikelyJunkText(cleaned) ? cleaned : placeholder;
}

export function sanitizeVisibleTextOrDefault(value: string, placeholder: string): string {
  const cleaned = normalizeVisibleText(value);

  return cleaned && !isLikelyJunkText(cleaned) ? cleaned : placeholder;
}

export function validateTextField(value: string, label: string): string {
  const cleaned = sanitizeText(value);

  if (!cleaned) {
    throw new Error(`El campo ${label} no puede estar vacío.`);
  }

  if (isLikelyJunkText(cleaned)) {
    throw new Error(`El campo ${label} contiene texto no válido.`);
  }

  return cleaned;
}

export function validateCleanTextField(value: string, label: string): string {
  const cleaned = normalizeVisibleText(value, 800);

  if (!cleaned) {
    throw new Error(`El campo ${label} no puede estar vacío.`);
  }

  if (isLikelyJunkText(cleaned)) {
    throw new Error(`El campo ${label} contiene texto no válido.`);
  }

  return escapeHtml(cleaned);
}

export function isReadableText(value: string, minLength = 3): boolean {
  const text = normalizeText(value);
  const letters = text.match(/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/g);

  return Boolean(letters && letters.length >= minLength && !isLikelyJunkText(text));
}

export function validateReadableText(value: string, label: string, minLength = 3): string {
  const cleaned = normalizeText(value);

  if (!cleaned || cleaned.length < minLength) {
    throw new Error(`El campo ${label} debe tener al menos ${minLength} caracteres.`);
  }

  if (!isReadableText(cleaned, minLength)) {
    throw new Error(`El campo ${label} debe contener texto legible.`);
  }

  return escapeHtml(cleaned);
}

export function validateTrainingTitle(value: string): string {
  const title = validateCleanTextField(value, "título");

  if (normalizeText(value).length < 5) {
    throw new Error("El título debe tener al menos 5 caracteres.");
  }

  return title;
}

export function validateTrainingDate(date: string): string {
  const clean = date.trim();

  if (!clean) {
    throw new Error("La fecha no puede estar vacía.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    throw new Error("La fecha no tiene un formato válido.");
  }

  const year = Number(clean.slice(0, 4));
  const currentYear = new Date().getFullYear();

  if (year < 2020 || year > currentYear + 1) {
    throw new Error(`El año debe estar entre 2020 y ${currentYear + 1}.`);
  }

  return clean;
}
