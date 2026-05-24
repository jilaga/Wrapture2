"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, orders, user } from "@/db";
import { MENU } from "@/lib/menu";
import { generateReference, initializeTransaction } from "@/lib/paystack";
import { buildWaMeLink, sendOwnerNotification } from "@/lib/whatsapp";

type CheckoutInput = {
  items: Record<string, number>;
  address: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

type CheckoutResult =
  | { ok: true; authorizationUrl?: string; whatsappUrl?: string; reference: string }
  | { ok: false; error: string; needIdentity?: boolean };

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

// Auto-create an account at checkout for guests (no password — random one server-side).
// If email already exists, treat as a returning identified guest — keep session-less,
// require them to log in or use that account on another device.
async function ensureIdentifiedSession(input: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ userId: string } | { error: string }> {
  // Existing email check — if account exists, don't auto-create
  const existing = await db.select().from(user).where(eq(user.email, input.email)).limit(1);
  if (existing[0]) {
    // For an existing email, we can't sign them in automatically (no password supplied).
    // Treat checkout as guest-with-known-customer: record name/phone, link userId, no session.
    if (input.phone && !existing[0].phone) {
      await db.update(user).set({ phone: input.phone }).where(eq(user.id, existing[0].id));
    }
    return { userId: existing[0].id };
  }

  // New email → create user via Better Auth with a random unguessable password
  const randomPw = randomBytes(32).toString("base64url");
  const res = await auth.api.signUpEmail({
    body: { email: input.email, password: randomPw, name: input.name },
    headers: await headers(),
  });

  if (!res?.user?.id) return { error: "Failed to create account" };

  // Persist phone on the new user
  await db.update(user).set({ phone: input.phone }).where(eq(user.id, res.user.id));

  return { userId: res.user.id };
}

export async function checkoutAction(input: CheckoutInput): Promise<CheckoutResult> {
  if (!input.address?.trim()) return { ok: false, error: "Address required" };

  const recomputed = recompute(input.items);
  if (recomputed.subtotal <= 0) return { ok: false, error: "Cart is empty" };

  const session = await auth.api.getSession({ headers: await headers() });

  let userId: string | null = session?.user?.id ?? null;
  let customerEmail = session?.user?.email ?? input.customerEmail ?? "";
  let customerName = session?.user?.name ?? input.customerName ?? "";
  let customerPhone = input.customerPhone ?? null;

  // Guest with no session → require identity form
  if (!session) {
    const missing =
      !input.customerName?.trim() ||
      !input.customerEmail?.trim() ||
      !input.customerPhone?.trim();
    if (missing) {
      return { ok: false, error: "Name, email and phone required to check out", needIdentity: true };
    }

    const identityRes = await ensureIdentifiedSession({
      name: input.customerName!.trim(),
      email: input.customerEmail!.trim(),
      phone: input.customerPhone!.trim(),
    });

    if ("error" in identityRes) {
      return { ok: false, error: identityRes.error };
    }

    userId = identityRes.userId;
    customerEmail = input.customerEmail!.trim();
    customerName = input.customerName!.trim();
    customerPhone = input.customerPhone!.trim();
  }

  const reference = generateReference();

  await db.insert(orders).values({
    reference,
    userId,
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
