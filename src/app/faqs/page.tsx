import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Wrapture FAQs — delivery area, payment options, allergens, catering and minimum order.",
  alternates: { canonical: "/faqs" },
};

const FAQS = [
  { q: "Where do you deliver?", a: "Everywhere in Asaba. Outside Asaba — not yet." },
  { q: "How long does delivery take?", a: "Usually 35–45 minutes from order to door." },
  { q: "What's the minimum order?", a: "₦5,000." },
  { q: "How do I pay?", a: "Card or bank transfer via Paystack at checkout. Pay-on-delivery for verified addresses only." },
  { q: "What if my order is wrong?", a: "WhatsApp us with your reference. We re-make it or refund." },
  { q: "Do you cater events?", a: "Yes. WhatsApp us at least 48 hours ahead." },
];

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl flex-1">
        <h1 className="font-display text-5xl mb-2">FAQs</h1>
        <p className="text-muted-foreground mb-10">Quick answers. No fluff.</p>
        <dl className="space-y-6">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6">
              <dt className="font-display text-xl mb-2">{f.q}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </div>
  );
}
