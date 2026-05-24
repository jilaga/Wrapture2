import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background text-foreground grain">
      <div className="text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground mb-3">— 404</p>
        <h1 className="font-display text-7xl md:text-8xl uppercase mb-4">
          Lost in <span className="text-primary">the smoke.</span>
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          That page doesn&apos;t exist. The kitchen is still hot though.
        </p>
        <Button size="lg" className="rounded-2xl h-12 px-8 uppercase tracking-widest text-xs" render={<Link href="/" />}>
          Back to menu
        </Button>
      </div>
    </main>
  );
}
