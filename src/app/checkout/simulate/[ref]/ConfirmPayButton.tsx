"use client";

import { useTransition } from "react";

export function ConfirmPayButton({
  amountLabel,
  confirmAction,
  cancelAction,
}: {
  amountLabel: string;
  confirmAction: () => Promise<void>;
  cancelAction: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => confirmAction())}
        className="w-full h-12 rounded-xl bg-[#0fa958] hover:bg-[#0d9650] text-white font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {pending ? "Confirming payment…" : `Pay ${amountLabel}`}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => cancelAction())}
        className="w-full h-10 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        Cancel and go back
      </button>
    </div>
  );
}
