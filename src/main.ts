import { blockquote, bold, Bot, code, format, italic, underline, TelegramInlineKeyboardButton, TelegramParams, FormattableString } from "gramio";
import { logger } from "./logger/logger";
import { extractAcestreamId } from "./utility/extract-acestream-id.utility";
import { validateAcestreamId } from "./utility/validate-acestream-id.utility";
import { AcestreamUrl, AcestreamUrlKey } from "./enums/acestream-url.enum";

const BOT_TOKEN = process.env.BOT_TOKEN!;
const bot = new Bot(BOT_TOKEN);
const allowedUsers: number[] = [1045814971, 72274003];

// Avvia il bot
(async () => {
  try {
    await bot.start();
    logger.info("✅ Bot avviato con successo");
  } catch (error) {
    logger.error(`❌ Errore durante l'avvio del bot: ${(error as Error).message}`);
  }
})();

// Gestionre comando /start
bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id!;
  const name = ctx.from?.firstName!;
  const username = ctx.from?.username || "N/A";

  logger.info(`Bot avviato da: ${name} -  Username: ${username} - Telegram ID: ${telegramId}`);

  const message = format`
      👋 Hey ${name}

      ✨ I'm a bot that helps you to generate an Acestream Link ✨

        ${underline("📚 How to use me:")}
        🔹 Send me an ID or URL
        🔹 Select the Host where Acestream engine is running
        🔹 I will reply with the correct URL

      ${bold("Input example:")}
      ${code("acestream://251b0f9b25ad33a24a330be58d10ce20474c6460")}
      ${italic("or")}
      ${code("http://127.0.0.1:6878/ace/getstream?id=f2df4f96b23388b45e75d848a48a510cf8af560f")}
      ${italic("or")}
      ${code("f2df4f96b23388b45e75d848a48a510cf8af560f")}

      ${underline("❗️ Note:")}
      ${italic("I don't host or provide any Acestream content, I only help you to generate the correct URL.")}

      ${blockquote(`⚠️ For more information contact the developer:\n@m1keehrmantraut`)}
    `;
  await ctx.reply(message);
});

// Gestione messaggi di testo
bot.on("message", async (ctx) => {
  const telegramId = ctx.from?.id!;
  if (!allowedUsers.includes(telegramId)) return await ctx.reply(`❌ You aren't allowed to use this bot.`);

  try {
    const rawMessage = ctx.text;
    if (!rawMessage) return;
    const message = rawMessage.toLowerCase().trim();
    const extractedId = extractAcestreamId(message);
    const validatedAcestreamId = validateAcestreamId(extractedId);
    if (!validatedAcestreamId) {
      return await ctx.reply(`⚠️ Invalid Acestream ID.`);
    }
    const inlineKeyboard: TelegramInlineKeyboardButton[][] = [
      [
        { text: "🏡 Home", callback_data: `${AcestreamUrlKey.HOME}:${validatedAcestreamId}` },
        { text: "🏢 Server", callback_data: `${AcestreamUrlKey.SERVER}:${validatedAcestreamId}` },
      ],
    ];
    const replyOptions: Partial<TelegramParams.SendMessageParams> = { reply_markup: { inline_keyboard: inlineKeyboard } };
    const replyMessage = format`${blockquote(format`${bold`${underline("SELEZIONA HOST")}`}\n\n🆔 ${italic("Acestream")}:\n${code(validatedAcestreamId)}`)}`;
    await ctx.reply(replyMessage, { ...replyOptions });
  } catch (error) {
    const defaultMessage = `❌ An error occurred. Please try again.`;
    logger.error(`❌ Error: ${(error as Error).message}`);
    await ctx.reply(code`${defaultMessage}`);
  }
});

// Gestione Callback
bot.callbackQuery<RegExp>(/^.+$/, async (ctx) => {
  await ctx.answerCallbackQuery(); // Stop animation of the button
  const data = ctx.update?.callback_query?.data;
  const [callbackKey, acestreamId] = data?.split(":") || [];
  let message: FormattableString;
  switch (callbackKey) {
    case AcestreamUrlKey.HOME:
      message = format`${bold(format`${underline("🏡 Home")}`)}\n${code(AcestreamUrl.HOME + acestreamId)}`;
      break;

    case AcestreamUrlKey.SERVER:
      message = format`${bold(format`${underline("🏢 Server")}`)}\n${code(AcestreamUrl.SERVER + acestreamId)}`;
      break;

    default:
      message = format`${code("N/A")}`;
      break;
  }
  await ctx.send(message);
});
