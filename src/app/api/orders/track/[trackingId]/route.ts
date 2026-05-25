import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db, orders } from "@/db";

export const runtime = "nodejs";

// Public-by-design: the 6-digit tracking number is the secret. Email is never returned.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> },
) {
  const { trackingId } = await params;
  if (!trackingId) {
    return NextResponse.json({ error: "Missing tracking id" }, { status: 400 });
  }

  // Accept either the tracking number or the Paystack reference so the same
  // endpoint serves both the post-payment callback (knows the ref) and the
  // /track page (knows the tracking number).
  const rows = await db
    .select()
    .from(orders)
    .where(or(eq(orders.trackingNumber, trackingId), eq(orders.reference, trackingId)))
    .limit(1);

  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      reference: order.reference,
      trackingNumber: order.trackingNumber,
      status: order.status,
      statusHistory: order.statusHistory ?? [],
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      items: order.items ?? [],
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      rider:
        order.riderName || order.riderPhone
          ? { name: order.riderName, phone: order.riderPhone }
          : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
