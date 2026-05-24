import { Check, Clock } from "lucide-react";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";
import { TIMELINE_LABEL, TIMELINE_STAGES } from "@/lib/order-status";

type Props = {
  current: OrderStatus;
  history: OrderStatusEvent[];
};

export function OrderTimeline({ current, history }: Props) {
  // Map status → most recent event timestamp
  const stamps = new Map<OrderStatus, string>();
  for (const e of history) stamps.set(e.status, e.at);

  // Terminal states render a different layout
  if (current === "cancelled") {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
        This order was cancelled.
      </div>
    );
  }
  if (current === "failed") {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
        Payment failed. The order was not placed.
      </div>
    );
  }

  const currentIdx = TIMELINE_STAGES.indexOf(current);

  return (
    <ol className="relative space-y-5">
      {TIMELINE_STAGES.map((stage, idx) => {
        const reached = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const at = stamps.get(stage);

        return (
          <li key={stage} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full grid place-items-center transition-colors ${
                  reached
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {reached ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              {idx < TIMELINE_STAGES.length - 1 && (
                <div
                  className={`flex-1 w-px my-1 transition-colors ${
                    idx < currentIdx ? "bg-primary" : "bg-border"
                  }`}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>

            <div className="pb-4 flex-1">
              <p
                className={`font-medium text-sm ${
                  reached ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {TIMELINE_LABEL[stage]}
                {isCurrent && (
                  <span className="ml-2 inline-block text-[10px] uppercase tracking-widest text-primary">
                    · now
                  </span>
                )}
              </p>
              {at && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(at).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
