"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
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
import { useSession } from "@/lib/auth-client";
import { checkoutAction } from "@/app/actions/checkout";
import { CheckoutForm } from "./CheckoutForm";

type Step = "cart" | "checkout";

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
  const clear = useCart((s) => s.clear);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const { data: session } = useSession();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("cart");

  const cartItems = MENU.filter((m) => items[m.id]);
  const cartCount = Object.values(items).reduce((a, b) => a + b, 0);
  const subtotal = cartItems.reduce((sum, m) => sum + m.price * items[m.id], 0);
  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  const submitCheckout = (d: {
    address: string;
    name: string;
    email: string;
    phone: string;
    saveAddress: boolean;
  }) => {
    setAddress(d.address);
    startTransition(async () => {
      const res = await checkoutAction({
        items,
        address: d.address,
        customerName: d.name,
        customerEmail: d.email,
        customerPhone: d.phone,
        saveAddress: d.saveAddress,
      });

      if (res.ok) {
        clear();
        if (res.authorizationUrl) {
          window.location.href = res.authorizationUrl;
        } else if (res.simulateUrl) {
          window.location.href = res.simulateUrl;
        }
      } else {
        toast.error("Checkout failed", { description: res.error });
      }
    });
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setStep("cart");
    onOpenChange(v);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="bg-background border-border w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-display text-3xl text-left">
            {step === "cart" ? "Your bag" : "Check out"}
          </SheetTitle>
          {step === "cart" && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-left">
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </p>
          )}
        </SheetHeader>

        {step === "checkout" ? (
          <CheckoutForm
            defaultAddress={address}
            defaultName={session?.user?.name ?? ""}
            defaultEmail={session?.user?.email ?? ""}
            hasSavedAddresses={false}
            totalLabel={formatNGN(total)}
            pending={pending}
            onBack={() => setStep("cart")}
            onSubmit={submitCheckout}
          />
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-5">
                {cartItems.length === 0 && (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Your bag is empty.</p>
                    <Button onClick={() => handleOpenChange(false)} variant="link" className="text-primary mt-2">
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
                          <button onClick={() => remove(m.id)} className="p-1.5 hover:bg-secondary rounded-2xl" aria-label="Decrease">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-5 text-center">{items[m.id]}</span>
                          <button onClick={() => add(m.id)} className="p-1.5 hover:bg-secondary rounded-2xl" aria-label="Increase">
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
                <Button
                  onClick={() => setStep("checkout")}
                  disabled={pending}
                  size="lg"
                  className="w-full rounded-2xl h-14 uppercase tracking-[0.2em] text-xs bg-primary hover:bg-primary/90 shadow-blood"
                >
                  Checkout — {formatNGN(total)}
                </Button>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
