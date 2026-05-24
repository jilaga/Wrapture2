"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = {
  items: Record<string, number>;
  address: string;
  hydrated: boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setAddress: (a: string) => void;
  setHydrated: () => void;
  mergeServer: (items: Record<string, number>) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      address: "",
      hydrated: false,
      add: (id) =>
        set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } })),
      remove: (id) =>
        set((s) => {
          const next = (s.items[id] ?? 0) - 1;
          const copy = { ...s.items };
          if (next <= 0) delete copy[id];
          else copy[id] = next;
          return { items: copy };
        }),
      setQty: (id, qty) =>
        set((s) => {
          const copy = { ...s.items };
          if (qty <= 0) delete copy[id];
          else copy[id] = qty;
          return { items: copy };
        }),
      clear: () => set({ items: {} }),
      setAddress: (a) => set({ address: a }),
      setHydrated: () => set({ hydrated: true }),
      mergeServer: (serverItems) =>
        set((s) => {
          const merged = { ...serverItems };
          for (const [id, qty] of Object.entries(s.items)) {
            merged[id] = (merged[id] ?? 0) + qty;
          }
          return { items: merged };
        }),
    }),
    {
      name: "wrapture-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, address: s.address }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

export const useCartCount = () =>
  useCart((s) => Object.values(s.items).reduce((a, b) => a + b, 0));
