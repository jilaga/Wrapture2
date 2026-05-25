import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db, orders } from "@/db";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { TrackingLive } from "@/components/orders/TrackingLive";
import { ReorderButton } from "@/components/account/ReorderButton";
import { AdvanceStatusButton } from "@/components/orders/AdvanceStatusButton";
import { formatNGN } from "@/lib/menu";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";

type Params = Promise<{ ref: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { ref } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const rows = await db.select().from(orders).where(eq(orders.reference, ref)).limit(1);
  const order = rows[0];
  if (!order) notFound();

  // Allow access if: (a) the user owns the order, OR (b) no session at all
  // (guest tracking via URL). The reference is unguessable enough to act as a token.
  if (session && order.userId && session.user.id !== order.userId) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-3 h-3" /> All orders
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-4">Order tracking</h1>
        {order.trackingNumber && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Tracking number</p>
            <p className="font-mono text-2xl tracking-wider">{order.trackingNumber}</p>
          </div>
        )}
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Reference</p>
        <p className="font-mono text-xs text-muted-foreground mb-10">{order.reference}</p>

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Status</h2>
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
        </section>

        {process.env.NODE_ENV !== "production" && (
          <AdvanceStatusButton reference={order.reference} current={order.status as OrderStatus} />
        )}

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Delivery</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Address</dt>
              <dd>{order.deliveryAddress}</dd>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{order.customerName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{order.customerPhone ?? "—"}</dd>
              </div>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Items</h2>
          <ul className="space-y-2 text-sm">
            {(order.items ?? []).map((it) => (
              <li key={it.id} className="flex justify-between">
                <span>{it.qty}× {it.name}</span>
                <span className="text-muted-foreground">{formatNGN(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatNGN(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>{formatNGN(order.delivery)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-1">
              <span>Total</span>
              <span>{formatNGN(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <ReorderButton items={order.items ?? []} address={order.deliveryAddress} />
          <Button variant="outline" render={<Link href="/orders" />} className="rounded-2xl">
            All orders
          </Button>
        </div>
      </main>
    </div>
  );
}
