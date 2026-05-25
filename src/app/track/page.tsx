import Link from "next/link";
import { eq, or } from "drizzle-orm";
import { db, orders } from "@/db";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { TrackingLive } from "@/components/orders/TrackingLive";
import { formatNGN } from "@/lib/menu";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";

type SearchParams = Promise<{ id?: string; ref?: string }>;

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const { id, ref } = await searchParams;
  const lookup = id ?? ref;

  let order = null;
  if (lookup) {
    const rows = await db
      .select()
      .from(orders)
      .where(or(eq(orders.trackingNumber, lookup), eq(orders.reference, lookup)))
      .limit(1);
    order = rows[0] ?? null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-xl">
        <h1 className="font-display text-5xl mb-2">Track order</h1>
        <p className="text-muted-foreground mb-10">
          Enter the 6-digit tracking number we sent you.
        </p>

        <form className="flex gap-2 mb-8">
          <input
            name="id"
            inputMode="numeric"
            defaultValue={lookup ?? ""}
            placeholder="123456"
            className="flex-1 h-12 px-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" className="rounded-2xl h-12 px-6">Track</Button>
        </form>

        {lookup && !order && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No order found for that tracking number.
          </p>
        )}

        {order && (
          <article className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Tracking number
              </p>
              <p className="font-mono text-2xl tracking-wider">
                {order.trackingNumber ?? order.reference}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(order.createdAt).toLocaleString("en-NG")}
              </p>
            </div>

            <TrackingLive
              trackingId={order.trackingNumber ?? order.reference}
              initial={{
                status: order.status as OrderStatus,
                statusHistory: (order.statusHistory as OrderStatusEvent[]) ?? [],
                rider:
                  order.riderName || order.riderPhone
                    ? { name: order.riderName, phone: order.riderPhone }
                    : null,
              }}
            />

            <p className="text-sm text-muted-foreground mt-6 mb-4">
              Delivering to: {order.deliveryAddress}
            </p>
            <ul className="space-y-1 text-sm">
              {(order.items ?? []).map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>{it.qty}× {it.name}</span>
                  <span className="text-muted-foreground">{formatNGN(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4 mt-4 border-t border-border text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">{formatNGN(order.total)}</span>
            </div>
          </article>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Or <Link href="/orders" className="text-primary hover:underline">see all your orders</Link>.
        </p>
      </main>
    </div>
  );
}
