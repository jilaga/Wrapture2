import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { verifyTransaction } from "@/lib/paystack";
import { Button } from "@/components/ui/button";
import { formatNGN } from "@/lib/menu";

type SearchParams = Promise<{ reference?: string; trxref?: string }>;

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
          <h1 className="font-display text-3xl mb-4">No reference</h1>
          <Button render={<Link href="/" />}>Back home</Button>
        </div>
      </main>
    );
  }

  let status: "success" | "pending" | "failed" = "pending";
  let total = 0;

  try {
    const verifyRes = await verifyTransaction(reference);
    if (verifyRes?.data?.status === "success") {
      status = "success";
      total = (verifyRes.data.amount ?? 0) / 100;
      await db
        .update(orders)
        .set({ status: "paid", paystackTxnId: String(verifyRes.data.id) })
        .where(eq(orders.reference, reference));
    } else if (verifyRes?.data?.status === "failed") {
      status = "failed";
      await db.update(orders).set({ status: "failed" }).where(eq(orders.reference, reference));
    }
  } catch {
    status = "pending";
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground">
      <div className="max-w-md text-center">
        {status === "success" && (
          <>
            <h1 className="font-display text-5xl mb-4">Fire&apos;s lit. 🔥</h1>
            <p className="text-muted-foreground mb-2">Order received: {reference}</p>
            {total > 0 && <p className="text-muted-foreground mb-6">Paid: {formatNGN(total)}</p>}
            <p className="text-sm text-muted-foreground mb-8">ETA ~35 mins. We&apos;ll WhatsApp you the rider details.</p>
          </>
        )}
        {status === "failed" && (
          <>
            <h1 className="font-display text-5xl mb-4">Payment failed</h1>
            <p className="text-muted-foreground mb-8">Try again or pick another method.</p>
          </>
        )}
        {status === "pending" && (
          <>
            <h1 className="font-display text-5xl mb-4">Verifying…</h1>
            <p className="text-muted-foreground mb-8">Refresh in a moment.</p>
          </>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" render={<Link href="/orders" />}>My orders</Button>
          <Button render={<Link href="/" />}>Back home</Button>
        </div>
      </div>
    </main>
  );
}
