export type ParseErrorReason = "formato-non-valido" | "host-non-valido" | "id-non-valido";

export type ParseResult =
  | { ok: true; host: string; id: string; link: string }
  | { ok: false; reason: ParseErrorReason };
