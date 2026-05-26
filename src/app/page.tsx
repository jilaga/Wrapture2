import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { MenuSection } from "@/components/sections/Menu";
import { Reviews } from "@/components/sections/Reviews";
import { Reels } from "@/components/sections/Reels";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Wrapture · Asaba's hottest shawarma & wraps, delivered",
  },
  description:
    "Hot shawarma, signature wraps and loaded fries — cooked fresh in Asaba, delivered to your door in under 45 minutes. Pay with card or transfer via Paystack.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <div className="hero-to-shop h-32 md:h-48" aria-hidden />
      <div className="shop-theme">
        <MenuSection />
        <Reviews />
        <Reels />
        <Footer />
      </div>
    </div>
  );
}
