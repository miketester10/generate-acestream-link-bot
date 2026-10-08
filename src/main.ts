import { blockquote, bold, Bot, code, format, italic, underline } from "gramio";
import { logger } from "./logger/logger";
import { buildStartMessage } from "./messages/start.message";
import { PARSE_ERROR_MESSAGES } from "./messages/parse-error.message";
import { buildAcestreamLink } from "./utility/build-acestream-link.utility";
import { env } from "./config/env.config";

const bot = new Bot(env.BOT_TOKEN);

// Avvia il bot
(async () => {
  try {
    await bot.start();
    logger.info("✅ Bot avviato con successo");
  } catch (error) {
    logger.error(`❌ Errore durante l'avvio del bot: ${(error as Error).message}`);
  }
})();

// Gestione comando /start
bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id!;
  const name = ctx.from?.firstName!;
  const username = ctx.from?.username || "N/A";

  logger.info(`Bot avviato da: ${name} - Username: ${username} - Telegram ID: ${telegramId}`);

  await ctx.reply(buildStartMessage(name));
});

// Gestione messaggi di testo
bot.on("message", async (ctx) => {
  try {
    const rawMessage = ctx.text;
    if (!rawMessage) return;
    const result = buildAcestreamLink(rawMessage);
    if (!result.ok) {
      logger.warn(`Richiesta scartata: ${result.reason}`);
      return await ctx.reply(PARSE_ERROR_MESSAGES[result.reason]);
    }

    const replyMessage = format`
      ${blockquote(format`${bold`${underline("🔗 LINK ACESTREAM")}`}\n
      🖥️ ${italic("Host")}:\n${code(result.host)}\n
      🆔 ${italic("Acestream")}:\n${code(result.id)}\n
      🔗 ${italic("Link")}:\n${code(result.link)}`)}`;
    await ctx.reply(replyMessage);
  } catch (error) {
    logger.error(`❌ Errore: ${(error as Error).message}`);
    await ctx.reply(`❌ Errore. Riprova.`);
  }
});
