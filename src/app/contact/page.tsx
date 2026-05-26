import type { Metadata } from "next";
import { ArrowUpRight, Clock, MapPin, MessageCircle, Megaphone, Briefcase, Flame } from "lucide-react";
import { Instagram, Twitter, Facebook, TikTok } from "@/components/icons/Brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Wrapture — WhatsApp for orders and support, socials for the daily heat, email for press and partnerships.",
  alternates: { canonical: "/contact" },
};

type Channel = {
  name: string;
  handle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  best: string;
  accent?: "primary" | "muted";
};

export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER?.replace(/\D/g, "") ?? "";

  const channels: Channel[] = [
    {
      name: "Instagram",
      handle: "@wrapture",
      href: "https://instagram.com/wrapture",
      icon: Instagram,
      best: "Menu drops, behind-the-counter, the daily heat.",
    },
    {
      name: "TikTok",
      handle: "@wrapture",
      href: "https://tiktok.com/@wrapture",
      icon: TikTok,
      best: "Wraps in motion. Volume up.",
    },
    {
      name: "X (Twitter)",
      handle: "@wrapture",
      href: "https://x.com/wrapture",
      icon: Twitter,
      best: "Quick shouts, openings, downtime updates.",
    },
    {
      name: "Facebook",
      handle: "Wrapture",
      href: "https://facebook.com/wrapture",
      icon: Facebook,
      best: "Long-form posts and event announcements.",
    },
  ];

  const reasons = [
    {
      icon: MessageCircle,
      title: "Order issue or refund",
      copy: "WhatsApp us with your 6-digit tracking number. We reply within minutes during open hours.",
      cta: wa ? { label: "Open WhatsApp", href: `https://wa.me/${wa}` } : null,
    },
    {
      icon: Megaphone,
      title: "Press or media",
      copy: "We love a feature. Email press@wrapture.ng with the angle and any deadlines.",
      cta: { label: "press@wrapture.ng", href: "mailto:press@wrapture.ng" },
    },
    {
      icon: Briefcase,
      title: "Partnerships and catering",
      copy: "Event, brand collab, bulk order, or a wholesale request? Drop a line.",
      cta: { label: "hello@wrapture.ng", href: "mailto:hello@wrapture.ng" },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* Hero with smoke */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="smoke smoke-warm"
            style={{ left: "10%", top: "20%", width: 360, height: 360, animation: "smoke-halo 28s ease-in-out infinite" }}
          />
          <div
            className="smoke smoke-cool"
            style={{ right: "5%", top: "10%", width: 280, height: 280, animation: "smoke-drift 22s ease-in-out infinite", animationDelay: "3s" }}
          />
          <div
            className="smoke smoke-warm"
            style={{ left: "55%", bottom: "-15%", width: 420, height: 420, animation: "smoke-rise 26s ease-in-out infinite", animationDelay: "6s" }}
          />
        </div>

        <div className="container-px relative pt-32 pb-20 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
            <Flame className="w-3 h-3" /> Talk to us
          </p>
          <h1 className="font-display text-6xl md:text-7xl leading-[0.95] mb-6">
            We&apos;re a WhatsApp <span className="text-primary">away</span>.
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
            For orders, problems, redos and refunds — WhatsApp is the fastest path.
            For everything else, pick the channel that suits you below.
          </p>

          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 mt-10 rounded-2xl bg-primary text-primary-foreground px-6 h-14 hover:bg-primary/90 transition-colors shadow-blood"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.2em]">WhatsApp +{wa}</span>
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </section>

      {/* "What do you need?" reason cards */}
      <section className="container-px py-20 max-w-5xl w-full">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Pick the closest fit
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">What do you need?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {reasons.map(({ icon: Icon, title, copy, cta }) => (
            <article
              key={title}
              className="rounded-3xl border border-border bg-card p-6 flex flex-col"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/10 grid place-items-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{copy}</p>
              {cta && (
                <a
                  href={cta.href}
                  target={cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
                >
                  {cta.label}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Visit / hours card row */}
      <section className="container-px pb-20 max-w-5xl w-full">
        <div className="grid md:grid-cols-2 gap-4">
          <article className="rounded-3xl border border-border bg-card p-7 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div
                className="smoke smoke-cool"
                style={{ right: "-20%", top: "-20%", width: 260, height: 260, animation: "smoke-halo 32s ease-in-out infinite" }}
              />
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 grid place-items-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                Where we cook
              </p>
              <h3 className="font-display text-2xl mb-3">Asaba, Delta State</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                We&apos;re a delivery-first kitchen serving every corner of Asaba.
                Walk-ups by appointment over WhatsApp.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Asaba+Delta+State+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent transition-colors"
              >
                Open in Google Maps
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-card p-7 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div
                className="smoke smoke-warm"
                style={{ left: "-15%", bottom: "-20%", width: 240, height: 240, animation: "smoke-drift 26s ease-in-out infinite", animationDelay: "2s" }}
              />
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 grid place-items-center mb-4">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                When we&apos;re open
              </p>
              <h3 className="font-display text-2xl mb-3">11:00 — 23:00, every day</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>Last orders</span>
                  <span className="text-foreground">22:30</span>
                </li>
                <li className="flex justify-between">
                  <span>Typical delivery</span>
                  <span className="text-foreground">35–45 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Public holidays</span>
                  <span className="text-foreground">Announced on Instagram</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Socials grid */}
      <section className="container-px pb-24 max-w-5xl w-full">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Daily heat
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-10">Find us online</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map(({ name, handle, href, icon: Icon, best }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-border bg-card p-6 hover:border-primary transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 grid place-items-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="font-display text-xl mb-1">{name}</p>
              <p className="text-sm text-primary mb-3">{handle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{best}</p>
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Press, partnership and catering enquiries:{" "}
          <a href="mailto:hello@wrapture.ng" className="text-primary hover:underline">
            hello@wrapture.ng
          </a>
          .
        </p>
      </section>

      <Footer />
    </div>
  );
}
