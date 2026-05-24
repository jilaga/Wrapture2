import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { MenuSection } from "@/components/sections/Menu";
import { Reviews } from "@/components/sections/Reviews";
import { Reels } from "@/components/sections/Reels";
import { Footer } from "@/components/sections/Footer";

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
