import Link from "next/link";
import { Instagram, Twitter, Facebook, TikTok } from "@/components/icons/Brand";
import { Button } from "@/components/ui/button";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/wrapture", icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com/@wrapture", icon: TikTok },
  { label: "X", href: "https://x.com/wrapture", icon: Twitter },
  { label: "Facebook", href: "https://facebook.com/wrapture", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      {/* Ambient smoke */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="smoke smoke-warm"
          style={{
            left: "8%",
            bottom: "-40%",
            width: 520,
            height: 520,
            animation: "smoke-halo 30s ease-in-out infinite",
          }}
        />
        <div
          className="smoke smoke-cool"
          style={{
            right: "-10%",
            bottom: "-30%",
            width: 420,
            height: 420,
            animation: "smoke-drift 24s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Accent divider strip */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container-px relative py-16 md:py-20">
        {/* Top row: brand + Order Now CTA */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-md">
            <div className="font-display text-5xl md:text-6xl tracking-tight leading-none">
              WRAP<span className="text-primary">TURE</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Hot wraps. Loaded fries. Delivered across Asaba in under an hour.
              We cook, we send it, you eat.
            </p>
          </div>

          <Button
            className="rounded-2xl h-12 px-6 uppercase tracking-[0.2em] text-xs self-start md:self-auto"
            render={<Link href="/#menu" />}
          >
            Start an order
          </Button>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-3 mb-14">
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Shop
            </p>
            <Link href="/#menu" className="hover:text-primary transition-colors">Menu</Link>
            <Link href="/track" className="hover:text-primary transition-colors">Track order</Link>
            <Link href="/orders" className="hover:text-primary transition-colors">My orders</Link>
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

          <div className="flex flex-col gap-3 text-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
              Follow
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-2xl border border-border bg-card grid place-items-center hover:bg-secondary hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">@wrapture everywhere.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} Wrapture · Asaba · Made with fire
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            Paystack · WhatsApp · NDPA-compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
