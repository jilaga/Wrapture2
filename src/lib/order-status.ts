import { eq, sql } from "drizzle-orm";
import { db, orders } from "@/db";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  accepted: "Accepted by kitchen",
  preparing: "In the kitchen",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

// Stages shown on the timeline (linear happy path)
export const TIMELINE_STAGES = [
  "pending_payment",
  "paid",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
] as const satisfies readonly OrderStatus[];

export type TimelineStage = (typeof TIMELINE_STAGES)[number];

export const TIMELINE_LABEL: Record<TimelineStage, string> = {
  pending_payment: "Placed",
  paid: "Payment confirmed",
  accepted: "Accepted",
  preparing: "In the kitchen",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

/**
 * Atomically transition an order's status and append an event to status_history.
 * Returns the updated row, or null if the reference was not found.
 */
export async function setOrderStatus(
  reference: string,
  next: OrderStatus,
  extra: Partial<typeof orders.$inferInsert> = {},
) {
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

/**
 * Same as setOrderStatus, but keys off the human-facing tracking number — used by
 * the WhatsApp ops webhook where staff type the short id, not the Paystack ref.
 */
export async function setOrderStatusByTrackingId(
  trackingId: string,
  next: OrderStatus,
  extra: Partial<typeof orders.$inferInsert> = {},
) {
  const event: OrderStatusEvent = { status: next, at: new Date().toISOString() };

  const [updated] = await db
    .update(orders)
    .set({
      status: next,
      statusHistory: sql`coalesce(${orders.statusHistory}, '[]'::jsonb) || ${JSON.stringify([event])}::jsonb`,
      updatedAt: new Date(),
      ...extra,
    })
    .where(eq(orders.trackingNumber, trackingId))
    .returning();

  return updated ?? null;
}

/** Next status in the happy-path progression. null when already terminal. */
export function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = (TIMELINE_STAGES as readonly OrderStatus[]).indexOf(current);
  if (idx < 0 || idx === TIMELINE_STAGES.length - 1) return null;
  return TIMELINE_STAGES[idx + 1];
}

/** Terminal statuses: nothing left to poll for. */
export const TERMINAL_STATUSES: readonly OrderStatus[] = [
  "delivered",
  "cancelled",
  "failed",
];

export function isTerminal(s: OrderStatus) {
  return TERMINAL_STATUSES.includes(s);
}
