"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultAddress?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  hasSavedAddresses?: boolean;
  totalLabel: string;
  pending: boolean;
  onBack: () => void;
  onSubmit: (data: {
    address: string;
    name: string;
    email: string;
    phone: string;
    saveAddress: boolean;
  }) => void;
};

export function CheckoutForm({
  defaultAddress = "",
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
  hasSavedAddresses = false,
  totalLabel,
  pending,
  onBack,
  onSubmit,
}: Props) {
  // Default "save for next time" to checked only when user has no saved addresses yet
  const [saveAddress, setSaveAddress] = useState(!hasSavedAddresses);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      address: (form.get("address") ?? "").toString().trim(),
      name: (form.get("name") ?? "").toString().trim(),
      email: (form.get("email") ?? "").toString().trim(),
      phone: (form.get("phone") ?? "").toString().trim(),
      saveAddress,
    });
  };

  return (
    <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground self-start"
        >
          <ArrowLeft className="w-3 h-3" /> Back to bag
        </button>

        <div>
          <h3 className="font-display text-2xl mb-1">Delivery details</h3>
          <p className="text-xs text-muted-foreground">
            No password needed. We&apos;ll remember it for next time.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Delivery address</Label>
            <textarea
              id="address"
              name="address"
              required
              defaultValue={defaultAddress}
              rows={2}
              placeholder="No. 12, Nnebisi Road, off Anwai, Asaba"
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <label className="mt-2 flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground leading-tight">
                {hasSavedAddresses
                  ? "Add this to my saved addresses"
                  : "Remember this address for future orders"}
              </span>
            </label>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={defaultName}
              placeholder="Ada Okonkwo"
              className="mt-1.5 h-11"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              placeholder="you@example.com"
              className="mt-1.5 h-11"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={defaultPhone}
              placeholder="+234…"
              className="mt-1.5 h-11"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Rider calls this number for delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-6">
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="w-full rounded-2xl h-14 uppercase tracking-[0.2em] text-xs bg-primary hover:bg-primary/90 shadow-blood"
        >
          {pending ? "Processing…" : `Pay ${totalLabel}`}
        </Button>
        <p className="mt-3 text-[11px] text-center text-muted-foreground">
          Secure payment via Paystack. Order is placed once payment confirms.
        </p>
      </div>
    </form>
  );
}
