import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { Button } from "@/components/ui/button";
import { CallbackPoller } from "./CallbackPoller";

export const metadata: Metadata = {
  title: "Confirming payment",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ reference?: string; trxref?: string }>;

// Paystack hosted checkout redirects here. The webhook
// (/api/paystack/webhook) is authoritative for status changes — this page
// only reads the order and shows the current state. Client polls the order
// API until status leaves pending_payment, then redirects to /orders.
export default async function CallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  if (!reference) {
    return (
      <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">No payment reference</h1>
          <Button render={<Link href="/" />}>Back home</Button>
        </div>
      </main>
    );
  }

  const rows = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
  const order = rows[0];

  if (!order) {
    return (
      <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl mb-4">Order not found</h1>
          <p className="text-muted-foreground mb-8">Reference: {reference}</p>
          <Button render={<Link href="/" />}>Back home</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-5xl mb-4">Confirming payment…</h1>
        <p className="text-muted-foreground mb-2">
          Paystack is notifying us. This usually takes a few seconds.
        </p>
        {order.trackingNumber && (
          <p className="text-sm mb-8">
            Tracking number: <span className="font-mono">{order.trackingNumber}</span>
          </p>
        )}
        <CallbackPoller reference={reference} initialStatus={order.status} />
        <div className="mt-8 flex gap-3 justify-center">
          <Button variant="outline" render={<Link href={`/track?ref=${reference}`} />}>
            Track manually
          </Button>
          <Button render={<Link href="/orders" />}>My orders</Button>
        </div>
      </div>
    </main>
  );
}
