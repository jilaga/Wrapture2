"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { sendOwnerNotification } from "@/lib/whatsapp";
import { setOrderStatus, nextStatus } from "@/lib/order-status";

export async function confirmSimulatedPayment(reference: string) {
  const rows = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
  const order = rows[0];
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending_payment") {
    redirect(`/orders?placed=${reference}`);
  }

  await setOrderStatus(reference, "paid", { paystackTxnId: `sim_${Date.now()}` });

  // Silent owner notification
  const itemsMap: Record<string, number> = {};
  for (const it of order.items ?? []) itemsMap[it.id] = it.qty;

  await sendOwnerNotification({
    reference: order.reference,
    trackingNumber: order.trackingNumber,
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
        await db.update(orders).set({ whatsappSent: true }).where(eq(orders.reference, reference));
      }
    })
    .catch(() => null);

  redirect(`/orders?placed=${reference}`);
}

export async function cancelSimulatedPayment(reference: string) {
  await setOrderStatus(reference, "cancelled");
  redirect("/?cancelled=1");
}

/**
 * Dev-only: advance order status by one stage along the happy path.
 * Useful for visualising the timeline without an admin panel.
 */
export async function advanceOrderStatus(reference: string) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Disabled in production");
  }
  const rows = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
  const order = rows[0];
  if (!order) throw new Error("Order not found");

  const next = nextStatus(order.status);
  if (!next) return;

  await setOrderStatus(reference, next);
  revalidatePath(`/orders/${reference}`);
  revalidatePath("/orders");
}
