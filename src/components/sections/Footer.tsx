import Link from "next/link";
import { Instagram, Twitter, Facebook } from "@/components/icons/Brand";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-px py-16 grid gap-10 md:grid-cols-4 items-start">
        <div className="md:col-span-1">
          <div className="font-display text-2xl tracking-tight">
            WRAP<span className="text-primary">TURE</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Asaba&apos;s hottest wrap. Open daily, 11:00 — 23:00.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Shop
          </p>
          <Link href="/#menu" className="hover:text-primary transition-colors">Menu</Link>
          <Link href="/track" className="hover:text-primary transition-colors">Track order</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Legal
          </p>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/refunds" className="hover:text-primary transition-colors">Refunds &amp; Cancellation</Link>
          <Link href="/delivery" className="hover:text-primary transition-colors">Delivery Policy</Link>
        </div>

        <div className="flex flex-col md:items-end gap-5">
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-2xl border border-border grid place-items-center hover:bg-secondary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-2xl border border-border grid place-items-center hover:bg-secondary transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-2xl border border-border grid place-items-center hover:bg-secondary transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
          <Button
            className="rounded-2xl h-12 px-6 uppercase tracking-[0.2em] text-xs"
            render={<Link href="/#menu" />}
          >
            Start an order
          </Button>
        </div>
      </div>
      <div className="container-px pb-8 text-xs text-muted-foreground uppercase tracking-widest">
        © 2026 Wrapture · Asaba
      </div>
    </footer>
  );
}
