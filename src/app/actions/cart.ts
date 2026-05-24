"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, serverCart } from "@/db";

// On client login, merge local cart with persisted server cart.
// Returns merged items so client can replace its local state.
export async function mergeCart(
  localItems: Record<string, number>
): Promise<{ ok: true; items: Record<string, number> } | { ok: false }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false };

  const userId = session.user.id;
  const rows = await db.select().from(serverCart).where(eq(serverCart.userId, userId)).limit(1);
  const remote = rows[0]?.items ?? {};

  const merged: Record<string, number> = { ...remote };
  for (const [id, qty] of Object.entries(localItems)) {
    merged[id] = (merged[id] ?? 0) + qty;
  }

  if (rows[0]) {
    await db
      .update(serverCart)
      .set({ items: merged, updatedAt: new Date() })
      .where(eq(serverCart.userId, userId));
  } else {
    await db.insert(serverCart).values({ userId, items: merged });
  }

  return { ok: true, items: merged };
}

export async function pushCart(items: Record<string, number>): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  const userId = session.user.id;
  const rows = await db.select().from(serverCart).where(eq(serverCart.userId, userId)).limit(1);
  if (rows[0]) {
    await db
      .update(serverCart)
      .set({ items, updatedAt: new Date() })
      .where(eq(serverCart.userId, userId));
  } else {
    await db.insert(serverCart).values({ userId, items });
  }
}
