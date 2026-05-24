"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/store/cart";
import { mergeCart, pushCart } from "@/app/actions/cart";

/**
 * Hybrid cart strategy:
 * - Always persisted to localStorage (zustand persist middleware).
 * - On first authenticated mount: merge local cart with server cart, replace local state with merged result, push back.
 * - On subsequent cart mutations while authenticated: debounced push to server.
 */
export function CartSyncer() {
  const { data: session } = useSession();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const mergedOnce = useRef(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge once after auth + hydration
  useEffect(() => {
    if (!session?.user || !hydrated || mergedOnce.current) return;
    mergedOnce.current = true;
    void (async () => {
      const res = await mergeCart(items);
      if (res.ok) {
        useCart.setState({ items: res.items });
      }
    })();
  }, [session?.user, hydrated, items]);

  // Debounced push on cart changes
  useEffect(() => {
    if (!session?.user || !mergedOnce.current) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      void pushCart(items);
    }, 800);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [items, session?.user]);

  return null;
}
