<p align="center">
  <img src="assets/clawbot-enhanced-banner.png" alt="Clawbot Enhanced" width="600">
</p>

<h1 align="center">🤖 Clawbot Enhanced</h1>

<p align="center">
  <strong>An enhanced fork of OpenClaw with critical bug fixes and security hardening</strong>
</p>

<p align="center">
  <a href="#-whats-enhanced">What's Enhanced</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-configuration">Configuration</a> •
  <a href="#-troubleshooting">Troubleshooting</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22%2B-green?logo=node.js" alt="Node.js 22+">
  <img src="https://img.shields.io/badge/Telegram-Fixed-blue?logo=telegram" alt="Telegram Fixed">
  <img src="https://img.shields.io/badge/Security-Hardened-red?logo=shield" alt="Security Hardened">
  <img src="https://img.shields.io/badge/Vector%20Memory-Enabled-purple" alt="Vector Memory">
</p>

---

## 🎯 What's Enhanced

This fork of [OpenClaw](https://github.com/openclaw/openclaw) includes critical improvements:

| Feature | Original | This Fork |
|---------|----------|-----------|
| **Telegram IPv6/DNS Fix** | ❌ Broken on Node.js 22+ | ✅ **Fixed** |
| **Security Hardening** | Manual setup | ✅ **ClawdGuard ready** |
| **Vector Memory** | Disabled by default | ✅ **Enabled** |
| **Config Templates** | Basic examples | ✅ **Production-ready** |
| **Documentation** | Technical | ✅ **User-friendly** |

### 🔧 The Telegram Fix

**Problem:** On Node.js 22+, Telegram API calls fail with "fetch failed" or "ConnectTimeoutError" because Node.js now returns IPv6 addresses first, and many networks don't have working IPv6 to Telegram's servers.

**Solution:** This fork adds `dns.setDefaultResultOrder("ipv4first")` to force IPv4 DNS resolution, fixing the issue for everyone.

```typescript
// src/telegram/fetch.ts - The fix
dns.setDefaultResultOrder("ipv4first");
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 22+** (required)
- **pnpm** (package manager)
- **Docker** (optional, for security scanning)

### Installation

```bash
# Clone this repository
git clone https://github.com/bumblebees002/clawbot-enhanced.git
cd clawbot-enhanced

# Install dependencies
pnpm install

# Copy example config
mkdir -p ~/.openclaw
cp config.example.json ~/.openclaw/openclaw.json

# Edit config with your credentials
nano ~/.openclaw/openclaw.json

# Set secure permissions
chmod 600 ~/.openclaw/openclaw.json

# Start the gateway
pnpm openclaw gateway run --bind loopback --port 18789
```

### Setting Up Telegram

1. Create a bot with [@BotFather](https://t.me/BotFather) on Telegram
2. Copy the bot token
3. Add to your config:
```json
{
  "channels": {
    "telegram": {
      "token": "YOUR_BOT_TOKEN_HERE"
    }
  }
}
```

### Setting Up Your LLM Provider

Add your API provider (OpenAI, Anthropic, or any OpenAI-compatible API):

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "apiKey": "sk-your-api-key",
        "models": [{"id": "gpt-4o"}]
      }
    }
  }
}
```

---

## ✨ Features

### 🧠 Vector Memory (Enabled by Default)

Semantic search over your conversation history for better context recall:

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "query": {
          "hybrid": {
            "enabled": true,
            "vectorWeight": 0.7,
            "textWeight": 0.3
          }
        }
      }
    }
  }
}
```

### 🔒 Security Hardening

**ClawdGuard Integration:**
```bash
# Install ClawdGuard
git clone https://github.com/fadidevv/clawdguard.git
cd clawdguard && docker build -t clawdguard .

# Run security scan
docker run -v ~/.openclaw:/root/.moltbot clawdguard --scan-only
```

**Security Checklist:**
- ✅ Generate secure gateway token: `openssl rand -base64 24`
- ✅ Set file permissions: `chmod 600 ~/.openclaw/openclaw.json`
- ✅ Keep gateway bound to loopback
- ✅ Never commit API keys to git

### 📡 Multi-Channel Support

- **Telegram** (with IPv6 fix)
- **Discord**
- **Slack**
- **Signal**
- **iMessage**
- **WhatsApp Web**

---

## ⚙️ Configuration

See [`config.example.json`](config.example.json) for a complete template.

### Generate Secure Gateway Token

```bash
openssl rand -base64 24
# Example output: 6LYRX9ByZosqLvBi574aGnEOj1HxPBWY
```

### Minimal Working Config

```json
{
  "gateway": {
    "bind": "loopback",
    "auth": {"token": "YOUR_SECURE_TOKEN"}
  },
  "channels": {
    "telegram": {
      "token": "YOUR_BOT_TOKEN",
      "network": {"autoSelectFamily": false}
    }
  },
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "apiKey": "YOUR_API_KEY",
        "models": [{"id": "gpt-4o"}]
      }
    }
  }
}
```

---

## 🔍 Troubleshooting

### Telegram Not Responding

**Already fixed in this fork!** If you're still having issues:

1. Verify config has the network setting:
```json
"telegram": {
  "network": {"autoSelectFamily": false}
}
```

2. Restart gateway:
```bash
pkill -9 -f openclaw-gateway
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

3. Check logs:
```bash
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

### Gateway Won't Start

```bash
# Check if port is in use
lsof -i :18789

# Kill existing process
pkill -9 -f openclaw-gateway
```

### Config Validation Errors

**Invalid keys (not supported in 2026.1.29):**
- ❌ `heartbeat` at root level
- ❌ `memorySearch.query.chunkSize`
- ❌ `memorySearch.sessionTranscripts`

Use only the keys shown in `config.example.json`.

---

## 📚 Documentation

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - Full technical documentation
- [Original OpenClaw Docs](https://docs.openclaw.ai) - Upstream documentation
- [ClawdGuard](https://github.com/fadidevv/clawdguard) - Security scanner

---

## 🤝 Contributing

### Submit the IPv6 Fix Upstream

This fix should be merged into the main OpenClaw repository:

1. Fork `openclaw/openclaw`
2. Apply changes from `src/telegram/fetch.ts`
3. Create PR: "fix(telegram): Add IPv4-first DNS resolution for Node.js 22+"

### Report Issues

Please include:
- Node.js version: `node --version`
- OpenClaw version: `pnpm openclaw --version`
- Relevant log output
- Config (with secrets removed)

---

## 📜 License

This project is a fork of [OpenClaw](https://github.com/openclaw/openclaw) and maintains the same license.

## 🙏 Credits

- **Original Project:** [OpenClaw](https://github.com/openclaw/openclaw) by Peter Steinberger (@steipete)
- **IPv6/DNS Fix:** Md Adel (@bumblebees002)
- **Security Integration:** [ClawdGuard](https://github.com/fadidevv/clawdguard) by fadidevv

---

<p align="center">
  <strong>⭐ Star this repo if the Telegram fix helped you!</strong>
</p>
