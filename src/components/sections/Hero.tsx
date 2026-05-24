import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-16 overflow-hidden grain bg-background">
      <Image
        src="/menu/hero-shawarma.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-contain object-right-bottom"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-transparent" aria-hidden />

      <div className="absolute inset-0 -z-[5] overflow-hidden pointer-events-none" aria-hidden>
        <div className="smoke" style={{ left: "55%", bottom: "10%", width: 320, height: 320, animation: "smoke-rise 14s ease-in-out infinite" }} />
        <div className="smoke" style={{ left: "70%", bottom: "20%", width: 260, height: 260, animation: "smoke-rise-2 18s ease-in-out infinite", animationDelay: "3s" }} />
        <div className="smoke" style={{ left: "45%", bottom: "5%", width: 380, height: 380, animation: "smoke-rise 22s ease-in-out infinite", animationDelay: "6s" }} />
        <div className="smoke" style={{ left: "60%", bottom: "30%", width: 220, height: 220, animation: "smoke-rise-2 16s ease-in-out infinite", animationDelay: "9s" }} />
      </div>

      <div className="container-px relative min-h-[92vh] flex flex-col justify-center pt-24 pb-20">
        <div className="animate-fade-up max-w-2xl">
          <h1 className="font-display leading-[0.9] text-balance text-7xl md:text-[8rem] font-bold uppercase">
            The taste<br />
            <span className="text-primary">to die</span><br />
            for.
          </h1>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            Hot shawarma. Loaded fries. Delivered to you.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="rounded-2xl h-14 px-8 uppercase tracking-[0.2em] text-xs bg-primary hover:bg-primary/90 shadow-blood"
              render={<Link href="#menu" />}
            >
              Order now <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
