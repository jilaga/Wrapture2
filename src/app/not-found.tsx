import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Package, MessageCircle, Flame } from "lucide-react";

const DESTINATIONS = [
  { href: "/#menu", label: "Browse the menu", desc: "Wraps, shawarma, loaded fries.", icon: ShoppingBag },
  { href: "/track", label: "Track an order", desc: "Have a 6-digit number? Drop it.", icon: Package },
  { href: "/contact", label: "Contact us", desc: "WhatsApp, Instagram, the works.", icon: MessageCircle },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground grain">
      {/* Smoke layer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="smoke smoke-warm"
          style={{ left: "15%", top: "25%", width: 460, height: 460, animation: "smoke-halo 30s ease-in-out infinite" }}
        />
        <div
          className="smoke smoke-cool"
          style={{ right: "10%", top: "10%", width: 340, height: 340, animation: "smoke-drift 26s ease-in-out infinite", animationDelay: "4s" }}
        />
        <div
          className="smoke smoke-warm"
          style={{ left: "50%", bottom: "-10%", width: 540, height: 540, animation: "smoke-rise 28s ease-in-out infinite", animationDelay: "7s" }}
        />
      </div>

      <div className="container-px relative min-h-screen flex flex-col items-center justify-center py-24 max-w-2xl text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-primary mb-4 flex items-center gap-2">
          <Flame className="w-3 h-3" /> 404 · Lost in the smoke
        </p>
        <h1 className="font-display text-7xl md:text-9xl uppercase mb-6 leading-[0.85]">
          This page <span className="text-primary">burned</span>.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed">
          The URL you followed doesn&apos;t exist — or it used to and we
          retired it. The kitchen is still hot though. Try one of these instead.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 w-full mb-12">
          {DESTINATIONS.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-3xl border border-border bg-card p-5 text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 grid place-items-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-medium text-sm mb-1">{label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
