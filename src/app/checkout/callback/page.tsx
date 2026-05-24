import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { verifyTransaction } from "@/lib/paystack";
import { sendOwnerNotification } from "@/lib/whatsapp";
import { setOrderStatus } from "@/lib/order-status";
import { Button } from "@/components/ui/button";

type SearchParams = Promise<{ reference?: string; trxref?: string }>;

type Outcome = "no-ref" | "success" | "failed" | "pending";

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

  let outcome: Outcome = "pending";

  if (!reference) {
    outcome = "no-ref";
  } else {
    try {
      const verifyRes = await verifyTransaction(reference);
      if (verifyRes?.data?.status === "success") {
        outcome = "success";
        const order = await setOrderStatus(reference, "paid", {
          paystackTxnId: String(verifyRes.data.id),
        });

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
      } else if (verifyRes?.data?.status === "failed") {
        outcome = "failed";
        await setOrderStatus(reference, "failed");
      }
    } catch {
      outcome = "pending";
    }
  }

  if (outcome === "success" && reference) {
    redirect(`/orders?placed=${reference}`);
  }

  if (outcome === "no-ref") {
    return (
      <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">No payment reference</h1>
          <Button render={<Link href="/" />}>Back home</Button>
        </div>
      </main>
    );
  }

  if (outcome === "failed") {
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

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-5xl mb-4">Verifying payment…</h1>
        <p className="text-muted-foreground mb-8">
          Hang tight. This usually takes a few seconds.
        </p>
        <meta httpEquiv="refresh" content="3" />
        <Button render={<Link href={`/track?ref=${reference ?? ""}`} />}>Track manually</Button>
      </div>
    </main>
  );
}
