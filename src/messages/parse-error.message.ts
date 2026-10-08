import type { ParseErrorReason } from "../types/build-acestream-link.types";

export const PARSE_ERROR_MESSAGES: Record<ParseErrorReason, string> = {
  "formato-non-valido": "⚠️ Formato non valido. Usa: <host> <id>",
  "host-non-valido": "⚠️ Host non valido.",
  "id-non-valido": "⚠️ ID non valido.",
};
