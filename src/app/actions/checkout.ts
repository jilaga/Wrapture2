"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, orders, user, address as addressTable } from "@/db";
import { MENU } from "@/lib/menu";
import { generateReference, initializeTransaction } from "@/lib/paystack";

type CheckoutInput = {
  items: Record<string, number>;
  address: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  saveAddress?: boolean;
};

type CheckoutResult =
  | {
      ok: true;
      reference: string;
      // Real Paystack flow returns hosted payment URL
      authorizationUrl?: string;
      // Dev/no-key flow returns our simulated payment page
      simulateUrl?: string;
    }
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

// Auto-create an account at checkout (no password — random one server-side).
// Returns the user id and whether we created or matched an existing user.
async function ensureIdentifiedUser(input: { name: string; email: string; phone: string }) {
  const existing = await db.select().from(user).where(eq(user.email, input.email)).limit(1);
  if (existing[0]) {
    // Existing email — link order, update phone if missing.
    if (input.phone && !existing[0].phone) {
      await db.update(user).set({ phone: input.phone }).where(eq(user.id, existing[0].id));
    }
    return { userId: existing[0].id, isNew: false };
  }

  const randomPw = randomBytes(32).toString("base64url");
  const res = await auth.api.signUpEmail({
    body: { email: input.email, password: randomPw, name: input.name },
    headers: await headers(),
  });

  if (!res?.user?.id) throw new Error("Failed to create account");

  await db.update(user).set({ phone: input.phone }).where(eq(user.id, res.user.id));
  return { userId: res.user.id, isNew: true };
}

async function maybeSaveAddress(userId: string, line: string) {
  // Don't duplicate — only save if no existing address has the same line.
  const existing = await db
    .select()
    .from(addressTable)
    .where(and(eq(addressTable.userId, userId), eq(addressTable.line, line)))
    .limit(1);
  if (existing[0]) return;

  // Detect whether this is the user's first saved address → make it default.
  const any = await db.select().from(addressTable).where(eq(addressTable.userId, userId)).limit(1);
  await db.insert(addressTable).values({
    userId,
    label: "Home",
    line,
    city: "Asaba",
    isDefault: any.length === 0,
  });
}

export async function checkoutAction(input: CheckoutInput): Promise<CheckoutResult> {
  const trimmed = {
    address: input.address?.trim() ?? "",
    customerName: input.customerName?.trim() ?? "",
    customerEmail: input.customerEmail?.trim() ?? "",
    customerPhone: input.customerPhone?.trim() ?? "",
  };

  if (!trimmed.address || !trimmed.customerName || !trimmed.customerEmail || !trimmed.customerPhone) {
    return { ok: false, error: "All fields required" };
  }

  const recomputed = recompute(input.items);
  if (recomputed.subtotal <= 0) return { ok: false, error: "Cart is empty" };

  const session = await auth.api.getSession({ headers: await headers() });
  let userId: string | null = session?.user?.id ?? null;

  if (!userId) {
    try {
      const identityRes = await ensureIdentifiedUser({
        name: trimmed.customerName,
        email: trimmed.customerEmail,
        phone: trimmed.customerPhone,
      });
      userId = identityRes.userId;
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Failed to identify user" };
    }
  }

  if (input.saveAddress && userId) {
    await maybeSaveAddress(userId, trimmed.address).catch(() => null);
  }

  const reference = generateReference();

  await db.insert(orders).values({
    reference,
    userId,
    status: "pending_payment",
    customerName: trimmed.customerName,
    customerEmail: trimmed.customerEmail,
    customerPhone: trimmed.customerPhone,
    deliveryAddress: trimmed.address,
    items: recomputed.items,
    subtotal: recomputed.subtotal,
    delivery: recomputed.delivery,
    total: recomputed.total,
  });

  // Real Paystack: redirect to hosted payment.
  if (process.env.PAYSTACK_SECRET_KEY) {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      (await headers()).get("origin") ??
      "http://localhost:3000";

    const init = await initializeTransaction({
      email: trimmed.customerEmail,
      amountNGN: recomputed.total,
      reference,
      callbackUrl: `${origin}/checkout/callback`,
      metadata: { items: recomputed.items, address: trimmed.address },
    });

    if (init.status && init.data) {
      return { ok: true, reference, authorizationUrl: init.data.authorization_url };
    }
    return { ok: false, error: init.message ?? "Paystack init failed" };
  }

  // Dev / no-key flow: simulated payment page mirrors the Paystack UX.
  return {
    ok: true,
    reference,
    simulateUrl: `/checkout/simulate/${reference}`,
  };
}
