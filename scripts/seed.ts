import "dotenv/config";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { MENU } from "../src/lib/menu";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL missing");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const TEST_EMAIL = "test@wrapture.local";

async function main() {
  console.log("→ seeding sample data");

  // Find existing test user (may already exist from prior signup smoke test)
  const existing = await db.select().from(schema.user).where(eq(schema.user.email, TEST_EMAIL)).limit(1);
  let userId: string;

  if (existing[0]) {
    userId = existing[0].id;
    console.log(`  test user already exists: ${userId}`);
    // Wipe their prior orders/addresses/cart so seed is idempotent
    await db.delete(schema.orders).where(eq(schema.orders.userId, userId));
    await db.delete(schema.address).where(eq(schema.address.userId, userId));
    await db.delete(schema.serverCart).where(eq(schema.serverCart.userId, userId));
    console.log("  wiped existing orders/addresses/cart");
  } else {
    userId = randomUUID().replace(/-/g, "");
    await db.insert(schema.user).values({
      id: userId,
      email: TEST_EMAIL,
      name: "Ada Test",
      emailVerified: true,
      phone: "+2348012345678",
    });
    console.log(`  created test user: ${userId}`);
    console.log("  ⚠ user has no auth credentials — set via /api/auth/sign-up/email or use seeded magic flow");
  }

  // ── Addresses ────────────────────────────────────────────────────────────
  await db.insert(schema.address).values([
    {
      userId,
      label: "Home",
      line: "No. 12, Nnebisi Road, off Anwai",
      city: "Asaba",
      phone: "+2348012345678",
      isDefault: true,
    },
    {
      userId,
      label: "Office",
      line: "Suite 4B, Summit Plaza, DBS Road",
      city: "Asaba",
      phone: "+2348023456789",
      isDefault: false,
    },
  ]);
  console.log("  + 2 addresses");

  // ── Server cart (so logged-in user sees prior cart synced) ───────────────
  await db.insert(schema.serverCart).values({
    userId,
    items: { classic: 2, fury: 1 },
  });
  console.log("  + server cart (2 classic, 1 fury)");

  // ── Orders ───────────────────────────────────────────────────────────────
  const findItem = (id: string) => MENU.find((m) => m.id === id)!;
  const ord = (ids: { id: string; qty: number }[]) => {
    const items = ids.map(({ id, qty }) => {
      const m = findItem(id);
      return { id: m.id, name: m.name, qty, price: m.price };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const delivery = 1500;
    return { items, subtotal, delivery, total: subtotal + delivery };
  };

  const o1 = ord([{ id: "classic", qty: 2 }, { id: "fury", qty: 1 }]);
  const o2 = ord([{ id: "blood", qty: 1 }, { id: "suya", qty: 2 }]);
  const o3 = ord([{ id: "classic", qty: 1 }]);

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000);

  await db.insert(schema.orders).values([
    {
      reference: `WRP_SEED_${Date.now()}_DELIVERED`,
      userId,
      status: "delivered",
      customerName: "Ada Test",
      customerEmail: TEST_EMAIL,
      customerPhone: "+2348012345678",
      deliveryAddress: "No. 12, Nnebisi Road, off Anwai, Asaba",
      items: o1.items,
      subtotal: o1.subtotal,
      delivery: o1.delivery,
      total: o1.total,
      whatsappSent: true,
      paystackTxnId: "seed_txn_1",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      reference: `WRP_SEED_${Date.now()}_OUTFORDELIVERY`,
      userId,
      status: "out_for_delivery",
      customerName: "Ada Test",
      customerEmail: TEST_EMAIL,
      customerPhone: "+2348012345678",
      deliveryAddress: "Suite 4B, Summit Plaza, DBS Road, Asaba",
      items: o2.items,
      subtotal: o2.subtotal,
      delivery: o2.delivery,
      total: o2.total,
      whatsappSent: true,
      paystackTxnId: "seed_txn_2",
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
    {
      reference: `WRP_SEED_${Date.now()}_PENDING`,
      userId,
      status: "pending_payment",
      customerName: "Ada Test",
      customerEmail: TEST_EMAIL,
      customerPhone: "+2348012345678",
      deliveryAddress: "No. 12, Nnebisi Road, off Anwai, Asaba",
      items: o3.items,
      subtotal: o3.subtotal,
      delivery: o3.delivery,
      total: o3.total,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ]);
  console.log("  + 3 orders (1 delivered, 1 out_for_delivery, 1 pending_payment)");

  console.log("");
  console.log("✓ seed complete");
  console.log("");
  console.log("To log in as the test user:");
  console.log(`  email:    ${TEST_EMAIL}`);
  if (existing[0]) {
    console.log(`  password: <whatever you set when you smoke-tested signup>`);
  } else {
    console.log(`  password: (none — seeded user has no credentials)`);
    console.log("  Sign up at /signup with this email to attach a password.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
