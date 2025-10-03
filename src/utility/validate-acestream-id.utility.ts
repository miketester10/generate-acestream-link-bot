import { logger } from "../logger/logger";

export const validateAcestreamId = (id: string): string | null => {
  const regex = /^[a-f0-9]{40}$/;
  if (regex.test(id)) {
    return id;
  }

  logger.warn(`⚠️ Invalid Acestream ID. Please ensure it is a 40-character hexadecimal string.`);
  return null;
};
