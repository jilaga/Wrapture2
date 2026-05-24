"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  pending: boolean;
  onBack: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
};

export function CheckoutForm({ defaultName = "", defaultEmail = "", defaultPhone = "", pending, onBack, onSubmit }: Props) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      name: (form.get("name") ?? "").toString().trim(),
      email: (form.get("email") ?? "").toString().trim(),
      phone: (form.get("phone") ?? "").toString().trim(),
    });
  };

  return (
    <form onSubmit={submit} className="p-6 flex-1 flex flex-col gap-5">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground self-start">
        <ArrowLeft className="w-3 h-3" /> Back to cart
      </button>

      <div>
        <h3 className="font-display text-2xl mb-1">Who&apos;s ordering?</h3>
        <p className="text-xs text-muted-foreground">No password needed. We&apos;ll save it for next time.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={defaultName} placeholder="Ada Okonkwo" className="mt-1.5 h-11" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={defaultEmail} placeholder="you@example.com" className="mt-1.5 h-11" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required defaultValue={defaultPhone} placeholder="+234…" className="mt-1.5 h-11" />
          <p className="mt-1 text-[11px] text-muted-foreground">Rider calls this number for delivery.</p>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="w-full rounded-2xl h-14 uppercase tracking-[0.2em] text-xs bg-primary hover:bg-primary/90 shadow-blood"
        >
          {pending ? "Processing…" : "Place order"}
        </Button>
      </div>
    </form>
  );
}
