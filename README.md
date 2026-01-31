<p align="center">
  <img src="assets/moltbot-adel-banner.png" alt="Moltbot Adel banner" width="100%" />
</p>

<h1 align="center">Moltbot Adel</h1>

<p align="center">
  A polished, deployment-ready fork of <a href="https://github.com/openclaw/openclaw">OpenClaw</a> with a <strong>critical Telegram reliability fix</strong> for Node.js 22+, plus safer defaults and copy‑pasteable config templates.
</p>

<p align="center">
  <a href="https://github.com/bumblebees002/moltbot-adel/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/bumblebees002/moltbot-adel?style=for-the-badge" /></a>
  <a href="https://github.com/bumblebees002/moltbot-adel/forks"><img alt="Forks" src="https://img.shields.io/github/forks/bumblebees002/moltbot-adel?style=for-the-badge" /></a>
  <a href="https://github.com/bumblebees002/moltbot-adel/issues"><img alt="Issues" src="https://img.shields.io/github/issues/bumblebees002/moltbot-adel?style=for-the-badge" /></a>
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22%2B-2ea043?style=for-the-badge&logo=node.js&logoColor=white" />
  <img alt="Telegram" src="https://img.shields.io/badge/Telegram-stable-1d9bf0?style=for-the-badge&logo=telegram&logoColor=white" />
</p>

<p align="center">
  <strong>✅ No secrets committed.</strong> Uses placeholders for API keys, base URLs, and tokens.
</p>

---

## ⚡ Highlights

- ✅ <strong>Telegram works reliably on Node.js 22+</strong> (fixes IPv6/DNS timeout issues)
- ✅ <strong>Config template included</strong> (safe placeholders only)
- ✅ <strong>Vector memory enabled in template</strong> (hybrid search tuned)
- ✅ <strong>Security hardening guidance</strong> (permissions, localhost bind, strong tokens)
- ✅ <strong>Clone on any server</strong> and get the same behavior — just add your own credentials

---

## 📌 Table of contents

- [What this repo is](#-what-this-repo-is)
- [What’s improved](#-whats-improved)
- [Quick start](#-quick-start)
- [Configuration](#-configuration)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Docs](#-docs)
- [Credits](#-credits)

---

## 🎯 What this repo is

This repository contains the full upstream OpenClaw codebase <em>plus</em> the improvements made for your setup.

If you clone this repo on a new server, you get:
- the same OpenClaw features
- the Telegram fix already merged
- ready templates and docs

…but you still must add your own:
- Telegram bot token
- LLM API key
- LLM base URL (if needed)

---

## 🚀 What’s improved

### 1) Telegram IPv6/DNS fix (Node.js 22+) — <strong>critical</strong>

**Symptoms**
- Telegram bot doesn’t reply
- logs show `fetch failed` / `ConnectTimeoutError`

**Root cause (common)**
- Node.js 22 often resolves IPv6 first
- many networks advertise IPv6 but have unreliable IPv6 routing to Telegram

**Fix included in this fork**
- File: `src/telegram/fetch.ts`
- When Telegram’s `autoSelectFamily` is disabled, we force DNS resolution order:

```ts
// src/telegram/fetch.ts
// when autoSelectFamily=false
// prefer IPv4 DNS results to avoid broken IPv6 routes

dns.setDefaultResultOrder("ipv4first");
```

### 2) Safe config template (no secrets)

Copy this file and edit your own values:
- `config.example.json`

This repo intentionally does <strong>not</strong> include real:
- API keys
- base URLs
- tokens

### 3) Vector memory enabled in the template

`config.example.json` enables memory search with a hybrid configuration (vector + text) for better recall.

### 4) Security hardening guidance

Recommended basics:
- gateway bind: `loopback`
- strong gateway auth token
- strict config permissions: `chmod 600 ~/.openclaw/openclaw.json`

---

## 🏁 Quick start

### Prerequisites
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

## ⚙️ Configuration

### Telegram
Create a bot with @BotFather, then set:

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
OpenAI example:

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

OpenAI-compatible provider example:

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

## 🔒 Security

### Never commit secrets
Do **not** commit:
- LLM API keys
- LLM base URLs (if private)
- Telegram bot token
- gateway token

This repo keeps templates safe and uses placeholders.

### Recommended gateway config

```json
{
  "gateway": {
    "bind": "loopback",
    "auth": {
      "token": "YOUR_SECURE_GATEWAY_TOKEN"
    }
  }
}
```

Generate a secure token:

```bash
openssl rand -base64 24
```

---

## 🧯 Troubleshooting

### Telegram doesn’t respond

```bash
# restart gateway
pkill -9 -f openclaw-gateway || true
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

### Config errors
If config fails validation, remove unknown keys and stick to `config.example.json` shape.

---

## 📚 Docs

- `PROJECT_CONTEXT.md` — fork-specific technical notes
- `FORK_README.md` — original fork writeup (older naming)
- Official docs: https://docs.openclaw.ai

---

## 🙏 Credits

- Upstream: OpenClaw — https://github.com/openclaw/openclaw
- This fork: Moltbot Adel — https://github.com/bumblebees002/moltbot-adel
