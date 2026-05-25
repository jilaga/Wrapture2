import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

// ---- Better Auth tables (canonical names per Better Auth docs) ----

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---- App tables ----

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // e.g. "Home", "Office"
  line: text("line").notNull(),
  city: text("city").notNull().default("Asaba"),
  phone: text("phone"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "failed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderStatusEvent = {
  status: OrderStatus;
  at: string; // ISO timestamp
};

export const orderStatus = pgEnum("order_status", ORDER_STATUSES);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // null = guest checkout
  reference: text("reference").notNull().unique(), // Paystack reference
  trackingNumber: text("tracking_number").unique(), // 6-digit human-readable id used over WhatsApp
  status: orderStatus("status").notNull().default("pending_payment"),
  statusHistory: jsonb("status_history").$type<OrderStatusEvent[]>().notNull().default([]),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  deliveryAddress: text("delivery_address").notNull(),
  items: jsonb("items").$type<Array<{ id: string; name: string; qty: number; price: number }>>().notNull(),
  subtotal: integer("subtotal").notNull(),
  delivery: integer("delivery").notNull().default(0),
  total: integer("total").notNull(),
  paystackTxnId: text("paystack_txn_id"),
  whatsappSent: boolean("whatsapp_sent").notNull().default(false),
  riderName: text("rider_name"),
  riderPhone: text("rider_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappInbound = pgTable("whatsapp_inbound", {
  id: uuid("id").primaryKey().defaultRandom(),
  waMessageId: text("wa_message_id").unique(),
  fromMsisdn: text("from_msisdn").notNull(),
  body: text("body").notNull(),
  parsedAction: text("parsed_action"),
  parsedTrackingId: text("parsed_tracking_id"),
  reply: text("reply"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const serverCart = pgTable("server_cart", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  items: jsonb("items").$type<Record<string, number>>().notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
