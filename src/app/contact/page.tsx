import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import { Instagram } from "@/components/icons/Brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";

export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER?.replace(/\D/g, "") ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container-px pt-28 pb-16 max-w-2xl flex-1">
        <h1 className="font-display text-5xl mb-2">Contact</h1>
        <p className="text-muted-foreground mb-10">Talk to us. We bite back (just a little).</p>

        <div className="space-y-3">
          {wa && (
            <Link
              href={`https://wa.me/${wa}`}
              target="_blank"
              className="flex items-center gap-4 rounded-3xl border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+{wa}</p>
              </div>
            </Link>
          )}
          <Link
            href="https://instagram.com/wrapture"
            target="_blank"
            className="flex items-center gap-4 rounded-3xl border border-border bg-card p-6 hover:border-primary transition-colors"
          >
            <Instagram className="w-6 h-6 text-primary" />
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">@wrapture</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-6">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">Asaba, Delta State, Nigeria</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
