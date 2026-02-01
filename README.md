<p align="center">
  <img src="assets/moltbot-adel-banner.png" alt="Moltbot Adel banner" width="100%" />
</p>

# Moltbot Adel

This is my fork of [OpenClaw](https://github.com/openclaw/openclaw).

I made it mainly because my Telegram bot was randomly not replying on Node.js 22+ (timeouts / `fetch failed`). I fixed that in code and then wrote down the exact setup I’m using so I can clone it on another server later.

---

## What’s inside this fork

### 1) Telegram reliability fix (Node.js 22+)

On some networks, Node.js prefers IPv6 DNS results first, but IPv6 routing to Telegram can be unreliable. The result is Telegram API calls timing out.

I fixed it by forcing IPv4-first DNS order when Telegram networking has `autoSelectFamily` disabled.

- Code: `src/telegram/fetch.ts`
- Key line: `dns.setDefaultResultOrder("ipv4first")`

### 2) Copy/paste config template

There’s a safe config template here:

- `config.example.json`

It uses placeholders (you must add your own Telegram token + API keys in your own local config file).

### 3) Vector memory enabled in the template

The template enables memory search with a hybrid setup (vector + text) because it improves recall a lot.

### 4) Basic security defaults

Nothing fancy, just the basics that helped me:

- bind gateway to localhost (`loopback`)
- use a strong gateway token
- keep config file permissions tight (`chmod 600`)

---

## Quick start (new machine)

### Requirements

- Node.js 22+
- pnpm

### Install

```bash
git clone https://github.com/bumblebees002/moltbot-adel.git
cd moltbot-adel
pnpm install

mkdir -p ~/.openclaw
cp config.example.json ~/.openclaw/openclaw.json
nano ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/openclaw.json

pnpm openclaw gateway run --bind loopback --port 18789
```

---

## Config notes

### Telegram

Create a bot with @BotFather and put the token in your config:

```json
{
  "channels": {
    "telegram": {
      "token": "YOUR_TELEGRAM_BOT_TOKEN_FROM_BOTFATHER",
      "network": {
        "autoSelectFamily": false
      }
    }
  }
}
```

### LLM provider

Example (OpenAI):

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "apiKey": "YOUR_OPENAI_API_KEY",
        "models": [{ "id": "gpt-4o" }]
      }
    }
  }
}
```

Example (OpenAI-compatible):

```json
{
  "models": {
    "providers": {
      "custom": {
        "baseUrl": "https://api.your-provider.com/v1",
        "apiKey": "YOUR_CUSTOM_API_KEY",
        "models": [
          {
            "id": "your-model-id",
            "compat": { "supportsDeveloperRole": false }
          }
        ]
      }
    }
  }
}
```

---

## Troubleshooting

### Telegram still not replying

Restart the gateway:

```bash
pkill -9 -f openclaw-gateway || true
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

---

## Extra docs

- `PROJECT_CONTEXT.md` (more details about what changed and why)
- `FORK_README.md` (older notes from earlier naming)
- Official docs: https://docs.openclaw.ai

---

## Credits

- Upstream project: OpenClaw — https://github.com/openclaw/openclaw
