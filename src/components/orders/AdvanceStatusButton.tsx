"use client";

import { useTransition } from "react";
import { FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { advanceOrderStatus } from "@/app/actions/simulate-pay";
import { nextStatus, TIMELINE_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/db/schema";

export function AdvanceStatusButton({
  reference,
  current,
}: {
  reference: string;
  current: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const next = nextStatus(current);
  if (!next) return null;

  const nextLabel = TIMELINE_LABEL[next as keyof typeof TIMELINE_LABEL] ?? next;

  return (
    <div className="rounded-3xl border border-dashed border-yellow-500/40 bg-yellow-500/5 p-4 mb-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 mb-2 flex items-center gap-1.5">
        <FlaskConical className="w-3 h-3" /> Dev simulator
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Advance this order to the next stage. Disabled in production.
      </p>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await advanceOrderStatus(reference);
            toast.success(`Advanced to ${nextLabel}`);
          })
        }
        className="rounded-2xl text-xs"
      >
        {pending ? "Advancing…" : `→ Mark as ${nextLabel}`}
      </Button>
    </div>
  );
}
