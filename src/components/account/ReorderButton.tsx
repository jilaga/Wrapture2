"use client";

import { useRouter } from "next/navigation";
import { Repeat } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { MENU } from "@/lib/menu";

type OrderItem = { id: string; name: string; qty: number; price: number };

export function ReorderButton({ items, address }: { items: OrderItem[]; address: string }) {
  const router = useRouter();
  const setItems = (next: Record<string, number>) => useCart.setState({ items: next });
  const setAddress = useCart((s) => s.setAddress);
  const current = useCart((s) => s.items);

  const reorder = () => {
    const merged: Record<string, number> = { ...current };
    let added = 0;
    for (const it of items) {
      if (!MENU.find((m) => m.id === it.id)) continue;
      merged[it.id] = (merged[it.id] ?? 0) + it.qty;
      added += it.qty;
    }
    if (added === 0) {
      toast.error("None of these items are on the menu anymore");
      return;
    }
    setItems(merged);
    if (address && !useCart.getState().address) setAddress(address);
    toast.success(`Added ${added} item${added === 1 ? "" : "s"} to your bag`, {
      description: "Open your bag to check out.",
    });
    router.push("/");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={reorder}
      className="rounded-2xl"
    >
      <Repeat className="w-3.5 h-3.5 mr-1.5" />
      Order again
    </Button>
  );
}
