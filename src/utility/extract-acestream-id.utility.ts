import { logger } from "../logger/logger";

export const extractAcestreamId = (message: string): string => {
  // Caso 1: link Acestream (esempio: acestream://<ID>)
  if (message.startsWith("acestream://")) {
    return message.slice("acestream://".length);
  }

  // Caso 2: URL con parametro id (esempio: http://127.0.0.1:6878/ace/getstream?id=<ID>)
  try {
    const parsedUrl = new URL(message);
    const id = parsedUrl.searchParams.get("id");
    if (id) return id;
  } catch {
    logger.debug("Not a valid URL. Continuing...");
  }

  return message;
};
