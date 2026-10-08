import { logger } from "../logger/logger";

export const validateAcestreamId = (id: string): string | null => {
  const regex = /^[a-f0-9]{40}$/;
  if (regex.test(id)) {
    return id;
  }

  logger.warn(`⚠️ ID Acestream non valido. Assicurati che sia una stringa esadecimale di 40 caratteri.`);
  return null;
};
