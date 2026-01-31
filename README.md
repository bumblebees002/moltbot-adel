<p align="center">
  <img src="assets/moltbot-adel-banner.png" alt="Moltbot Adel" width="800" />
</p>

<h1 align="center">Moltbot Adel</h1>

<p align="center">
  Enhanced fork of <a href="https://github.com/openclaw/openclaw">OpenClaw</a> with a critical Telegram (Node.js 22+) network fix, security hardening guidance, and ready-to-copy config templates.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22%2B-green?logo=node.js" alt="Node.js 22+" />
  <img src="https://img.shields.io/badge/Telegram-IPv6%2FDNS%20fixed-blue?logo=telegram" alt="Telegram IPv6/DNS fixed" />
  <img src="https://img.shields.io/badge/Vector%20Memory-Enabled-purple" alt="Vector Memory Enabled" />
</p>

---

## What’s different in this fork

### 1) Telegram IPv6/DNS fix (Node.js 22+)
Node 22 often resolves IPv6 first; many networks have unreliable IPv6 to Telegram, causing `fetch failed` / `ConnectTimeoutError`.

This fork adds IPv4-first DNS order when Telegram’s `autoSelectFamily` is disabled:

- Code: `src/telegram/fetch.ts`
- Key line: `dns.setDefaultResultOrder("ipv4first")`

### 2) Safer defaults + templates
- Example config with placeholders (no secrets committed): `config.example.json`
- Vector memory enabled in the template
- Gateway bind recommended as `loopback`

---

## Quick start

```bash
# Clone

git clone https://github.com/bumblebees002/moltbot-adel.git
cd moltbot-adel

# Install
pnpm install

# Config
mkdir -p ~/.openclaw
cp config.example.json ~/.openclaw/openclaw.json
nano ~/.openclaw/openclaw.json
chmod 600 ~/.openclaw/openclaw.json

# Run gateway
pnpm openclaw gateway run --bind loopback --port 18789
```

---

## Documentation

- `PROJECT_CONTEXT.md` (fork-specific notes)
- Official docs: https://docs.openclaw.ai

---

## Security

Never commit:
- Telegram bot tokens
- API keys / base URLs
- Gateway auth tokens

Use placeholders in configs (this repo does).
