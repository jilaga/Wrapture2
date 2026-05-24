import { eq, sql } from "drizzle-orm";
import { db, orders } from "@/db";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid · preparing",
  preparing: "In the kitchen",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

// Stages shown on the timeline (linear happy path)
export const TIMELINE_STAGES = [
  "pending_payment",
  "paid",
  "preparing",
  "out_for_delivery",
  "delivered",
] as const satisfies readonly OrderStatus[];

export type TimelineStage = (typeof TIMELINE_STAGES)[number];

export const TIMELINE_LABEL: Record<TimelineStage, string> = {
  pending_payment: "Placed",
  paid: "Payment confirmed",
  preparing: "In the kitchen",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

/**
 * Atomically transition an order's status and append an event to status_history.
 * Returns the updated row, or null if the reference was not found.
 */
export async function setOrderStatus(reference: string, next: OrderStatus, extra: Partial<typeof orders.$inferInsert> = {}) {
  const event: OrderStatusEvent = { status: next, at: new Date().toISOString() };

  const [updated] = await db
    .update(orders)
    .set({
      status: next,
      statusHistory: sql`coalesce(${orders.statusHistory}, '[]'::jsonb) || ${JSON.stringify([event])}::jsonb`,
      updatedAt: new Date(),
      ...extra,
    })
    .where(eq(orders.reference, reference))
    .returning();

  return updated ?? null;
}

/** Next status in the happy-path progression. null when already terminal. */
export function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = (TIMELINE_STAGES as readonly OrderStatus[]).indexOf(current);
  if (idx < 0 || idx === TIMELINE_STAGES.length - 1) return null;
  return TIMELINE_STAGES[idx + 1];
}
