# OpenClaw Enhanced - Project Context Document

**Last Updated:** January 31, 2026
**Version:** 2026.1.29
**Maintainer:** Md Adel (@bumblebees002)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [What's Enhanced](#whats-enhanced)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Bug Fixes Applied](#bug-fixes-applied)
6. [Security Hardening](#security-hardening)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

---

## 1. Project Overview

### What is OpenClaw?
OpenClaw (formerly Clawbot, then Moltbot) is an open-source personal AI assistant created by **Peter Steinberger (@steipete)**. It's one of the most popular AI assistant projects with:
- **113k+ GitHub stars**
- **16k+ forks**
- **339+ contributors**

### Why This Fork?
This enhanced fork includes:
- ✅ **Critical Telegram IPv6/DNS fix** for Node.js 22+
- ✅ **Security hardening** with ClawdGuard integration
- ✅ **Vector memory** enabled by default
- ✅ **Ready-to-deploy** configuration templates

### Naming History
1. **Clawbot** (November 2025) - Original name
2. **Moltbot** - Renamed after Anthropic's cease & desist
3. **OpenClaw** (Current) - Final name

### Repositories
- **Original:** https://github.com/openclaw/openclaw
- **This Fork:** https://github.com/bumblebees002/clawbot-enhanced

---

## 2. What's Enhanced

| Feature | Original OpenClaw | This Fork |
|---------|-------------------|-----------|
| Telegram IPv6/DNS Fix | ❌ Not included | ✅ Fixed |
| Security Hardening | Manual | ✅ ClawdGuard ready |
| Vector Memory | Optional | ✅ Enabled by default |
| Config Templates | Basic | ✅ Production-ready |
| Documentation | Technical | ✅ User-friendly |

---

## 3. Installation

### Prerequisites
- Node.js 22+ (required)
- pnpm (package manager)
- Docker (optional, for security scanning)

### Quick Start

```bash
# Clone this repository
git clone https://github.com/bumblebees002/clawbot-enhanced.git
cd clawbot-enhanced

# Install dependencies
pnpm install

# Copy example config
cp config.example.json ~/.openclaw/openclaw.json

# Edit config with your credentials
nano ~/.openclaw/openclaw.json

# Start the gateway
pnpm openclaw gateway run --bind loopback --port 18789
```

### Setting Up Telegram Bot

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Add to config:
```json
{
  "channels": {
    "telegram": {
      "token": "YOUR_BOT_TOKEN_HERE"
    }
  }
}
```

### Setting Up LLM Provider

Add your API provider to config:
```json
{
  "models": {
    "providers": {
      "your-provider": {
        "baseUrl": "https://api.your-provider.com/v1",
        "apiKey": "YOUR_API_KEY_HERE",
        "models": [{
          "id": "your-model-id"
        }]
      }
    }
  }
}
```

---

## 4. Configuration

### Example Configuration (config.example.json)

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
            "textWeight": 0.3,
            "candidateMultiplier": 4
          }
        }
      }
    }
  },
  "gateway": {
    "bind": "loopback",
    "auth": {
      "token": "GENERATE_A_SECURE_TOKEN_HERE"
    }
  },
  "channels": {
    "telegram": {
      "token": "YOUR_TELEGRAM_BOT_TOKEN",
      "network": {
        "autoSelectFamily": false
      }
    }
  },
  "models": {
    "providers": {
      "your-provider": {
        "baseUrl": "https://api.your-provider.com/v1",
        "apiKey": "YOUR_API_KEY",
        "models": [{
          "id": "your-model-id"
        }]
      }
    }
  }
}
```

### Generate Secure Gateway Token

```bash
# Generate a secure random token
openssl rand -base64 24
```

---

## 5. Bug Fixes Applied

### 5.1 Telegram IPv6/DNS Connectivity Fix (CRITICAL)

**Problem:** Telegram API calls failing with "fetch failed" / "ConnectTimeoutError" on Node.js 22+

**Root Cause:**
1. Node.js 22 returns IPv6 addresses first in DNS resolution
2. Many networks have IPv6 advertised but not working reliably to Telegram's servers
3. Result: 10-second timeouts on every Telegram API call

**Solution Applied in `src/telegram/fetch.ts`:**

```typescript
import * as dns from "node:dns";

