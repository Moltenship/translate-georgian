# Georgian Transliteration Bot

Telegram bot that converts Georgian text written in Latin transliteration into proper Georgian script.

## What it does

The bot listens for messages containing Latin-script Georgian and replies with the converted Mkhedruli script. The output is formatted as inline code for easy tap-to-copy.

Username: @translate_georgian_eng_bot
URL: https://tr-bot.moltenship.workers.dev/

Examples:
- gamarjoba → `გამარჯობა`
- rogor khar? → `როგორ ხარ?`
- saqartvelo → `საქართველო`

## Transliteration Rules

The engine uses a longest-match-first strategy to prioritize digraphs over single characters. It supports both the official BGN/PCGN 2009 national system and informal chat-style shortcuts.

### Mapping Summary

| Category | Patterns | Georgian |
|----------|----------|----------|
| Vowels | a, e, i, o, u | ა, ე, ი, ო, უ |
| Consonants | b, g, d, v, z, l, m, n, r, s, j, h | ბ, გ, დ, ვ, ზ, ლ, მ, ნ, რ, ს, ჯ, ჰ |
| Digraphs | sh, zh/jh, ch, kh, gh, ts, dz, th, ph | შ, ჟ, ჩ, ხ, ღ, ც, ძ, თ, ფ |
| Ejectives | t', k', p', ch', ts', q' | ტ, კ, პ, ჭ, წ, ყ |
| Shortcuts | x (ხ), w (წ), y/q (ყ), c (ც) | ხ, წ, ყ, ც |

### Notable Rules
- **Apostrophe Normalization**: Modifier letters and curly quotes (’, ‘, `, ´) are normalized to standard ASCII apostrophes before processing.
- **Case Handling**: Supports uppercase and mixed-case patterns (e.g., SH, Sh, sh all map to შ).
- **Longest Match**: Patterns like "tsch" or "ch'" are matched before single characters to ensure correct conversion of complex sounds.
- **Georgian Passthrough**: If a message is already predominantly in Georgian script, the bot returns it unchanged.

## Tech Stack
- **grammY**: Telegram Bot Framework
- **Cloudflare Workers**: Serverless execution environment
- **TypeScript**: Type-safe development
- **Vitest**: Unit testing framework

## Setup & Deployment

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configuration
Create a bot via @BotFather to obtain a bot token.

For local development, use `wrangler dev`.

### 3. Deployment
Set the bot token secret in Cloudflare:
```bash
wrangler secret put BOT_TOKEN
```

Deploy the worker:
```bash
npm run deploy
```

### 4. Webhook Setup
Configure the Telegram webhook to point to your deployment:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://tr-bot.moltenship.workers.dev/"
```

## Testing
Run the Vitest suite:
```bash
npm test
```

## License
MIT
