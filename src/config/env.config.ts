import { z } from "zod";
import { logger } from "../logger/logger";

const envSchema = z.object({
  BOT_TOKEN: z.string().trim().min(1),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  logger.error(`❌ Variabili d'ambiente non valide:\n${z.prettifyError(parsed.error)}`);
  process.exit(1);
}

export const env = parsed.data;
