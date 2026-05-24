"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { sendOwnerNotification } from "@/lib/whatsapp";

export async function confirmSimulatedPayment(reference: string) {
  const rows = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
  const order = rows[0];
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending_payment") {
    // Idempotent: if already paid, just redirect.
    redirect(`/orders?placed=${reference}`);
  }

  await db
    .update(orders)
    .set({
      status: "paid",
      paystackTxnId: `sim_${Date.now()}`,
      updatedAt: new Date(),
    })
    .where(eq(orders.reference, reference));

  // Silent owner notification — user never sees this.
  const itemsMap: Record<string, number> = {};
  for (const it of order.items ?? []) itemsMap[it.id] = it.qty;

  await sendOwnerNotification({
    reference: order.reference,
    address: order.deliveryAddress,
    items: itemsMap,
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
  })
    .then(async (res) => {
      if (res.ok) {
        await db
          .update(orders)
          .set({ whatsappSent: true })
          .where(eq(orders.reference, reference));
      }
    })
    .catch(() => null);

  redirect(`/orders?placed=${reference}`);
}

export async function cancelSimulatedPayment(reference: string) {
  await db
    .update(orders)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(orders.reference, reference));
  redirect("/?cancelled=1");
}