// When autoSelectFamily is disabled, also force IPv4-first DNS resolution
if (decision.value === false && !appliedIpv4First) {
  if (typeof dns.setDefaultResultOrder === "function") {
    try {
      dns.setDefaultResultOrder("ipv4first");
      appliedIpv4First = true;
      log.info("telegram: dns.setDefaultResultOrder=ipv4first");
    } catch {
      // ignore if unsupported
    }
  }
}
```

**Impact:**
- ✅ Fixes Telegram for ALL Node.js 22+ users
- ✅ Safe change - only applies when autoSelectFamily is disabled
- ✅ No configuration needed - works automatically

---

## 6. Security Hardening

### 6.1 ClawdGuard Integration

[ClawdGuard](https://github.com/fadidevv/clawdguard) is a security scanner for OpenClaw/Moltbot installations.

**Installation:**
```bash
git clone https://github.com/fadidevv/clawdguard.git
cd clawdguard
docker build -t clawdguard .
```

**Run Security Scan:**
```bash
docker run -v ~/.openclaw:/root/.moltbot clawdguard --scan-only
```

**Target Score:** 0/10 (fully secure)

### 6.2 Security Checklist

- [ ] Generate secure gateway token (not default)
- [ ] Set file permissions to 600: `chmod 600 ~/.openclaw/openclaw.json`
- [ ] Keep gateway bound to loopback (localhost only)
- [ ] Never commit API keys to git
- [ ] Run ClawdGuard scan after setup

### 6.3 Gateway Security

**Recommended Configuration:**
```json
{
  "gateway": {
    "bind": "loopback",
    "auth": {
      "token": "YOUR_SECURE_32_CHAR_TOKEN"
    }
  }
}
```

**Why `loopback`?**
- Only accessible from localhost (127.0.0.1)
- Not exposed to the internet
- No firewall configuration needed

---

## 7. Troubleshooting

### Telegram Not Receiving Messages

**Symptoms:**
- Bot shows as running but doesn't respond
- "fetch failed" errors in logs
- ConnectTimeoutError

**Solution:**
This fork already includes the fix. If you're still having issues:

1. Verify config has `autoSelectFamily: false`:
```json
{
  "channels": {
    "telegram": {
      "network": {
        "autoSelectFamily": false
      }
    }
  }
}
```

2. Restart the gateway:
```bash
pkill -9 -f openclaw-gateway
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

3. Check logs:
```bash
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

### Gateway Won't Start

**Check if port is in use:**
```bash
lsof -i :18789
```

**Kill existing process:**
```bash
pkill -9 -f openclaw-gateway
```

### Config Validation Errors

**Common Invalid Keys (not supported in 2026.1.29):**
- `heartbeat` at root level
- `memorySearch.query.chunkSize`
- `memorySearch.sessionTranscripts`

Use only the keys shown in the example configuration above.

---

## 8. Contributing

### Submitting the IPv6 Fix Upstream

This fix should be submitted to the main OpenClaw repository:

1. Fork openclaw/openclaw
2. Apply the changes from `src/telegram/fetch.ts`
3. Create PR with title: "fix(telegram): Add IPv4-first DNS resolution for Node.js 22+"

### Reporting Issues

Please include:
- Node.js version (`node --version`)
- OpenClaw version (`pnpm openclaw --version`)
- Relevant log output
- Your config (with secrets removed)

---

## Quick Reference

### Commands

```bash
# Check status
pnpm openclaw channels status --probe

# View logs
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# Restart gateway
pkill -9 -f openclaw-gateway && pnpm openclaw gateway run --bind loopback --port 18789 --force

# Run security scan
docker run -v ~/.openclaw:/root/.moltbot clawdguard --scan-only

# Backup config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d_%H%M%S)
```

### File Locations

```
Config:        ~/.openclaw/openclaw.json
Logs:          /tmp/openclaw/openclaw-YYYY-MM-DD.log
Sessions:      ~/.openclaw/sessions/
Memory DB:     ~/.openclaw/memory/
```

### Gateway Access

```
WebSocket:     ws://127.0.0.1:18789
Dashboard:     http://127.0.0.1:18789/?token=YOUR_TOKEN
```

---

## License

This project is a fork of [OpenClaw](https://github.com/openclaw/openclaw) and maintains the same license.

## Credits

- **Original Project:** [OpenClaw](https://github.com/openclaw/openclaw) by Peter Steinberger (@steipete)
- **IPv6/DNS Fix:** Md Adel (@bumblebees002)
- **Security Integration:** [ClawdGuard](https://github.com/fadidevv/clawdguard) by fadidevv

---

*This document should be provided to any new AI agent working on this project for full context.*
