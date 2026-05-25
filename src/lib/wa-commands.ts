import type { OrderStatus } from "@/db/schema";

export type WaCommand =
  | { kind: "status_update"; trackingId: string; next: OrderStatus }
  | { kind: "dispatch"; trackingId: string; next: "out_for_delivery"; rider: { name: string; phone: string } }
  | { kind: "lookup"; trackingId: string }
  | { kind: "help" }
  | { kind: "unknown"; reason: string };

// Maps a single-word verb to the order_status enum value it transitions to.
const VERB_TO_STATUS: Record<string, OrderStatus> = {
  accept: "accepted",
  accepted: "accepted",
  preparing: "preparing",
  ready: "ready",
  delivered: "delivered",
  done: "delivered",
};

const TRACKING_ID_RE = /^\d{6}$/;

function normalizePhone(raw: string) {
  // Keep digits and a leading +, drop everything else.
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  return trimmed.replace(/\D/g, "");
}

export function parseCommand(rawInput: string): WaCommand {
  const text = rawInput.trim();
  if (!text) return { kind: "unknown", reason: "Empty message" };

  if (/^help$/i.test(text)) return { kind: "help" };

  // Bare tracking id → rider lookup
  if (TRACKING_ID_RE.test(text)) return { kind: "lookup", trackingId: text };

  // Tokenise on whitespace, case-insensitive for the verb only.
  const tokens = text.split(/\s+/);
  const verb = tokens[0]?.toLowerCase() ?? "";

  if (verb === "status" || verb === "lookup" || verb === "info") {
    const id = tokens[1];
    if (!id || !TRACKING_ID_RE.test(id)) {
      return { kind: "unknown", reason: "Tracking id must be 6 digits" };
    }
    return { kind: "lookup", trackingId: id };
  }

  if (verb === "dispatch" || verb === "out") {
    const id = tokens[1];
    if (!id || !TRACKING_ID_RE.test(id)) {
      return { kind: "unknown", reason: "Usage: dispatch <id> rider:Name phone:080xxxx" };
    }
    const rest = tokens.slice(2).join(" ");
    // Match rider:<name> and phone:<msisdn> in any order. Name may contain spaces
    // and stops at the next `phone:` keyword or end of string.
    const riderMatch = rest.match(/rider:\s*(.+?)(?=\s+phone:|$)/i);
    const phoneMatch = rest.match(/phone:\s*([+\d][\d\s-]*)/i);
    if (!riderMatch || !phoneMatch) {
      return { kind: "unknown", reason: "Need rider:<name> and phone:<msisdn>" };
    }
    const name = riderMatch[1].trim();
    const phone = normalizePhone(phoneMatch[1]);
    if (!name || phone.replace(/\D/g, "").length < 7) {
      return { kind: "unknown", reason: "Rider name and a valid phone are required" };
    }
    return {
      kind: "dispatch",
      trackingId: id,
      next: "out_for_delivery",
      rider: { name, phone },
    };
  }

  const next = VERB_TO_STATUS[verb];
  if (next) {
    const id = tokens[1];
    if (!id || !TRACKING_ID_RE.test(id)) {
      return { kind: "unknown", reason: `Usage: ${verb} <6-digit id>` };
    }
    if (tokens.length > 2) {
      return { kind: "unknown", reason: `Extra tokens after id. Usage: ${verb} <id>` };
    }
    return { kind: "status_update", trackingId: id, next };
  }

  return { kind: "unknown", reason: `Unknown command: ${verb}` };
}

export const HELP_TEXT = [
  "*Wrapture ops commands*",
  "",
  "accept <id>",
  "preparing <id>",
  "ready <id>",
  "dispatch <id> rider:Name phone:080xxxx",
  "delivered <id>",
  "",
  "Rider lookup: send the 6-digit id alone.",
].join("\n");
