import { formatNGN, MENU } from "@/lib/menu";

export type OrderForWhatsApp = {
  reference: string;
  address: string;
  items: Record<string, number>;
  subtotal: number;
  delivery: number;
  total: number;
  customerName?: string | null;
  customerPhone?: string | null;
};

export function buildOrderMessage(order: OrderForWhatsApp): string {
  const lines: string[] = [];
  lines.push(`🔥 *NEW WRAPTURE ORDER*`);
  lines.push(`Ref: \`${order.reference}\``);
  lines.push("");
  if (order.customerName) lines.push(`👤 ${order.customerName}`);
  if (order.customerPhone) lines.push(`📞 ${order.customerPhone}`);
  lines.push(`📍 ${order.address}`);
  lines.push("");
  lines.push(`*Items:*`);
  for (const [id, qty] of Object.entries(order.items)) {
    const item = MENU.find((m) => m.id === id);
    if (!item) continue;
    lines.push(`• ${qty}× ${item.name} — ${formatNGN(item.price * qty)}`);
  }
  lines.push("");
  lines.push(`Subtotal: ${formatNGN(order.subtotal)}`);
  lines.push(`Delivery: ${formatNGN(order.delivery)}`);
  lines.push(`*Total: ${formatNGN(order.total)}*`);
  return lines.join("\n");
}

// Fallback: wa.me deep link — opens WhatsApp in user's browser with prefilled msg
export function buildWaMeLink(order: OrderForWhatsApp): string {
  const owner = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER ?? "";
  const cleaned = owner.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(buildOrderMessage(order))}`;
}

// Real owner notification via WhatsApp Cloud API
export async function sendOwnerNotification(order: OrderForWhatsApp): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const owner = process.env.WHATSAPP_OWNER_NUMBER;

  if (!token || !phoneId || !owner) {
    return { ok: false, error: "WhatsApp env vars missing" };
  }

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: owner.replace(/\D/g, ""),
      type: "text",
      text: { preview_url: false, body: buildOrderMessage(order) },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}
