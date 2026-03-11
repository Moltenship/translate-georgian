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
      return ctx.reply(`\`${escaped}\``, { parse_mode: "MarkdownV2" });
    });

    return webhookCallback(bot, "cloudflare-mod")(request);
  },
};
