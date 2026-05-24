import Link from "next/link";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, orders } from "@/db";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { formatNGN } from "@/lib/menu";
import { ReorderButton } from "@/components/account/ReorderButton";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid · preparing",
  preparing: "In the kitchen",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const list = session
    ? await db
        .select()
        .from(orders)
        .where(eq(orders.userId, session.user.id))
        .orderBy(desc(orders.createdAt))
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-3xl">
        <h1 className="font-display text-5xl mb-2">Your orders</h1>
        <p className="text-muted-foreground mb-10">Every wrap you&apos;ve had with us.</p>

        {!session && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-6">
              No orders yet. Place one — we&apos;ll save it here automatically.
            </p>
            <Button render={<Link href="/" />} size="lg" className="rounded-2xl h-12 px-6 uppercase tracking-widest text-xs">
              Browse menu
            </Button>
          </div>
        )}

        {session && list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No orders yet.</p>
        )}

        <div className="space-y-4">
          {list.map((o) => (
            <article key={o.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{o.reference}</p>
                  <p className="text-sm mt-1">{new Date(o.createdAt).toLocaleString("en-NG")}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">{STATUS_LABEL[o.status] ?? o.status}</Badge>
              </div>
              <ul className="space-y-1 text-sm">
                {(o.items ?? []).map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.qty}× {it.name}</span>
                    <span className="text-muted-foreground">{formatNGN(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-border text-sm">
                <div>
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-semibold">{formatNGN(o.total)}</span>
                </div>
                <ReorderButton items={o.items ?? []} address={o.deliveryAddress} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
