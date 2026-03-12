import { Bot, webhookCallback } from "grammy";
import { transliterate } from "./transliterate.js";

export interface Env {
  BOT_INFO: string;
  BOT_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

    bot.command("start", (ctx) =>
      ctx.reply(
        "გამარჯობა! 👋\n\n" +
          "Send me Georgian text in Latin letters and I'll convert it to Georgian script.\n\n" +
          "Example: gamarjoba → გამარჯობა\n" +
          "Example: rogor khar? → როგორ ხარ?",
      ),
    );

    bot.on("message:text", (ctx) => {
      const converted = transliterate(ctx.message.text);
      const escaped = converted.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
      const encoded = encodeURIComponent(converted);
      return ctx.reply(`\`${escaped}\``, {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Google Translate", url: `https://translate.google.com/?sl=ka&tl=ru&text=${encoded}` },
              { text: "Yandex Translate", url: `https://translate.yandex.com/?lang=ka-ru&text=${encoded}` },
            ],
          ],
        },
      });
    });

    return webhookCallback(bot, "cloudflare-mod")(request);
  },
};
