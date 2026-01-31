import * as dns from "node:dns";
import * as net from "node:net";
import { resolveFetch } from "../infra/fetch.js";
import type { TelegramNetworkConfig } from "../config/types.telegram.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { resolveTelegramAutoSelectFamilyDecision } from "./network-config.js";

let appliedAutoSelectFamily: boolean | null = null;
let appliedIpv4First: boolean = false;
const log = createSubsystemLogger("telegram/network");

// Node 22 workaround: disable autoSelectFamily to avoid Happy Eyeballs timeouts.
// See: https://github.com/nodejs/node/issues/54359
// Additionally, set DNS result order to ipv4first to prevent IPv6 connection attempts
// that may timeout on networks where IPv6 is not fully supported.
function applyTelegramNetworkWorkarounds(network?: TelegramNetworkConfig): void {
  const decision = resolveTelegramAutoSelectFamilyDecision({ network });
  if (decision.value === null || decision.value === appliedAutoSelectFamily) return;
  appliedAutoSelectFamily = decision.value;

  if (typeof net.setDefaultAutoSelectFamily === "function") {
    try {
      net.setDefaultAutoSelectFamily(decision.value);
      const label = decision.source ? ` (${decision.source})` : "";
      log.info(`telegram: autoSelectFamily=${decision.value}${label}`);
    } catch {
      // ignore if unsupported by the runtime
    }
  }

  // When autoSelectFamily is disabled, also force IPv4-first DNS resolution
  // to prevent undici from attempting IPv6 connections that may timeout.
  if (decision.value === false && !appliedIpv4First) {
    if (typeof dns.setDefaultResultOrder === "function") {
      try {
        dns.setDefaultResultOrder("ipv4first");
        appliedIpv4First = true;
        log.info("telegram: dns.setDefaultResultOrder=ipv4first");
      } catch {
        // ignore if unsupported by the runtime
      }
    }
  }
}

// Prefer wrapped fetch when available to normalize AbortSignal across runtimes.
export function resolveTelegramFetch(
  proxyFetch?: typeof fetch,
  options?: { network?: TelegramNetworkConfig },
): typeof fetch | undefined {
  applyTelegramNetworkWorkarounds(options?.network);
  if (proxyFetch) return resolveFetch(proxyFetch);
  const fetchImpl = resolveFetch();
  if (!fetchImpl) {
    throw new Error("fetch is not available; set channels.telegram.proxy in config");
  }
  return fetchImpl;
}
