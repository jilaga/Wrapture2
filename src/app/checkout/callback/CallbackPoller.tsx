"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/db/schema";
import { STATUS_LABEL, isTerminal } from "@/lib/order-status";

const INITIAL_DELAY_MS = 2_000;
const MAX_DELAY_MS = 30_000;
const BACKOFF_FACTOR = 1.6;

export function CallbackPoller({
  reference,
  initialStatus,
}: {
  reference: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const router = useRouter();
  const delayRef = useRef(INITIAL_DELAY_MS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`/api/orders/track/${reference}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { status: OrderStatus };
        if (cancelled) return;
        setStatus(data.status);
        if (data.status !== "pending_payment") {
          router.replace(`/orders?placed=${reference}`);
          return;
        }
      } catch {
        // swallow — exponential backoff will retry
      }
      if (cancelled) return;
      delayRef.current = Math.min(delayRef.current * BACKOFF_FACTOR, MAX_DELAY_MS);
      timeoutRef.current = setTimeout(tick, delayRef.current);
    }

    timeoutRef.current = setTimeout(tick, INITIAL_DELAY_MS);
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reference, router]);

  if (status === "failed") {
    return (
      <p className="text-sm text-destructive">Payment failed. Please try again.</p>
    );
  }

  return (
    <p className="text-xs uppercase tracking-widest text-muted-foreground">
      {isTerminal(status) ? STATUS_LABEL[status] : "Waiting for confirmation…"}
    </p>
  );
}
