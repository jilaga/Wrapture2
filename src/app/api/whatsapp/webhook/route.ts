import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, orders, whatsappInbound } from "@/db";
import type { OrderStatus } from "@/db/schema";
import { sendText } from "@/lib/whatsapp";
import { setOrderStatusByTrackingId, STATUS_LABEL } from "@/lib/order-status";
import { parseCommand, HELP_TEXT, type WaCommand } from "@/lib/wa-commands";

export const runtime = "nodejs";

// --- Meta verification handshake -------------------------------------------------
// https://developers.facebook.com/docs/graph-api/webhooks/getting-started
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// --- Inbound message handler ----------------------------------------------------
type InboundPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          id: string;
          from: string; // E.164 without leading +
          type: string;
          text?: { body?: string };
        }>;
      };
    }>;
  }>;
};

function staffAllowlist(): string[] {
  const set = new Set<string>();
  const owner = process.env.WHATSAPP_OWNER_NUMBER?.replace(/\D/g, "");
  if (owner) set.add(owner);
  const extra = process.env.WHATSAPP_STAFF_NUMBERS ?? "";
  for (const n of extra.split(",")) {
    const cleaned = n.replace(/\D/g, "");
    if (cleaned) set.add(cleaned);
  }
  return [...set];
}

function isStaff(msisdn: string) {
  const cleaned = msisdn.replace(/\D/g, "");
  return staffAllowlist().includes(cleaned);
}

function formatOrderSummary(o: typeof orders.$inferSelect) {
  const lines = [
    `Tracking *${o.trackingNumber ?? "—"}*`,
    `Status: ${STATUS_LABEL[o.status] ?? o.status}`,
    `Customer: ${o.customerName ?? "—"} · ${o.customerPhone ?? "—"}`,
    `Address: ${o.deliveryAddress}`,
  ];
  if (o.riderName || o.riderPhone) {
    lines.push(`Rider: ${o.riderName ?? "—"} · ${o.riderPhone ?? "—"}`);
  }
  lines.push("");
  for (const it of o.items ?? []) lines.push(`• ${it.qty}× ${it.name}`);
  lines.push("");
  lines.push(`Total: ₦${o.total.toLocaleString("en-NG")}`);
  return lines.join("\n");
}

async function handleCommand(cmd: WaCommand): Promise<string> {
  if (cmd.kind === "help") return HELP_TEXT;

  if (cmd.kind === "unknown") {
    return `❓ ${cmd.reason}\n\nSend *help* for the command list.`;
  }

  if (cmd.kind === "lookup") {
    const [row] = await db
      .select()
      .from(orders)
      .where(eq(orders.trackingNumber, cmd.trackingId))
      .limit(1);
    if (!row) return `No order with tracking *${cmd.trackingId}*.`;
    return formatOrderSummary(row);
  }

  if (cmd.kind === "dispatch") {
    const updated = await setOrderStatusByTrackingId(cmd.trackingId, cmd.next, {
      riderName: cmd.rider.name,
      riderPhone: cmd.rider.phone,
    });
    if (!updated) return `No order with tracking *${cmd.trackingId}*.`;
    return `🛵 ${cmd.trackingId} out for delivery with ${cmd.rider.name} (${cmd.rider.phone}).`;
  }

  // status_update
  const updated = await setOrderStatusByTrackingId(cmd.trackingId, cmd.next as OrderStatus);
  if (!updated) return `No order with tracking *${cmd.trackingId}*.`;
  return `✅ ${cmd.trackingId} → ${STATUS_LABEL[cmd.next] ?? cmd.next}`;
}

export async function POST(req: NextRequest) {
  // Always respond 200 so Meta does not retry — log errors instead.
  let payload: InboundPayload;
  try {
    payload = (await req.json()) as InboundPayload;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const messages =
    payload.entry?.flatMap((e) =>
      e.changes?.flatMap((c) => c.value?.messages ?? []) ?? [],
    ) ?? [];

  for (const msg of messages) {
    if (msg.type !== "text") continue;
    const body = msg.text?.body ?? "";
    const from = msg.from;

    // Idempotency: skip if we already logged this message id.
    if (msg.id) {
      const seen = await db
        .select({ id: whatsappInbound.id })
        .from(whatsappInbound)
        .where(eq(whatsappInbound.waMessageId, msg.id))
        .limit(1);
      if (seen.length > 0) continue;
    }

    if (!isStaff(from)) {
      await db.insert(whatsappInbound).values({
        waMessageId: msg.id,
        fromMsisdn: from,
        body,
        error: "not_staff",
      });
      continue;
    }

    const cmd = parseCommand(body);
    let reply: string;
    let error: string | null = null;
    try {
      reply = await handleCommand(cmd);
    } catch (err) {
      reply = "⚠️ Server error handling that command. Try again or contact dev.";
      error = err instanceof Error ? err.message : String(err);
    }

    await db.insert(whatsappInbound).values({
      waMessageId: msg.id,
      fromMsisdn: from,
      body,
      parsedAction: cmd.kind,
      parsedTrackingId: "trackingId" in cmd ? cmd.trackingId : null,
      reply,
      error,
    });

    await sendText(from, reply).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
