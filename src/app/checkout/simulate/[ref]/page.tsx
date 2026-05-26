import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, orders } from "@/db";
import { formatNGN } from "@/lib/menu";
import { confirmSimulatedPayment, cancelSimulatedPayment } from "@/app/actions/simulate-pay";
import { ConfirmPayButton } from "./ConfirmPayButton";

export const metadata: Metadata = {
  title: "Simulated payment",
  robots: { index: false, follow: false },
};

type Params = Promise<{ ref: string }>;

export default async function SimulatePage({ params }: { params: Params }) {
  const { ref } = await params;
  const rows = await db.select().from(orders).where(eq(orders.reference, ref)).limit(1);
  const order = rows[0];
  if (!order) notFound();

  const isPaid = order.status !== "pending_payment";

  return (
    <main className="min-h-screen bg-[#0a0d14] text-white grid place-items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Sandbox · Simulated Paystack
          </div>
        </div>

        <div className="rounded-3xl bg-white text-black p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Pay Wrapture</div>
            <div className="font-mono text-3xl mt-2 font-semibold">{formatNGN(order.total)}</div>
            <div className="text-xs text-zinc-500 mt-1">Ref: {order.reference}</div>
          </div>

          <div className="border border-zinc-200 rounded-2xl p-4 mb-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Order summary</p>
            <ul className="space-y-1.5 text-sm">
              {(order.items ?? []).map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>
                    {it.qty}× {it.name}
                  </span>
                  <span className="text-zinc-500">{formatNGN(it.price * it.qty)}</span>
                </li>
              ))}
              <li className="flex justify-between pt-2 mt-2 border-t border-zinc-100 text-xs text-zinc-500">
                <span>Delivery</span>
                <span>{formatNGN(order.delivery)}</span>
              </li>
            </ul>
          </div>

          <div className="border border-zinc-200 rounded-2xl p-4 mb-5 space-y-2 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">Deliver to</p>
              <p>{order.customerName}</p>
              <p className="text-xs text-zinc-500">{order.deliveryAddress}</p>
              <p className="text-xs text-zinc-500">{order.customerPhone}</p>
            </div>
          </div>

          {isPaid ? (
            <div className="text-center text-sm text-zinc-500 py-4">
              This order has already been paid.
            </div>
          ) : (
            <form>
              <ConfirmPayButton
                amountLabel={formatNGN(order.total)}
                confirmAction={confirmSimulatedPayment.bind(null, order.reference)}
                cancelAction={cancelSimulatedPayment.bind(null, order.reference)}
              />
            </form>
          )}

          <p className="mt-4 text-[10px] text-center text-zinc-400 leading-relaxed">
            🧪 This is a simulated payment page. No real card data is processed.
            Once Paystack live keys are configured, this is replaced by the hosted
            Paystack checkout.
          </p>
        </div>

        <div className="text-center mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
          Powered by Paystack · Sandbox
        </div>
      </div>
    </main>
  );
}
