"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MENU, formatNGN } from "@/lib/menu";
import { useCart } from "@/store/cart";
import { useTransition } from "react";
import { checkoutAction } from "@/app/actions/checkout";

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const items = useCart((s) => s.items);
  const address = useCart((s) => s.address);
  const setAddress = useCart((s) => s.setAddress);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const [pending, startTransition] = useTransition();

  const cartItems = MENU.filter((m) => items[m.id]);
  const cartCount = Object.values(items).reduce((a, b) => a + b, 0);
  const subtotal = cartItems.reduce((sum, m) => sum + m.price * items[m.id], 0);
  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  const checkout = () => {
    if (!address.trim()) {
      toast.error("Add a delivery address first");
      return;
    }
    startTransition(async () => {
      const res = await checkoutAction({
        items,
        address,
        subtotal,
        delivery,
        total,
      });
      if (res.ok && res.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      } else if (res.ok && res.whatsappUrl) {
        // Fallback: open WhatsApp directly with order details
        window.open(res.whatsappUrl, "_blank");
        toast.success("Order sent", { description: "We'll confirm shortly." });
      } else if (!res.ok) {
        toast.error("Checkout failed", { description: res.error });
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-display text-3xl text-left">Your bag</SheetTitle>
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-left">
            {cartCount} item{cartCount === 1 ? "" : "s"}
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">
            {cartItems.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Your bag is empty.</p>
                <Button onClick={() => onOpenChange(false)} variant="link" className="text-primary mt-2">
                  Browse the menu
                </Button>
              </div>
            )}
            {cartItems.map((m) => (
              <div key={m.id} className="flex gap-4">
                <Image
                  src={m.image}
                  alt={m.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <h4 className="font-display text-lg">{m.name}</h4>
                    <button onClick={() => setQty(m.id, 0)} aria-label="Remove item">
                      <X className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatNGN(m.price)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 rounded-2xl border border-border">
                      <button
                        onClick={() => remove(m.id)}
                        className="p-1.5 hover:bg-secondary rounded-2xl"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{items[m.id]}</span>
                      <button
                        onClick={() => add(m.id)}
                        className="p-1.5 hover:bg-secondary rounded-2xl"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">{formatNGN(m.price * items[m.id])}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {cartItems.length > 0 && (
          <SheetFooter className="border-t border-border p-6 flex-col gap-4 sm:flex-col">
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatNGN(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{formatNGN(delivery)}</span>
              </div>
              <Separator className="my-2 bg-border" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatNGN(total)}</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={checkout}
              disabled={pending}
              size="lg"
              className="w-full rounded-2xl h-14 uppercase tracking-[0.2em] text-xs bg-primary hover:bg-primary/90 shadow-blood"
            >
              {pending ? "Processing…" : `Checkout — ${formatNGN(total)}`}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
