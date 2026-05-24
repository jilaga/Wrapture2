"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress } from "@/app/actions/addresses";

export function AddAddressForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  const submit = (form: FormData) => {
    startTransition(async () => {
      const res = await addAddress(form);
      if (res.ok) {
        formRef.current?.reset();
        toast.success("Address saved");
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={submit}
      className="rounded-3xl border border-border bg-card p-6 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" placeholder="Home" className="mt-1.5 h-11" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+234…" className="mt-1.5 h-11" />
        </div>
      </div>
      <div>
        <Label htmlFor="line">Street address</Label>
        <Input id="line" name="line" required placeholder="No. 12, Nnebisi Road, off Anwai" className="mt-1.5 h-11" />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" defaultValue="Asaba" className="mt-1.5 h-11" />
      </div>
      <Button type="submit" disabled={pending} className="rounded-2xl h-12 px-6">
        <Plus className="w-4 h-4 mr-1.5" />
        {pending ? "Saving…" : "Add address"}
      </Button>
    </form>
  );
}
