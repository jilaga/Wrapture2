import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { sendOwnerNotification } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", secret).update(raw).digest("hex");

  if (sig !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    data: { reference: string; id: number; status: string };
  };

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const [order] = await db
      .update(orders)
      .set({
        status: "paid",
        paystackTxnId: String(event.data.id),
        updatedAt: new Date(),
      })
      .where(eq(orders.reference, reference))
      .returning();

    if (order && !order.whatsappSent) {
      const itemsMap: Record<string, number> = {};
      for (const it of order.items ?? []) itemsMap[it.id] = it.qty;

      const result = await sendOwnerNotification({
        reference: order.reference,
        address: order.deliveryAddress,
        items: itemsMap,
        subtotal: order.subtotal,
        delivery: order.delivery,
        total: order.total,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      });

      if (result.ok) {
        await db
          .update(orders)
          .set({ whatsappSent: true })
          .where(eq(orders.reference, reference));
      }
    }
  }

  return NextResponse.json({ ok: true });
}
