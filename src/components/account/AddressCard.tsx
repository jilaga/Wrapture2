"use client";

import { useTransition } from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteAddress, setDefaultAddress } from "@/app/actions/addresses";

type Address = {
  id: string;
  label: string;
  line: string;
  city: string;
  phone: string | null;
  isDefault: boolean;
};

export function AddressCard({ address }: { address: Address }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium">{address.label}</h3>
          {address.isDefault && <Badge className="bg-primary text-primary-foreground">Default</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{address.line}</p>
        <p className="text-sm text-muted-foreground">{address.city}{address.phone ? ` · ${address.phone}` : ""}</p>
      </div>
      <div className="flex flex-col gap-2">
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pending}
            onClick={() => startTransition(() => setDefaultAddress(address.id))}
            aria-label="Set default"
          >
            <Star className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={pending}
          onClick={() => startTransition(() => deleteAddress(address.id))}
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
