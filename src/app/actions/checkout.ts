"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db, orders } from "@/db";
import { MENU } from "@/lib/menu";
import { generateReference, initializeTransaction } from "@/lib/paystack";
import { buildWaMeLink, sendOwnerNotification } from "@/lib/whatsapp";

type CheckoutInput = {
  items: Record<string, number>;
  address: string;
  subtotal: number;
  delivery: number;
  total: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

type CheckoutResult =
  | { ok: true; authorizationUrl?: string; whatsappUrl?: string; reference: string }
  | { ok: false; error: string };

// Recompute totals server-side from MENU to prevent client tampering
function recompute(items: Record<string, number>) {
  let subtotal = 0;
  const enriched: Array<{ id: string; name: string; qty: number; price: number }> = [];
  for (const [id, qty] of Object.entries(items)) {
    const item = MENU.find((m) => m.id === id);
    if (!item || qty <= 0) continue;
    subtotal += item.price * qty;
    enriched.push({ id, name: item.name, qty, price: item.price });
  }
  const delivery = subtotal > 0 ? 1500 : 0;
  return { subtotal, delivery, total: subtotal + delivery, items: enriched };
}

export async function checkoutAction(input: CheckoutInput): Promise<CheckoutResult> {
  if (!input.address?.trim()) return { ok: false, error: "Address required" };

  const recomputed = recompute(input.items);
  if (recomputed.subtotal <= 0) return { ok: false, error: "Cart is empty" };

  const session = await auth.api.getSession({ headers: await headers() });
  const customerEmail =
    input.customerEmail ?? session?.user?.email ?? "guest@wrapture.local";
  const customerName = input.customerName ?? session?.user?.name ?? null;
  const customerPhone = input.customerPhone ?? null;

  const reference = generateReference();

  await db.insert(orders).values({
    reference,
    userId: session?.user?.id ?? null,
    status: "pending_payment",
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress: input.address,
    items: recomputed.items,
    subtotal: recomputed.subtotal,
    delivery: recomputed.delivery,
    total: recomputed.total,
  });

  // If Paystack is configured, init transaction
  if (process.env.PAYSTACK_SECRET_KEY) {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      (await headers()).get("origin") ??
      "http://localhost:3000";

    const init = await initializeTransaction({
      email: customerEmail,
      amountNGN: recomputed.total,
      reference,
      callbackUrl: `${origin}/checkout/callback`,
      metadata: { items: recomputed.items, address: input.address },
    });

    if (init.status && init.data) {
      return { ok: true, authorizationUrl: init.data.authorization_url, reference };
    }
    return { ok: false, error: init.message ?? "Paystack init failed" };
  }

  // Fallback: skip payment, fire WhatsApp owner notification immediately + return wa.me deeplink
  const orderForMsg = {
    reference,
    address: input.address,
    items: input.items,
    subtotal: recomputed.subtotal,
    delivery: recomputed.delivery,
    total: recomputed.total,
    customerName,
    customerPhone,
  };

  await sendOwnerNotification(orderForMsg).catch(() => null);

  return {
    ok: true,
    whatsappUrl: buildWaMeLink(orderForMsg),
    reference,
  };
}
