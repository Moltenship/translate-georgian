import "dotenv/config";
import { Bot } from "grammy";
import { transliterate } from "./transliterate.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Missing BOT_TOKEN environment variable. Copy .env.example to .env and set your token.");
  process.exit(1);
}

const bot = new Bot(token);

bot.command("start", (ctx) =>
  ctx.reply(
    "გამარჯობა! 👋\n\n" +
    "Send me Georgian text in Latin letters and I'll convert it to Georgian script.\n\n" +
    "Example: gamarjoba → გამარჯობა\n" +
    "Example: rogor khar? → როგორ ხარ?"
  )
);

bot.on("message:text", (ctx) => {
  const converted = transliterate(ctx.message.text);
  return ctx.reply(converted);
});

bot.start();
console.log("Bot is running...");
