import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { verifyTransaction } from "@/lib/paystack";
import { sendOwnerNotification } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ reference?: string; trxref?: string }>;

// After real Paystack payment, this page verifies and redirects straight to /orders.
// We never show the user a separate "thank you" screen — the orders page success banner
// covers it.
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

  try {
    const verifyRes = await verifyTransaction(reference);
    if (verifyRes?.data?.status === "success") {
      const [order] = await db
        .update(orders)
        .set({ status: "paid", paystackTxnId: String(verifyRes.data.id) })
        .where(eq(orders.reference, reference))
        .returning();

      if (order && !order.whatsappSent) {
        const itemsMap: Record<string, number> = {};
        for (const it of order.items ?? []) itemsMap[it.id] = it.qty;

        await sendOwnerNotification({
          reference: order.reference,
          address: order.deliveryAddress,
          items: itemsMap,
          subtotal: order.subtotal,
          delivery: order.delivery,
          total: order.total,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
        })
          .then(async (res) => {
            if (res.ok) {
              await db
                .update(orders)
                .set({ whatsappSent: true })
                .where(eq(orders.reference, reference));
            }
          })
          .catch(() => null);
      }

      redirect(`/orders?placed=${reference}`);
    }

    if (verifyRes?.data?.status === "failed") {
      await db.update(orders).set({ status: "failed" }).where(eq(orders.reference, reference));
      return (
        <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
          <div className="max-w-md text-center">
            <h1 className="font-display text-5xl mb-4">Payment failed</h1>
            <p className="text-muted-foreground mb-8">Try again or pick another method.</p>
            <Button render={<Link href="/" />}>Back to menu</Button>
          </div>
        </main>
      );
    }
  } catch {
    // Fall through to pending state.
  }

  // Pending / unknown state — show a soft "verifying" page that auto-refreshes.
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-5xl mb-4">Verifying payment…</h1>
        <p className="text-muted-foreground mb-8">
          Hang tight. This usually takes a few seconds.
        </p>
        <meta httpEquiv="refresh" content="3" />
        <Button render={<Link href={`/track?ref=${reference}`} />}>Track manually</Button>
      </div>
    </main>
  );
}
