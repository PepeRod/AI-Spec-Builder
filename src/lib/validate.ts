const HTML_TAG_RE = /<[^>]*>/g;
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const MAX_IDEA_LENGTH = 2000;

export function sanitize(value: string): string {
  return value.replace(HTML_TAG_RE, "").replace(CONTROL_CHAR_RE, "");
}

export function validateIdea(value: string): string | null {
  if (!value || !value.trim()) {
    return "La descripción del proyecto no puede estar vacía.";
  }
  if (value.trim().length > MAX_IDEA_LENGTH) {
    return `La descripción del proyecto no puede superar los ${MAX_IDEA_LENGTH} caracteres.`;
  }
  return null;
}
