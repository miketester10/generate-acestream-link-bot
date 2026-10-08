import { z } from "zod";
import type { ParseResult } from "../types/build-acestream-link.types";

// Il messaggio deve contenere esattamente due valori: "<host> <id>".
// Il secondo valore accetta tre forme: ID diretto, link acestream:// o URL con ?id=.
// Funzione pura: non logga e non parla con Telegram, restituisce o i dati pronti o il motivo dello scarto.

const ACESTREAM_SCHEME_PREFIX = "acestream://";
const DEFAULT_ACESTREAM_PORT = "6878";

const hostSchema = z
  .string()
  .trim()
  .min(1)
  .transform((raw) => normalizeHost(raw));

// L'ID Acestream è una stringa di 40 caratteri esadecimali minuscoli (0-9, a-f).
const acestreamIdSchema = z.string().regex(/^[a-f0-9]{40}$/);

// Divide il messaggio in parole, trattando spazi, a capo, virgole e punti e virgola come separatori.
const splitMessage = (message: string): string[] => {
  const normalized = message
    .toLowerCase()
    .trim()
    .replaceAll(",", " ")
    .replaceAll(";", " ")
    .replaceAll("\n", " ")
    .replaceAll("\t", " ");
  return normalized.split(" ").filter((part) => part !== "");
};

// Normalizza l'host in "protocollo://nome:porta/ace/getstream?id=", porta 6878 se assente.
// Restituisce null se l'host non è un URL http(s) valido.
const normalizeHost = (input: string): string | null => {
  const urlText = input.includes("://") ? input : `http://${input}`;
  if (!URL.canParse(urlText)) return null;
  const parsedUrl = new URL(urlText);
  const isHttp = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  if (!isHttp) return null;
  const port = parsedUrl.port === "" ? DEFAULT_ACESTREAM_PORT : parsedUrl.port;
  return `${parsedUrl.protocol}//${parsedUrl.hostname}:${port}/ace/getstream?id=`;
};

// Estrae l'ID grezzo dal secondo valore: link acestream://, parametro ?id= di un URL o ID diretto.
const extractRawId = (value: string): string => {
  if (value.startsWith(ACESTREAM_SCHEME_PREFIX)) return value.slice(ACESTREAM_SCHEME_PREFIX.length);
  if (URL.canParse(value)) {
    const idParam = new URL(value).searchParams.get("id");
    if (idParam !== null && idParam !== "") return idParam;
  }
  return value;
};

export const buildAcestreamLink = (message: string): ParseResult => {
  const parts = splitMessage(message);
  if (parts.length !== 2) return { ok: false, reason: "formato-non-valido" };

  const rawHost = parts[0];
  const rawId = parts[1];
  if (rawHost === undefined || rawId === undefined)
    return { ok: false, reason: "formato-non-valido" };

  const hostParsed = hostSchema.safeParse(rawHost);
  const baseLink = hostParsed.success ? hostParsed.data : null;
  if (baseLink === null) return { ok: false, reason: "host-non-valido" };

  const idParsed = acestreamIdSchema.safeParse(extractRawId(rawId));
  if (!idParsed.success) return { ok: false, reason: "id-non-valido" };

  return { ok: true, host: baseLink, id: idParsed.data, link: `${baseLink}${idParsed.data}` };
};
