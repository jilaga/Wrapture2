import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNGN } from "@/lib/menu";

type SearchParams = Promise<{ ref?: string }>;

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid · preparing",
  preparing: "In the kitchen",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const { ref } = await searchParams;

  let order = null;
  if (ref) {
    const rows = await db.select().from(orders).where(eq(orders.reference, ref)).limit(1);
    order = rows[0] ?? null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-xl">
        <h1 className="font-display text-5xl mb-2">Track order</h1>
        <p className="text-muted-foreground mb-10">Drop your reference. We&apos;ll show you where it is.</p>

        <form className="flex gap-2 mb-8">
          <input
            name="ref"
            defaultValue={ref ?? ""}
            placeholder="WRP_…"
            className="flex-1 h-12 px-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" className="rounded-2xl h-12 px-6">Track</Button>
        </form>

        {ref && !order && (
          <p className="text-sm text-muted-foreground text-center py-8">No order found for that reference.</p>
        )}

        {order && (
          <article className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{order.reference}</p>
                <p className="text-sm mt-1">{new Date(order.createdAt).toLocaleString("en-NG")}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">{STATUS_LABEL[order.status] ?? order.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Delivering to: {order.deliveryAddress}</p>
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
