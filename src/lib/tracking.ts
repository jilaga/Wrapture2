import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";

const MAX_ATTEMPTS = 8;

// 6-digit numeric, no leading zero. ~900K space, easy to read aloud.
function roll() {
  return String(randomInt(100_000, 1_000_000));
}

export async function generateTrackingNumber(): Promise<string> {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const candidate = roll();
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.trackingNumber, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  throw new Error("Could not allocate unique tracking number");
}
