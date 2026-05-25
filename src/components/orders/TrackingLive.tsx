"use client";

import { useEffect, useRef, useState } from "react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { STATUS_LABEL, isTerminal } from "@/lib/order-status";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus, OrderStatusEvent } from "@/db/schema";

type Rider = { name: string | null; phone: string | null } | null;

type LiveOrder = {
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  rider: Rider;
};

const INITIAL_DELAY_MS = 4_000;
const MAX_DELAY_MS = 30_000;
const BACKOFF_FACTOR = 1.6;

export function TrackingLive({
  trackingId,
  initial,
}: {
  trackingId: string;
  initial: LiveOrder;
}) {
  const [data, setData] = useState<LiveOrder>(initial);
  const delayRef = useRef(INITIAL_DELAY_MS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`/api/orders/track/${trackingId}`, { cache: "no-store" });
        if (res.ok) {
          const next = (await res.json()) as LiveOrder;
          if (cancelled) return;
          setData(next);
          if (isTerminal(next.status)) return; // stop polling
          // Reset backoff when we successfully detect a transition.
          if (next.status !== data.status) delayRef.current = INITIAL_DELAY_MS;
        }
      } catch {
        // swallow — exponential backoff handles transient failures
      }
      if (cancelled) return;
      delayRef.current = Math.min(delayRef.current * BACKOFF_FACTOR, MAX_DELAY_MS);
      timeoutRef.current = setTimeout(tick, delayRef.current);
    }

    if (!isTerminal(data.status)) {
      timeoutRef.current = setTimeout(tick, INITIAL_DELAY_MS);
    }

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // We intentionally re-create the loop only when trackingId changes; the
    // backoff state is internal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingId]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-primary text-primary-foreground">
          {STATUS_LABEL[data.status] ?? data.status}
        </Badge>
        {!isTerminal(data.status) && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse">
            live
          </span>
        )}
      </div>
      <OrderTimeline current={data.status} history={data.statusHistory ?? []} />
      {data.rider && (data.rider.name || data.rider.phone) && (
        <div className="mt-6 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Rider
          </p>
          <p className="text-sm font-medium">{data.rider.name ?? "—"}</p>
          {data.rider.phone && (
            <a
              href={`tel:${data.rider.phone}`}
              className="text-sm text-primary hover:underline"
            >
              {data.rider.phone}
            </a>
          )}
        </div>
      )}
    </>
  );
}
